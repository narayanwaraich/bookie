import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { PlusCircle, FolderKanban } from "lucide-react";
import { AddBookmarkForm } from "@/components/features/bookmarks/forms/AddBookmarkForm";
import { FolderForm } from "@/components/features/folders/forms/FolderForm";
import { cn } from "@/lib/utils";

export function SidebarQuickActions() {
  const { state: sidebarState } = useSidebar();
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = React.useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = React.useState(false);

  return (
    <div
      className={cn(
        "grid gap-2 p-2",
        sidebarState === "collapsed" ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      <Dialog open={isAddBookmarkOpen} onOpenChange={setIsAddBookmarkOpen}>
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
              className={cn("h-4 w-4", sidebarState !== "collapsed" && "mr-2")}
            />
            <span className={cn(sidebarState === "collapsed" && "sr-only")}>
              Add Link
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add New Bookmark</DialogTitle>
          </DialogHeader>
          <AddBookmarkForm onSuccess={() => setIsAddBookmarkOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
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
              className={cn("h-4 w-4", sidebarState !== "collapsed" && "mr-2")}
            />
            <span className={cn(sidebarState === "collapsed" && "sr-only")}>
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
  );
}
