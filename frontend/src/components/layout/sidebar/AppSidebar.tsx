import React from "react";
import { useRouterState } from "@tanstack/react-router";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebarHeader } from "./AppSidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarQuickActions } from "./SidebarQuickActions";
import { SidebarUtilityMenu } from "./SidebarUtilityMenu";
import { SidebarUserMenu } from "./SidebarUserMenu";

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  children?: React.ReactNode;
}

export default function AppSidebar({
  children = null,
  ...props
}: AppSidebarProps) {
  const router = useRouterState();

  const isActive = (path: string, exact = false) => {
    if (exact) return router.location.pathname === path;
    return router.location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeader />

      <SidebarContent>
        <SidebarNavigation isActive={isActive} />
        {/* <SidebarQuickActions /> */}
        {children}
        {/* <SidebarUtilityMenu isActive={isActive} /> */}
      </SidebarContent>

      <SidebarUserMenu />
      <SidebarRail />
    </Sidebar>
  );
}
