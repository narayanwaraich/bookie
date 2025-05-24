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

export default function AppHeader() {
  const { isMobile } = useSidebar();
  const auth = useAuth();
  const matches = useMatches();

  // Create breadcrumbs from route matches
  // This is a simplified example; you might need more sophisticated logic for titles/paths
  const breadcrumbItems = matches
    .filter((match: any) => match.pathname && match.pathname !== "/") // Filter out root or non-path matches
    .map((match: any, index, arr) => {
      const pathSegments = match.pathname.split("/").filter(Boolean);
      const lastSegment = pathSegments.pop() || "home"; // Default to 'home' if empty
      const title =
        match.staticData?.title ||
        lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

      return {
        title,
        href: match.pathname,
        isCurrent: index === arr.length - 1,
      };
    });

  // Simple fallback if no specific breadcrumbs generated
  if (breadcrumbItems.length === 0) {
    breadcrumbItems.push({
      title: "Dashboard",
      href: "/dashboard",
      isCurrent: true,
    });
  }

  const getInitials = (name?: string | null, username?: string | null) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (username) return username.substring(0, 2).toUpperCase();
    return "U";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {isMobile && <SidebarTrigger className="-ml-1" />}
      {!isMobile && <Separator orientation="vertical" className="h-6" />}

      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.href + index}>
              <BreadcrumbItem>
                {item.isCurrent ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="relative ml-auto flex-1 md:grow-0">
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
                alt={auth.user?.name || auth.user?.username || "User Avatar"}
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
    </header>
  );
}
