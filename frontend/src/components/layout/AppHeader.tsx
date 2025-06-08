import React from "react";
import { Link, useMatches } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth"; // Assuming auth context provides user info and logout
import { CircleUser, LogOut, Settings, Search, Bell } from "lucide-react"; // Added icons
// import GlobalSearchInput from '@/components/features/search/GlobalSearchInput'; // Future: For a cmd+k style search
// import NotificationsIndicator from '@/components/features/notifications/NotificationsIndicator'; // Future
import Breadcrumbs from "./Breadcrumbs";

export default function AppHeader() {
  const { isMobile } = useSidebar();
  const auth = useAuth();

  const getInitials = (name?: string | null, username?: string | null) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (username) return username.substring(0, 2).toUpperCase();
    return "U";
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {/* {isMobile && <SidebarTrigger className="-ml-1" />}
      {!isMobile && <Separator orientation="vertical" className="h-6" />} */}

        <Breadcrumbs />

        <div className="ml-auto flex items-center gap-2">
          <div className="relative flex-1 md:grow-0">
            {/* Future: <GlobalSearchInput /> */}
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] h-9 border border-input"
            />
          </div>

          {/* Future: <NotificationsIndicator /> */}
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full h-9 w-9"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={auth.user?.profileImage || undefined}
                    alt={
                      auth.user?.name || auth.user?.username || "User Avatar"
                    }
                  />
                  <AvatarFallback>
                    {getInitials(auth.user?.name, auth.user?.username)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => auth.logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
