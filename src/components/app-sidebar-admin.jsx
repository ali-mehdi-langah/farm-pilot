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
  Users,
  CalendarDays,
  Receipt,
  Sprout,
  Settings,
} from "lucide-react";

import { LogoutButton } from "@/components/LogoutButton";

const mainItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Farmers",
    url: "/admin/farmers",
    icon: Users,
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    title: "Procurements",
    url: "/admin/procurements",
    icon: Receipt,
  },
];

const accountItems = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

const matches = (pathname, url) =>
  url === "/admin"
    ? pathname === url
    : pathname === url || pathname.startsWith(url + "/");

export function AppSidebar({ user }) {
  const pathname = usePathname();

  // Longest matching URL wins
  const activeUrl = [...mainItems, ...accountItems]
    .map((item) => item.url)
    .filter((url) => matches(pathname, url))
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
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/admin" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sprout className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Farm Pilot
                </span>

                <span className="truncate text-xs text-muted-foreground">
                  Admin portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {renderItems(mainItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {renderItems(accountItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
          <div className="grid text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user?.name || "Admin"}
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