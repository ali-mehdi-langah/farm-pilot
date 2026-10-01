import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { CreateCenterForm } from "@/components/CreateCenterForm";

export default async function FarmerHome() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmer_details")
    .select("name, phone, location, registration_status")
    .eq("farmer_id", user.id)
    .single();

  return (
    <div className="p-10 space-y-3">
      <h1 className="text-2xl font-semibold">Admin dashboard</h1>
      <p>Welcome, {farmer?.name}</p>
      <p>Registration: {farmer?.registration_status}</p>
      <LogoutButton />

      <CreateCenterForm />
    </div>
  );
}