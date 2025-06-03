import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { BookOpen, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import AppSidebarSearchForm from "@/components/features/search/AppSidebarSearchForm";

export function AppSidebarHeader() {
  const {
    state: sidebarState,
    toggleSidebar,
    open: sidebarOpen,
  } = useSidebar();

  return (
    <SidebarHeader>
      <div
        className={cn(
          "flex items-center justify-between",
          sidebarState === "collapsed" && "justify-center",
        )}
      >
        <Link
          to="/dashboard"
          className={cn(
            "flex items-center gap-2 font-semibold",
            sidebarState === "collapsed" && "hidden",
          )}
        >
          <BookOpen className="h-6 w-6" />
          <span>Bookie</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:flex hidden"
        >
          {sidebarOpen ? (
            <ChevronsLeft className="h-5 w-5" />
          ) : (
            <ChevronsRight className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <AppSidebarSearchForm />
    </SidebarHeader>
  );
}
