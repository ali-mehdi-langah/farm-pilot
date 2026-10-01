"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function submitInspection(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bookingId = formData.get("booking_id");
  const result = formData.get("result");

  const { error } = await supabase.from("inspections").insert({
    booking_id: bookingId,
    inspector_id: user.id,
    result,
    grade: formData.get("grade") || null,
    moisture: formData.get("moisture") ? Number(formData.get("moisture")) : null,
    notes: formData.get("notes") || null,
  });
  if (error) throw new Error(error.message);

  await supabase.from("bookings").update({ queue_status: result }).eq("id", bookingId);

  revalidatePath("/inspector/bookings");
  redirect("/inspector/bookings");
}