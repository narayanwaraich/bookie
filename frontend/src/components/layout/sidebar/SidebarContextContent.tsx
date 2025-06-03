import React from "react";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";

interface SidebarContextContentProps {
  children?: React.ReactNode;
}

export function SidebarContextContent({
  children,
}: SidebarContextContentProps) {
  if (!children) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent>{children}</SidebarGroupContent>
    </SidebarGroup>
  );
}
