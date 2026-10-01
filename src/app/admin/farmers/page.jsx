import { createClient } from "@/utils/supabase/server";
import { FarmersTable } from "@/components/FarmersTable";

export default async function FarmersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: users, error }, { data: centers }] = await Promise.all([
    supabase
      .from("profiles")
      .select(`*, farmers (*)`)
      .order("created_at", { ascending: false }),
    supabase
      .from("procurement_centers")
      .select("center_id, center_name")
      .order("center_name"),
  ]);

  if (error) console.error("Error fetching users:", error);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Approve farmer registrations and manage user roles.
        </p>
      </div>

      <FarmersTable
        users={users ?? []}
        centers={centers ?? []}
        currentUserId={user?.id}
      />
    </div>
  );
}