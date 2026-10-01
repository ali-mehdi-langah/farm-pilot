"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

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

const PAGE_SIZE = 10;

const STATUSES = [
  "booked",
  "checked_in",
  "weighing",
  "quality_check",
  "payment",
  "completed",
  "cancelled",
  "no_show",
];

const STATUS_STYLES = {
  booked: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  checked_in: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-900",
  weighing: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  quality_check: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900",
  payment: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900",
  completed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800",
  no_show: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
};

const label = (s) => s.replace("_", " ");

const selectClass =
  "h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function AdminBookingsTable({ bookings }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (!q) return true;
      return (
        b.farmer.toLowerCase().includes(q) ||
        b.crop.toLowerCase().includes(q) ||
        b.center.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        String(b.token) === q.replace("#", "")
      );
    });
  }, [bookings, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search farmer, crop, center, token"
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className={selectClass}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Farmer</TableHead>
              <TableHead>Center</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead className="text-right">Qty (kg)</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-semibold">#{b.token}</TableCell>
                  <TableCell>
                    <div className="font-medium">{b.farmer}</div>
                    {b.phone && (
                      <div className="text-xs text-muted-foreground">{b.phone}</div>
                    )}
                  </TableCell>
                  <TableCell>{b.center}</TableCell>
                  <TableCell>{b.crop}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {Number(b.quantity).toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{b.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{b.slot}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${STATUS_STYLES[b.status] ?? ""}`}
                    >
                      {label(b.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {filtered.length} booking{filtered.length === 1 ? "" : "s"}
          {filtered.length !== bookings.length && ` (of ${bookings.length})`}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}