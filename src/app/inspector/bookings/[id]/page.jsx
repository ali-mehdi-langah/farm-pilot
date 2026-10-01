import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requireRole } from "@/lib/auth";
import { InspectionForm } from "@/components/InspectionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const kg = (n) => Number(n).toLocaleString("en-US");

export default async function InspectPage({ params }) {
  await requireRole(["quality_inspector", "admin"]);

  const { id } = await params;
  const supabase = await createClient();

  const { data: b, error } = await supabase
    .from("bookings")
    .select(
      `
      booking_id, token_number, crop_type, estimated_quantity, booking_date, time_slot, queue_status,
      procurement_centers ( center_name ),
      farmers ( profiles ( full_name, phone ) ),
      procurements ( actual_weight )
    `
    )
    .eq("booking_id", id)
    .maybeSingle();

  if (error || !b) notFound();

  const p = Array.isArray(b.procurements) ? b.procurements[0] : b.procurements;
  const waiting = b.queue_status === "quality_check";
  const weight = p?.actual_weight ?? null;

  const details = [
    ["Farmer", b.farmers?.profiles?.full_name || "Unknown"],
    ["Phone", b.farmers?.profiles?.phone || "-"],
    ["Center", b.procurement_centers?.center_name || "-"],
    ["Crop", b.crop_type],
    ["Estimated", `${kg(b.estimated_quantity)} kg`],
    ["Weighed", weight ? `${kg(weight)} kg` : "Not recorded"],
    ["Date", b.booking_date],
    ["Slot", b.time_slot],
  ];

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <Link href="/inspector/bookings" className="text-sm text-muted-foreground underline">
        &larr; Pending inspections
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Token #{b.token_number}</CardTitle>
          <CardDescription>Inspect the produce, then grade and price it.</CardDescription>
        </CardHeader>

        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {!waiting ? (
        <p className="rounded-lg border p-4 text-sm text-muted-foreground">
          This booking is no longer waiting for inspection (status:{" "}
          {b.queue_status.replaceAll("_", " ")}).
        </p>
      ) : !weight ? (
        <p className="rounded-lg border p-4 text-sm text-muted-foreground">
          The weight hasn&apos;t been recorded yet.
        </p>
      ) : (
        <InspectionForm bookingId={b.booking_id} weight={weight} />
      )}
    </div>
  );
}