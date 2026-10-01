import { requireRole } from "@/lib/auth";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { StaffSidebar } from "@/components/StaffSidebar";

export default async function StaffLayout({ children }) {
  const user = await requireRole(["center_staff"]);

  return (
    <SidebarProvider>
      <StaffSidebar user={{ name: user.full_name, email: user.email }} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Center portal</span>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}