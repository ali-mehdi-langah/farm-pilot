import { requireRole } from "@/lib/auth";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { InspectorSidebar } from "@/components/InspectorSidebar";

export default async function InspectorLayout({ children }) {
  const user = await requireRole(["quality_inspector"]);

  return (
    <SidebarProvider>
      <InspectorSidebar user={{ name: user.full_name, email: user.email }} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Quality Inspector portal</span>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}