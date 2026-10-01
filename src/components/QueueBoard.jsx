"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ACTIVE_STATUSES, DONE_STATUSES, STATUS_STYLES, statusLabel } from "@/lib/queue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STAT_CARDS = [
  { key: "booked", label: "Waiting" },
  { key: "checked_in", label: "Checked in" },
  { key: "weighing", label: "Weighing" },
  { key: "quality_check", label: "Quality check" },
  { key: "payment", label: "Payment" },
  { key: "completed", label: "Completed" },
];

const VIEWS = [
  { key: "active", label: "Active" },
  { key: "done", label: "Finished" },
  { key: "all", label: "All" },
];

export function QueueBoard({ bookings, date }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [view, setView] = useState("active");

  // Live updates: refetch server data whenever a booking for this date changes
  useEffect(() => {
    const channel = supabase
      .channel(`queue-${date}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings", filter: `booking_date=eq.${date}` },
        () => router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router, date]);

  const counts = useMemo(() => {
    const c = {};
    bookings.forEach((b) => (c[b.status] = (c[b.status] || 0) + 1));
    return c;
  }, [bookings]);

  const showCenter = useMemo(
    () => new Set(bookings.map((b) => b.center)).size > 1,
    [bookings]
  );

  const rows = bookings.filter((b) =>
    view === "all"
      ? true
      : view === "active"
      ? ACTIVE_STATUSES.includes(b.status)
      : DONE_STATUSES.includes(b.status)
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STAT_CARDS.map((s) => (
          <div key={s.key} className="rounded-lg border p-3">
            <p className="text-2xl font-semibold tabular-nums">{counts[s.key] || 0}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="date"
          className="sm:w-44"
          value={date}
          onChange={(e) => e.target.value && router.push(`/staff/queue?date=${e.target.value}`)}
        />

        <div className="flex gap-2">
          {VIEWS.map((v) => (
            <Button
              key={v.key}
              size="sm"
              variant={view === v.key ? "default" : "outline"}
              onClick={() => setView(v.key)}
            >
              {v.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Queue */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Farmer</TableHead>
              {showCenter && <TableHead>Center</TableHead>}
              <TableHead>Produce</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showCenter ? 7 : 6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No bookings in this view.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((b) => (
                <QueueRow key={b.id} b={b} showCenter={showCenter} supabase={supabase} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function QueueRow({ b, showCenter, supabase }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [weight, setWeight] = useState("");
  const [error, setError] = useState(null);

  // fn returns an error message string, or nothing on success
  const run = (fn) => {
    setError(null);
    startTransition(async () => {
      const message = await fn();
      if (message) setError(message);
      else router.refresh();
    });
  };

  // Simple transition, guarded by the status we expect it to be in
  const changeStatus = (from, to) =>
    run(async () => {
      const { data, error } = await supabase
        .from("bookings")
        .update({ queue_status: to })
        .eq("booking_id", b.id)
        .eq("queue_status", from)
        .select("booking_id");

      if (error) return error.message;
      if (!data?.length) return "This booking was changed by someone else. Refresh and retry.";
    });

  const recordWeight = (e) => {
    e.preventDefault();
    const w = Number(weight);
    if (!w || w <= 0) {
      setError("Enter a valid weight in kg.");
      return;
    }
    run(async () => {
      const { error } = await supabase.rpc("record_weight", {
        target_booking: b.id,
        weight: w,
      });
      if (error) return error.message;
      setWeight("");
    });
  };

  const completePayment = () =>
    run(async () => {
      const { error } = await supabase.rpc("complete_payment", { target_booking: b.id });
      return error?.message;
    });

  return (
    <TableRow>
      <TableCell className="text-base font-semibold">#{b.token}</TableCell>

      <TableCell>
        <div className="font-medium">{b.farmer}</div>
        {b.phone && <div className="text-xs text-muted-foreground">{b.phone}</div>}
      </TableCell>

      {showCenter && <TableCell>{b.center}</TableCell>}

      <TableCell>
        <div>
          {b.crop} &middot; {Number(b.quantity).toLocaleString("en-US")} kg est.
        </div>
        {b.weight && (
          <div className="text-xs text-muted-foreground">
            Weighed {Number(b.weight).toLocaleString("en-US")} kg
            {b.grade && ` · Grade ${b.grade}`}
          </div>
        )}
      </TableCell>

      <TableCell className="whitespace-nowrap">{b.slot}</TableCell>

      <TableCell>
        <Badge variant="outline" className={`capitalize ${STATUS_STYLES[b.status] ?? ""}`}>
          {statusLabel(b.status)}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center justify-end gap-2">
            {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}

            {b.status === "booked" && (
              <>
                <Button size="sm" disabled={isPending} onClick={() => changeStatus("booked", "checked_in")}>
                  Check in
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => changeStatus("booked", "no_show")}
                >
                  No show
                </Button>
              </>
            )}

            {b.status === "checked_in" && (
              <Button size="sm" disabled={isPending} onClick={() => changeStatus("checked_in", "weighing")}>
                Start weighing
              </Button>
            )}

            {b.status === "weighing" && (
              <form onSubmit={recordWeight} className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Weight (kg)"
                  className="h-8 w-28"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  disabled={isPending}
                />
                <Button size="sm" type="submit" disabled={isPending}>
                  Save weight
                </Button>
              </form>
            )}

            {b.status === "quality_check" && (
              <span className="text-xs text-muted-foreground">With quality inspector</span>
            )}

            {b.status === "payment" && (
              <>
                {b.total !== null && (
                  <span className="text-sm font-medium tabular-nums">
                    Rs {Number(b.total).toLocaleString("en-PK")}
                  </span>
                )}
                <Button size="sm" disabled={isPending || b.total === null} onClick={completePayment}>
                  Mark paid
                </Button>
              </>
            )}
          </div>

          {error && <p className="max-w-64 text-right text-xs text-red-500">{error}</p>}
        </div>
      </TableCell>
    </TableRow>
  );
}