import React from "react";
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
  Trash2,
  Folder, // Re-enabled
  Tag, // Re-enabled
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    // Add ring if selected
    <Card
      className={`relative ${isGrid ? "w-full" : "w-full"} hover:shadow-md transition-shadow ${isSelected ? "ring-2 ring-primary" : ""}`}
    >
      {/* Checkbox for selection */}
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          id={`select-${bookmark.id}`}
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
          aria-label={`Select bookmark ${bookmark.title || bookmark.url}`}
          onClick={(e) => e.stopPropagation()} // Prevent card click when clicking checkbox
        />
      </div>
      {isGrid && bookmark.previewImage && (
        // Add margin-top to prevent overlap with checkbox
        <div className="relative h-48 w-full overflow-hidden mt-8">
          <img
            src={bookmark.previewImage}
            alt={bookmark.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      {/* Adjust padding based on image presence */}
      <CardHeader
        className={`p-4 ${isGrid && bookmark.previewImage ? "pt-2" : "pt-8"}`}
      >
        <div className="flex items-start justify-between">
          {/* Adjust margin-left based on view mode for checkbox space */}
          <div
            className={`flex items-center space-x-2 ${isGrid ? "ml-0" : "ml-8"}`}
          >
            {bookmark.favicon && (
              <img src={bookmark.favicon} alt="" className="w-4 h-4" />
            )}
            {/* Make title a link, stop propagation */}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold line-clamp-2 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {bookmark.title || bookmark.url}
            </a>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Make button smaller and non-expanding */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {/* Stop propagation on menu items */}
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
        {bookmark.description && (
          // Adjust margin for checkbox space
          <p
            className={`text-sm text-muted-foreground mt-2 line-clamp-2 ${isGrid ? "ml-0" : "ml-8"}`}
          >
            {bookmark.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Re-enable tags/folders display, adjust margin */}
        <div
          className={`flex flex-wrap gap-1 mt-2 ${isGrid ? "ml-0" : "ml-8"}`}
        >
          {bookmark.folders?.map((folderMembership) => (
            <Badge
              key={folderMembership.folder.id}
              variant="secondary"
              className="text-xs"
            >
              <Folder className="mr-1 h-3 w-3" />
              {folderMembership.folder.name}
            </Badge>
          ))}
          {bookmark.tags?.map((tagMembership) => (
            <Badge
              key={tagMembership.tag.id}
              variant="outline"
              className="text-xs"
              style={{ backgroundColor: tagMembership.tag.color || undefined }}
            >
              <Tag className="mr-1 h-3 w-3" />
              {tagMembership.tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      {/* Adjust margin for checkbox space */}
      <CardFooter
        className={`p-4 pt-2 text-xs text-muted-foreground ${isGrid ? "ml-0" : "ml-8"}`}
      >
        <div className="flex items-center space-x-4">
          <span>
            {/* Convert date string before formatting */}
            Added{" "}
            {formatDistanceToNow(new Date(bookmark.createdAt), {
              addSuffix: true,
            })}
          </span>
          {bookmark.lastVisited && (
            <span>
              {/* Convert date string before formatting */}
              Last visited{" "}
              {formatDistanceToNow(new Date(bookmark.lastVisited), {
                addSuffix: true,
              })}
            </span>
          )}
          <span>{bookmark.visitCount} visits</span>
        </div>
      </CardFooter>
    </Card>
  );
};
