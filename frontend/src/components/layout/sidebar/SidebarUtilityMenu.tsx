import React from "react";
import { Link } from "@tanstack/react-router";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { FileUp, Zap, Users } from "lucide-react";

interface UtilityItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
}

const utilityItems: UtilityItem[] = [
  {
    path: "/import-export",
    label: "Import/Export",
    icon: FileUp,
    tooltip: "Import/Export",
  },
  { path: "/sync", label: "Sync Status", icon: Zap, tooltip: "Sync Status" },
  { path: "/teams", label: "Teams", icon: Users, tooltip: "Teams" },
];

interface SidebarUtilityMenuProps {
  isActive: (path: string, exact?: boolean) => boolean;
}

export function SidebarUtilityMenu({ isActive }: SidebarUtilityMenuProps) {
  return (
    <SidebarMenu>
      {utilityItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            asChild
            isActive={isActive(item.path)}
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
