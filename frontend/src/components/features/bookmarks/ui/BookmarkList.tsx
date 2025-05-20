import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/ui/Loading";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { trpc } from "@/lib/api";
import type { inferOutput } from "@trpc/tanstack-react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddBookmarkForm } from "../forms/AddBookmarkForm";
import { EditBookmarkForm } from "../forms/EditBookmarkForm";
import { PlusCircle, Grid, List, Search } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { BookmarkCard } from "./BookmarkCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Tag, Folder as FolderIcon } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown components
import type { EditBookmarkFormInput as EditBookmark } from "./EditBookmarkForm";

type BookmarkSearchResult = inferOutput<typeof trpc.bookmarks.search>;
type Bookmark = BookmarkSearchResult["bookmarks"][number];

type TagListResult = inferOutput<typeof trpc.tags.list>;
type Tag = TagListResult["data"][number];

type FolderListResult = inferOutput<typeof trpc.folders.list>;
type Folder = FolderListResult["data"][number];

type ViewMode = "grid" | "list";
type SortOption =
  | "createdAt"
  | "updatedAt"
  | "lastVisited"
  | "visitCount"
  | "title";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 12;

interface BookmarkListProps {
  initialFolderId?: string; // New prop to set the folder context
  showFolderFilter?: boolean; // New prop to control visibility of folder filter
}

export const BookmarkList: React.FC<BookmarkListProps> = ({
  initialFolderId,
  showFolderFilter = true,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<EditBookmark | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // Initialize selectedFolderId with initialFolderId if provided
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    initialFolderId,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookmarkIds, setSelectedBookmarkIds] = useState<Set<string>>(
    new Set(),
  );

  // Effect to update selectedFolderId if initialFolderId prop changes
  React.useEffect(() => {
    setSelectedFolderId(initialFolderId);
    setCurrentPage(1); // Reset to first page when folder context changes
  }, [initialFolderId]);

  const queryOptions = trpc.bookmarks.search.queryOptions({
    query: debouncedSearchQuery,
    sortBy,
    sortOrder,
    tagIds: selectedTags.length > 0 ? selectedTags : undefined,
    folderId: selectedFolderId, // This will now use the prop-initialized or user-selected folder
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  // Fetch bookmarks
  const {
    data: searchResult,
    isLoading,
    error,
    isFetching,
  } = useQuery(queryOptions);

  // Fetch tags and folders for filtering/bulk actions
  const { data: tagsResult } = useQuery(
    trpc.tags.list.queryOptions({ limit: 100 }),
  );
  const { data: foldersResult } = useQuery(
    trpc.folders.list.queryOptions({ limit: 100 }),
  );

  // --- Bulk Action Mutation ---
  const bulkActionMutation = useMutation(
    trpc.bookmarks.bulkAction.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message || "Bulk action successful!");
        setSelectedBookmarkIds(new Set()); // Clear selection
        queryClient.invalidateQueries({ queryKey: queryOptions.queryKey }); // Refresh current view
        // Potentially invalidate other related queries (e.g., folder lists if moved)
      },
      onError: (error) => {
        toast.error(`Bulk action failed: ${error.message}`);
      },
    }),
  );

  // --- Selection Logic ---
  const handleSelectChange = (bookmarkId: string, isSelected: boolean) => {
    setSelectedBookmarkIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(bookmarkId);
      } else {
        newSet.delete(bookmarkId);
      }
      return newSet;
    });
  };

  const currentBookmarkIdsOnPage =
    searchResult?.bookmarks.map((b) => b.id) ?? [];
  const areAllOnPageSelected =
    currentBookmarkIdsOnPage.length > 0 &&
    currentBookmarkIdsOnPage.every((id) => selectedBookmarkIds.has(id));

  const handleSelectAllOnPage = (checked: boolean | "indeterminate") => {
    if (typeof checked !== "boolean") return;
    setSelectedBookmarkIds((prev) => {
      const newSet = new Set(prev);
      currentBookmarkIdsOnPage.forEach((id) => {
        if (checked) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
      });
      return newSet;
    });
  };
  // --- End Selection Logic ---

  // --- Bulk Action Handlers ---
  const handleBulkDelete = () => {
    // Confirmation is handled by the AlertDialog trigger
    if (selectedBookmarkIds.size === 0) return;
    bulkActionMutation.mutate({
      action: "delete",
      bookmarkIds: Array.from(selectedBookmarkIds),
    });
  };

  const handleBulkAddTag = (tagId: string) => {
    if (selectedBookmarkIds.size === 0 || !tagId) return;
    bulkActionMutation.mutate({
      action: "addTag",
      bookmarkIds: Array.from(selectedBookmarkIds),
      tagId: tagId,
    });
  };

  const handleBulkMoveToFolder = (folderId: string) => {
    if (selectedBookmarkIds.size === 0 || !folderId) return;
    bulkActionMutation.mutate({
      action: "addToFolder",
      bookmarkIds: Array.from(selectedBookmarkIds),
      targetFolderId: folderId,
    });
  };
  // TODO: Implement removeTag, removeFromFolder, addToCollection, removeFromCollection if needed

  // --- End Bulk Action Handlers ---

  // Adapter to map full bookmark to form input
  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark({
      id: bookmark.id,
      title: bookmark.title,
      description: bookmark.description ?? undefined,
      notes: bookmark.notes ?? undefined,
    });
  };

  const totalBookmarks = searchResult?.totalCount ?? 0;
  const totalPages = Math.ceil(totalBookmarks / ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Reset selection when page changes or filters change significantly
  React.useEffect(() => {
    // Do not reset selectedFolderId here if it's controlled by initialFolderId
    // Only reset if other filters change
    if (!initialFolderId) {
      setSelectedBookmarkIds(new Set());
    }
  }, [
    currentPage,
    debouncedSearchQuery,
    selectedTags,
    sortBy,
    sortOrder,
    initialFolderId,
  ]);

  if (isLoading && !searchResult) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorDisplay message={error.message ?? "Failed to load bookmarks"} />
    );
  }

  const bookmarks = searchResult?.bookmarks ?? [];

  // Show empty state only if no filters are active and no bookmarks exist
  if (
    bookmarks.length === 0 &&
    totalBookmarks === 0 &&
    !debouncedSearchQuery &&
    selectedTags.length === 0 &&
    !selectedFolderId
  ) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Bookmarks</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Bookmark
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Bookmark</DialogTitle>
              </DialogHeader>
              <AddBookmarkForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            No bookmarks yet. Add your first one!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4 relative pb-2">
        {" "}
        {/* Added relative and pb-2 */}
        {/* Bulk Action Bar - Conditionally Rendered */}
        {selectedBookmarkIds.size > 0 && (
          <div className="absolute top-0 left-0 right-0 bg-primary/10 p-2 flex items-center justify-between z-20 rounded-t-lg">
            <span className="text-sm font-medium text-primary">
              {selectedBookmarkIds.size} selected
            </span>
            <div className="space-x-2 flex items-center">
              {/* Move to Folder Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={bulkActionMutation.isPending}
                  >
                    <FolderIcon className="mr-1 h-4 w-4" /> Move to Folder
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Select Folder</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {foldersResult?.data && foldersResult.data.length > 0 ? (
                    foldersResult.data.map((folder) => (
                      <DropdownMenuItem
                        key={folder.id}
                        onSelect={() => handleBulkMoveToFolder(folder.id)}
                      >
                        {folder.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No folders found
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Add Tag Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={bulkActionMutation.isPending}
                  >
                    <Tag className="mr-1 h-4 w-4" /> Add Tag
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Select Tag</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {tagsResult?.data && tagsResult.data.length > 0 ? (
                    tagsResult.data.map((tag) => (
                      <DropdownMenuItem
                        key={tag.id}
                        onSelect={() => handleBulkAddTag(tag.id)}
                      >
                        {tag.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>No tags found</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Delete Button with Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={
                      bulkActionMutation.isPending ||
                      selectedBookmarkIds.size === 0
                    }
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete ({selectedBookmarkIds.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete{" "}
                      {selectedBookmarkIds.size} selected bookmark(s). This
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkDelete}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={bulkActionMutation.isPending}
                    >
                      {bulkActionMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
        {/* Existing Header Content - Add pt-12 if bulk bar is shown */}
        <div
          className={`flex items-center justify-between ${selectedBookmarkIds.size > 0 ? "pt-12" : ""}`}
        >
          <CardTitle>My Bookmarks ({totalBookmarks})</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <List className="h-4 w-4" />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Bookmark
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Bookmark</DialogTitle>
                </DialogHeader>
                <AddBookmarkForm onSuccess={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Filter/Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative lg:col-span-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 w-full"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex space-x-2">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as SortOption);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Added</SelectItem>
                <SelectItem value="updatedAt">Date Updated</SelectItem>
                <SelectItem value="lastVisited">Last Visited</SelectItem>
                <SelectItem value="visitCount">Visit Count</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value) => {
                setSortOrder(value as SortOrder);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Folder Filter - Conditionally render based on showFolderFilter prop */}
          {showFolderFilter && (
            <Select
              value={selectedFolderId ?? "all"}
              onValueChange={(value) => {
                if (!initialFolderId) {
                  // Allow change only if not contextually set
                  setSelectedFolderId(value === "all" ? undefined : value);
                  setCurrentPage(1);
                }
              }}
              disabled={!!initialFolderId} // Disable if folderId is passed as prop
            >
              <SelectTrigger className="w-full lg:col-span-1">
                <SelectValue placeholder="Filter by folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                {foldersResult?.data.map((folder: Folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {/* Tag Filter Badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tagsResult?.data.map((tag: Tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedTags((prev) =>
                  prev.includes(tag.id)
                    ? prev.filter((id) => id !== tag.id)
                    : [...prev, tag.id],
                );
                setCurrentPage(1);
              }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        {/* Loading Indicator */}
        {isFetching && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/50 animate-pulse rounded-b-lg" />
        )}
      </CardHeader>

      <CardContent>
        {/* Select All Checkbox */}
        {bookmarks.length > 0 && (
          <div className="flex items-center space-x-2 py-2 px-1 border-b mb-4">
            <Checkbox
              id="select-all-page"
              checked={areAllOnPageSelected}
              onCheckedChange={handleSelectAllOnPage}
              aria-label="Select all bookmarks on this page"
            />
            <label htmlFor="select-all-page" className="text-sm font-medium">
              Select all on page
            </label>
          </div>
        )}

        {/* Bookmark Grid/List */}
        {bookmarks.length > 0 ? (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            }`}
          >
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={handleEditBookmark}
                viewMode={viewMode}
                isSelected={selectedBookmarkIds.has(bookmark.id)} // Pass selection state
                onSelectChange={handleSelectChange} // Pass handler
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No bookmarks match your current filters.
          </p>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-6">
            <Button
              onClick={handlePreviousPage}
              disabled={
                currentPage === 1 || isFetching || bulkActionMutation.isPending
              }
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={
                currentPage === totalPages ||
                !searchResult?.hasMore ||
                isFetching ||
                bulkActionMutation.isPending
              }
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>

      {/* Edit Bookmark Dialog */}
      {editingBookmark && (
        <Dialog
          open={!!editingBookmark}
          onOpenChange={(isOpen) => !isOpen && setEditingBookmark(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Bookmark</DialogTitle>
            </DialogHeader>
            <EditBookmarkForm
              bookmark={editingBookmark}
              onSuccess={() => {
                setEditingBookmark(null);
                // Invalidation handled by EditBookmarkForm's mutation options
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
