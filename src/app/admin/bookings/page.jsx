import { createClient } from "@/utils/supabase/server";
import { requireRole } from "@/lib/auth";
import { AdminBookingsTable } from "@/components/AdminBookingsTable";

export default async function AdminBookingsPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      booking_id,
      token_number,
      crop_type,
      estimated_quantity,
      booking_date,
      time_slot,
      queue_status,
      procurement_centers ( center_name ),
      farmers ( profiles ( full_name, phone ) )
    `
    )
    .order("booking_date", { ascending: false })
    .order("token_number", { ascending: true });

  if (error) console.error("Error fetching bookings:", error);

  // Flatten so the client component stays simple
  const bookings = (data ?? []).map((b) => ({
    id: b.booking_id,
    token: b.token_number,
    farmer: b.farmers?.profiles?.full_name || "Unknown",
    phone: b.farmers?.profiles?.phone || "",
    center: b.procurement_centers?.center_name || "-",
    crop: b.crop_type,
    quantity: b.estimated_quantity,
    date: b.booking_date,
    slot: b.time_slot,
    status: b.queue_status,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          All slot bookings across every procurement center.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500">Could not load bookings: {error.message}</p>
      )}

      <AdminBookingsTable bookings={bookings} />
    </div>
  );
}