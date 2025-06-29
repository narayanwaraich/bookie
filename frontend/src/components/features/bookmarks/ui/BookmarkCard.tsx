import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox import
import { Badge } from "@/components/ui/badge";
import type { inferOutput } from "@trpc/tanstack-react-query";
import {
  MoreVertical,
  ExternalLink,
  Pencil,
  Share,
  Trash2,
  Folder,
  Tag,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BookmarkSearchResult = inferOutput<typeof trpc.bookmarks.search>;
type Bookmark = BookmarkSearchResult["bookmarks"][number];

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  viewMode: "grid" | "list";
  isSelected: boolean; // Added prop
  onSelectChange: (bookmarkId: string, isSelected: boolean) => void; // Added prop
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onEdit,
  viewMode,
  isSelected, // Destructure new prop
  onSelectChange, // Destructure new prop
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation(
    trpc.bookmarks.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Bookmark deleted successfully");
        // Invalidate the generic search query key, specific keys handled by BookmarkList
        queryClient.invalidateQueries({
          queryKey: trpc.bookmarks.search.queryKey({}),
        });
      },
      onError: (error) => {
        toast.error(`Failed to delete bookmark: ${error.message}`);
      },
    }),
  );

  const handleDelete = () => {
    deleteMutation.mutate({ id: bookmark.id });
  };

  // Handler for checkbox change
  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      onSelectChange(bookmark.id, checked);
    }
  };

  const isGrid = viewMode === "grid";

  return (
    <Card
      className={`relative group gap-1 text-sm font-normal py-0 hover:shadow-md transition-shadow ${isSelected ? "ring-2 ring-primary" : ""} rounded-b-sm`}
    >
      <div className="absolute top-2 left-2 z-10 bg-white/20 hidden group-hover:flex backdrop-blur-xs rounded-md p-1 shadow-md">
        <Checkbox
          id={`select-${bookmark.id}`}
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
          aria-label={`Select bookmark ${bookmark.title || bookmark.url}`}
          onClick={(e) => e.stopPropagation()}
          className="border-white/20"
        />
      </div>

      {isGrid && bookmark.previewImage && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl group">
          <img
            src={bookmark.previewImage}
            alt={bookmark.title}
            className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
        </div>
      )}
      <CardHeader className={`p-4 pb-0 `}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 w-full overflow-hidden`}>
            {bookmark.favicon && (
              <img
                src={bookmark.favicon}
                alt=""
                className="w-4 h-4 flex-shrink-0"
              />
            )}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium truncate hover:underline text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              {bookmark.title || bookmark.url}
            </a>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(bookmark.url, "_blank");
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(bookmark);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                    className="text-red-600 hover:text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete the bookmark titled "
                      {bookmark.title || bookmark.url}". This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* {bookmark.description && (
          <p
            className={`text-sm text-gray-500 mt-2 line-clamp-1 ${isGrid ? "ml-0" : "ml-8"}`}
          >
            {bookmark.description}
          </p>
        )} */}
      </CardHeader>
      <CardContent className="px-4 pt-1 pb-0 flex-1 flex flex-col gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1 items-center">
          {bookmark.folders.length > 0 && (
            <Folder className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          {bookmark.folders?.map((folderMembership) => (
            <Badge
              key={folderMembership.folder.id}
              variant="outline"
              className="rounded-sm px-1.5 py-0.5 font-normal"
            >
              {folderMembership.folder.name}
            </Badge>
          ))}
        </div>
        <div className={`flex flex-wrap gap-1 items-center`}>
          {bookmark.tags.length > 0 && (
            <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          {bookmark.tags?.map((tagMembership) => (
            <Badge
              key={tagMembership.tag.id}
              variant="outline"
              className="rounded-sm px-1.5 py-0.5 font-normal"
              style={{
                backgroundColor: tagMembership.tag.color || undefined,
              }}
            >
              {tagMembership.tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter
        className={`px-4 pt-2 pb-3 text-xs text-muted-foreground justify-between`}
      >
        <p>
          Added{" "}
          {formatDistanceToNow(new Date(bookmark.createdAt), {
            addSuffix: true,
          })}
        </p>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-muted-foreground">
          <Tooltip>
            <TooltipTrigger>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(bookmark.url, "_blank");
                }}
                className="p-2 hover:text-foreground hover:shadow-sm cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open in a new tab</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
};
