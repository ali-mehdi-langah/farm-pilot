"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, ListOrdered, UserCheck, Wallet, Sprout } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

const items = [
  { title: "Dashboard", url: "/staff", icon: LayoutDashboard },
  { title: "Queue", url: "/staff/queue", icon: ListOrdered },
];

const matches = (pathname, url) =>
  url === "/staff" ? pathname === url : pathname === url || pathname.startsWith(url + "/");

export function StaffSidebar({ user }) {
  const pathname = usePathname();
  const activeUrl = items
    .map((i) => i.url)
    .filter((u) => matches(pathname, u))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/staff" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sprout className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Farm Pilot</span>
                <span className="truncate text-xs text-muted-foreground">Center staff</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton render={<Link href={item.url} />} isActive={item.url === activeUrl}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
          <div className="grid text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.name || "Staff"}</span>
            <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
          </div>
          <LogoutButton className="w-full" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}