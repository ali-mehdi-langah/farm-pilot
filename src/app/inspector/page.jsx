import { getCurrentUser } from "@/lib/auth";
import { AccountInfo } from "@/components/AccountInfo";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <AccountInfo
      user={user}
      title="Inspector info"
      href="/inspector/bookings"
      linkLabel="Pending inspections"
    />
  );
}