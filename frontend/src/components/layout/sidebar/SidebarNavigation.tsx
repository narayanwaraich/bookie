import React from "react";
import { Link } from "@tanstack/react-router";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Bookmark, Tag, FolderKanban } from "lucide-react";

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  exact?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: Home,
    tooltip: "Dashboard",
    exact: true,
  },
  {
    path: "/bookmarks",
    label: "All Bookmarks",
    icon: Bookmark,
    tooltip: "All Bookmarks",
  },
  {
    path: "/collections",
    label: "Collections",
    icon: FolderKanban,
    tooltip: "Collections",
  },
  { path: "/tags", label: "Tags", icon: Tag, tooltip: "Tags" },
];

interface SidebarNavigationProps {
  isActive: (path: string, exact?: boolean) => boolean;
}

export function SidebarNavigation({ isActive }: SidebarNavigationProps) {
  return (
    <SidebarMenu>
      {navigationItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            asChild
            isActive={isActive(item.path, item.exact)}
            tooltip={item.tooltip}
          >
            <Link to={item.path}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
