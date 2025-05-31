import React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUser, Settings, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function SidebarUserMenu() {
  const { state: sidebarState } = useSidebar();
  const auth = useAuth();

  const getInitials = (name?: string | null, username?: string | null) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (username) return username.substring(0, 2).toUpperCase();
    return "U";
  };

  return (
    <SidebarFooter className="p-2 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start items-center gap-2 px-2",
              sidebarState === "collapsed" &&
                "justify-center px-0 aspect-square h-10 w-10",
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={auth.user?.profileImage || undefined}
                alt={auth.user?.name || auth.user?.username || "User"}
              />
              <AvatarFallback>
                {getInitials(auth.user?.name, auth.user?.username)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "flex flex-col items-start",
                sidebarState === "collapsed" && "hidden",
              )}
            >
              <span className="text-sm font-medium truncate max-w-[120px]">
                {auth.user?.name || auth.user?.username}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {auth.user?.email}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/settings/profile">
              <CircleUser className="mr-2 h-4 w-4" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <HelpCircle className="mr-2 h-4 w-4" /> Help & Feedback
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => auth.logout()}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}
