import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import FarmerDashboard from "@/components/FarmerDashboard";

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
      <FarmerDashboard/>
    </div>
  );
}