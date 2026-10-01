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
import {
  LayoutDashboard,
  ClipboardCheck,
  Receipt,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

const BASE = "/inspector";

const mainItems = [
  { title: "Dashboard", url: BASE, icon: LayoutDashboard },
  { title: "Inspections", url: `${BASE}/bookings`, icon: ClipboardCheck },
  { title: "Procurements", url: `${BASE}/procurements`, icon: Receipt },
];

const accountItems = [
  { title: "Profile", url: `${BASE}/profile`, icon: UserRound },
];

const matches = (pathname, url) =>
  url === BASE
    ? pathname === url
    : pathname === url || pathname.startsWith(url + "/");

export function InspectorSidebar({ user }) {
  const pathname = usePathname();

  // Longest matching url wins so parent routes don't double-highlight
  const activeUrl = [...mainItems, ...accountItems]
    .map((i) => i.url)
    .filter((u) => matches(pathname, u))
    .sort((a, b) => b.length - a.length)[0];

  const renderItems = (items) =>
    items.map((item) => (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton
          render={<Link href={item.url} />}
          isActive={item.url === activeUrl}
        >
          <item.icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href={BASE} />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Farm Pilot</span>
                <span className="truncate text-xs text-muted-foreground">
                  Quality inspector
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quality</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(accountItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
          <div className="grid text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user?.name || "Inspector"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
          <LogoutButton className="w-full" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}