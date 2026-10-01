import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { requireRole } from "@/lib/auth";

export default async function InspectorBookings() {
  await requireRole(["quality_inspector", "admin"]);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      booking_id, token_number, crop_type, estimated_quantity, booking_date, time_slot,
      farmers ( profiles ( full_name ) ),
      procurements ( actual_weight )
    `
    )
    .eq("queue_status", "quality_check")
    .order("booking_date")
    .order("token_number");

  if (error) {
    return <p className="p-6 text-destructive">{error.message}</p>;
  }

  const bookings = data ?? [];

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Pending inspections</h1>

      {bookings.length === 0 && (
        <p className="text-muted-foreground">Nothing to inspect.</p>
      )}

      <ul className="divide-y rounded-lg border">
        {bookings.map((b) => {
          const p = Array.isArray(b.procurements) ? b.procurements[0] : b.procurements;

          return (
            <li key={b.booking_id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <span className="text-xl font-semibold tabular-nums">#{b.token_number}</span>
                <div>
                  <p className="font-medium">
                    {b.crop_type} &middot; {b.farmers?.profiles?.full_name || "Unknown farmer"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {p?.actual_weight
                      ? `${Number(p.actual_weight).toLocaleString("en-US")} kg weighed`
                      : `${Number(b.estimated_quantity).toLocaleString("en-US")} kg est.`}
                    {" · "}
                    {b.booking_date} &middot; {b.time_slot}
                  </p>
                </div>
              </div>

              <Link
                href={`/inspector/bookings/${b.booking_id}`}
                className="text-sm underline"
              >
                Inspect
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}