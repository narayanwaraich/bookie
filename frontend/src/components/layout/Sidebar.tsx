import React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router"; // Added useNavigate
import { FolderTree } from "@/components/features/folders/ui/FolderTree";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
// import AppSidebarSearchForm from '@/components/features/search/AppSidebarSearchForm'; // Future use
import { Button } from "@/components/ui/button";
import {
  Home,
  Bookmark,
  Tag,
  FolderKanban,
  Settings,
  HelpCircle,
  PlusCircle,
  BookOpen,
  FileUp,
  Zap,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, CircleUser } from "lucide-react";
import { AddBookmarkForm } from "@/components/features/bookmarks/forms/AddBookmarkForm";
import { FolderForm } from "@/components/features/folders/forms/FolderForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouterState();
  const navigate = useNavigate();
  const auth = useAuth();
  const {
    state: sidebarState,
    toggleSidebar,
    open: sidebarOpen,
  } = useSidebar();

  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = React.useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = React.useState(false);

  const handleFolderSelection = (folderId: string) => {
    navigate({ to: "/folders/$folderId", params: { folderId } });
  };

  const isActive = (path: string, exact = false) => {
    if (exact) return router.location.pathname === path;
    return router.location.pathname.startsWith(path);
  };

  const getInitials = (name?: string | null, username?: string | null) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (username) return username.substring(0, 2).toUpperCase();
    return "U";
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-2">
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
        {/* Future: <AppSidebarSearchForm /> */}
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-0 p-2">
        <div className="flex-1 overflow-y-auto space-y-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/dashboard", true)}
                tooltip="Dashboard"
              >
                <Link to="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/bookmarks")}
                tooltip="All Bookmarks"
              >
                <Link to="/bookmarks">
                  <Bookmark />
                  <span>All Bookmarks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/collections")}
                tooltip="Collections"
              >
                <Link to="/collections">
                  <FolderKanban />
                  <span>Collections</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/tags")}
                tooltip="Tags"
              >
                <Link to="/tags">
                  <Tag />
                  <span>Tags</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarSeparator className="my-2" />

          {/* Add Bookmark / Create Folder Buttons */}
          <div
            className={cn(
              "grid gap-2",
              sidebarState === "collapsed" ? "grid-cols-1" : "grid-cols-2",
            )}
          >
            <Dialog
              open={isAddBookmarkOpen}
              onOpenChange={setIsAddBookmarkOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full",
                    sidebarState === "collapsed" && "px-0 aspect-square",
                  )}
                >
                  <PlusCircle
                    className={cn(
                      "h-4 w-4",
                      sidebarState !== "collapsed" && "mr-2",
                    )}
                  />
                  <span
                    className={cn(sidebarState === "collapsed" && "sr-only")}
                  >
                    Add Link
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Add New Bookmark</DialogTitle>
                </DialogHeader>
                <AddBookmarkForm
                  onSuccess={() => setIsAddBookmarkOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <Dialog
              open={isCreateFolderOpen}
              onOpenChange={setIsCreateFolderOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full",
                    sidebarState === "collapsed" && "px-0 aspect-square",
                  )}
                >
                  <FolderKanban
                    className={cn(
                      "h-4 w-4",
                      sidebarState !== "collapsed" && "mr-2",
                    )}
                  />
                  <span
                    className={cn(sidebarState === "collapsed" && "sr-only")}
                  >
                    New Folder
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <FolderForm onSuccess={() => setIsCreateFolderOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <SidebarGroup>
            {/* <SidebarGroupLabel>Folders</SidebarGroupLabel> */}
            <SidebarGroupContent className="mt-2">
              <FolderTree
                selectedFolderId={
                  router.location.pathname.startsWith("/folders/")
                    ? router.location.pathname.split("/").pop()
                    : undefined
                }
                onFolderSelect={handleFolderSelection}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarSeparator className="my-2" />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/import-export")}
              tooltip="Import/Export"
            >
              <Link to="/import-export">
                <FileUp />
                <span>Import/Export</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/sync")}
              tooltip="Sync Status"
            >
              <Link to="/sync">
                <Zap />
                <span>Sync Status</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* TODO: Add Team/Collaboration Link when feature is ready
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/teams')} tooltip="Teams">
              <Link to="/teams"><Users/><span>Teams</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          */}
        </SidebarMenu>
      </SidebarContent>

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
      <SidebarRail />
    </Sidebar>
  );
}
