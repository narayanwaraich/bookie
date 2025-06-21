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
  Share,
  Trash2,
  Folder,
  Tag,
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
      className={`relative group gap-1 text-sm font-normal py-0 hover:shadow-md transition-shadow ${isSelected ? "ring-2 ring-primary" : ""} rounded-b-sm`}
    >
      {/* Checkbox for selection */}
      {/* <div className="absolute top-2 left-2 z-10">
        <Checkbox
          id={`select-${bookmark.id}`}
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
          aria-label={`Select bookmark ${bookmark.title || bookmark.url}`}
          onClick={(e) => e.stopPropagation()} // Prevent card click when clicking checkbox
        />
      </div> */}
      {isGrid && bookmark.previewImage && (
        // Add margin-top to prevent overlap with checkbox
        <div className="h-48 w-full overflow-hidden rounded-t-xl">
          <img
            src={bookmark.previewImage}
            alt={bookmark.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader className={`p-4 gap-1 pb-0 `}>
        <div className="flex items-start justify-between">
          {/* Adjust margin-left based on view mode for checkbox space */}
          <div className={`flex items-center space-x-2`}>
            {bookmark.favicon && (
              <img src={bookmark.favicon} alt="" className="w-4 h-4" />
            )}
            {/* Make title a link, stop propagation */}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal line-clamp-1 hover:underline text-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              {bookmark.title || bookmark.url}
            </a>
          </div>
          {/* <DropdownMenu>
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
          </DropdownMenu> */}
        </div>
        {/* {bookmark.description && (
          <p
            className={`text-sm text-gray-500 mt-2 line-clamp-1 ${isGrid ? "ml-0" : "ml-8"}`}
          >
            {bookmark.description}
          </p>
        )} */}
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-0 flex flex-col flex-1 gap-1 ">
        <div className="flex flex-wrap gap-1 items-center">
          {bookmark.folders.length > 0 && (
            <Folder className="mr-1 h-4 w-4 text-muted-foreground" />
          )}
          {bookmark.folders?.map((folderMembership) => (
            <Badge
              key={folderMembership.folder.id}
              variant="outline"
              className="text-xs text-muted-foreground font-normal"
            >
              {folderMembership.folder.name}
            </Badge>
          ))}
        </div>
        <div className={`flex flex-wrap gap-1 items-center`}>
          {bookmark.tags.length > 0 && (
            <Tag className="mr-1 h-4 w-4 text-muted-foreground" />
          )}
          {bookmark.tags?.map((tagMembership) => (
            <Badge
              key={tagMembership.tag.id}
              variant="outline"
              className="text-xs text-accent-foreground font-normal"
              style={{ backgroundColor: tagMembership.tag.color || undefined }}
            >
              {tagMembership.tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter
        className={`p-4 pt-2 pr-2 text-xs text-muted-foreground justify-between`}
      >
        <p>
          Added{" "}
          {formatDistanceToNow(new Date(bookmark.createdAt), {
            addSuffix: true,
          })}
        </p>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex leading-none divide-x">
          <div className="flex items-end space-x-0.5 px-2 py-2 text-muted-foreground hover:text-blue-500 cursor-pointer transition-colors hover:shadow-xl/5 transition-shadow ">
            <Share className="w-4 h-4" />
            <span>Share</span>
          </div>
          <div className="flex items-end space-x-0.5 px-2 py-2 text-muted-foreground hover:text-emerald-500 cursor-pointer transition-colors hover:shadow-xl/5 transition-shadow ">
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </div>
          <div className="flex items-end space-x-0.5 px-2 py-2 text-muted-foreground hover:text-red-400 cursor-pointer transition-colors hover:shadow-xl/5 transition-shadow ">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
