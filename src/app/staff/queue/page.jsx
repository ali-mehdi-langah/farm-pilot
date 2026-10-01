import { createClient } from "@/utils/supabase/server";
import { requireRole } from "@/lib/auth";
import { QueueBoard } from "@/components/QueueBoard";

const TZ = "Asia/Karachi";
const todayStr = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD

export default async function QueuePage({ searchParams }) {
  await requireRole(["center_staff", "admin"]);

  const { date: dateParam } = await searchParams;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateParam ?? "") ? dateParam : todayStr();

   const supabase = await createClient();

  const { data: rows, error } = await supabase
  .from("bookings")
  .select("*")
  .order("center_id")
  .order("token_number");



if (error) console.error("Queue fetch error:", error);

const list = rows ?? [];
const farmerIds = [...new Set(list.map((r) => r.farmer_id))];
const centerIds = [...new Set(list.map((r) => r.center_id))];
const bookingIds = list.map((r) => r.booking_id);

const [{ data: profiles }, { data: centers }, { data: procs }] = await Promise.all([
  supabase.from("profiles").select("id, full_name, phone").in("id", farmerIds),
  supabase.from("procurement_centers").select("center_id, center_name").in("center_id", centerIds),
  supabase
    .from("procurements")
    .select("booking_id, actual_weight, quality_grade, total_amount")
    .in("booking_id", bookingIds),
]);

const profileById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
const centerById = Object.fromEntries((centers ?? []).map((c) => [c.center_id, c]));
const procByBooking = Object.fromEntries((procs ?? []).map((p) => [p.booking_id, p]));

const bookings = list.map((b) => ({
  id: b.booking_id,
  token: b.token_number,
  farmer: profileById[b.farmer_id]?.full_name || "Unknown",
  phone: profileById[b.farmer_id]?.phone || "",
  center: centerById[b.center_id]?.center_name || "-",
  crop: b.crop_type,
  quantity: b.estimated_quantity,
  slot: b.time_slot,
  status: b.queue_status,
  weight: procByBooking[b.booking_id]?.actual_weight ?? null,
  grade: procByBooking[b.booking_id]?.quality_grade ?? null,
  total: procByBooking[b.booking_id]?.total_amount ?? null,
}));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Queue</h1>
        <p className="text-sm text-muted-foreground">
          Move each booking through check-in, weighing, quality check and payment.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">Could not load queue: {error.message}</p>}

      <QueueBoard bookings={bookings} date={date} />
    </div>
  );
}