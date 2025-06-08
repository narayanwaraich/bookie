import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "./AppHeader";
import AppSidebar from "./sidebar/AppSidebar";
import { useSocketEvents } from "@/hooks/useSocketEvents";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

export function AuthenticatedLayout({
  children,
  sidebarContent,
}: AuthenticatedLayoutProps) {
  useSocketEvents();
  return (
    <SidebarProvider>
      <AppSidebar>{sidebarContent}</AppSidebar>
      <SidebarInset>
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
