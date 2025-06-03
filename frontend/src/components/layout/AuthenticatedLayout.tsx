import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "./Header";
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
