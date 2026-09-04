"use client";

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
  ExternalLink,
  Newspaper,
  ShieldCheck,
  SquareRadical,
  User2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Profilku",
    url: "/dashboard",
    icon: User2,
  },
  {
    title: "Portfolio",
    url: "/dashboard/portfolio",
    icon: Newspaper,
  },
  {
    title: "Experience",
    url: "/dashboard/experience",
    icon: ExternalLink,
  },
  {
    title: "Certificate",
    url: "/dashboard/certificate",
    icon: ShieldCheck,
  },
];

export function DashboardSidebar() {
  const pathName = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="!bg-sidebar-accent">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SquareRadical />
              <span className="font-semibold">Anjar D Hariadi</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="!bg-sidebar-accent">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathName === item.url ||
                  (item.url !== "/dashboard" &&
                    pathName?.startsWith(item.url + "/"));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={isActive} asChild>
                      <Link prefetch={true} href={item.url}>
                        <item.icon />
                        <span className={isActive ? "font-bold" : ""}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
