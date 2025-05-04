import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '@/components/common/Loading'; 
import { ErrorDisplay } from '@/components/common/ErrorDisplay'; 
import { trpc } from '@/lib/api'; 
import type { inferOutput } from '@trpc/tanstack-react-query';
import { Button } from '@/components/ui/button'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; 
import { AddBookmarkForm } from './AddBookmarkForm'; 
import { EditBookmarkForm } from './EditBookmarkForm';
import { PlusCircle, Grid, List, Search } from 'lucide-react';
import { useMutation } from '@tanstack/react-query'; 
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { BookmarkCard } from './BookmarkCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { EditBookmarkFormInput as EditBookmark } from './EditBookmarkForm';

type BookmarkSearchResult = inferOutput<typeof trpc.bookmarks.search>;
type Bookmark = BookmarkSearchResult['bookmarks'][number]; 

type TagListResult = inferOutput<typeof trpc.tags.list>;
type Tag = TagListResult['data'][number];

type ViewMode = 'grid' | 'list';
type SortOption = 'createdAt' | 'lastVisited' | 'visitCount' | 'title';
type SortOrder = 'asc' | 'desc';

export const BookmarkList: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); 
  const [editingBookmark, setEditingBookmark] = useState<EditBookmark | null>(null); // State for bookmark being edited
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce search query
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // const [selectedFolders, setSelectedFolders] = useState<string[]>([]); // Remove multi-folder selection for now

  // Fetch bookmarks with search and filter options - align with schema
  const { data: searchResult, isLoading, error } = useQuery(
    trpc.bookmarks.search.queryOptions({
      query: debouncedSearchQuery, // Use debounced query
      sortBy,
      sortOrder,
      tagIds: selectedTags, // Use tagIds as per schema
      // folderId: selectedFolders[0], // Example if single folder selection was implemented
    })
  );

  // Fetch available tags and folders for filtering
  const { data: tagsResult } = useQuery(trpc.tags.list.queryOptions({})); // Rename to tagsResult
  const { data: folders } = useQuery(trpc.folders.list.queryOptions({}));

  // --- Delete Mutation ---
  const deleteMutation = useMutation(trpc.bookmarks.delete.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Bookmark deleted successfully!`);
      // Invalidate the search query to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: trpc.bookmarks.search.queryKey({}) 
      });
    },
    onError: (error) => {
      toast.error(`Failed to delete bookmark: ${error.message}`);
    },
  }));

  const handleDelete = (bookmarkId: string) => {
    deleteMutation.mutate({ id: bookmarkId });
  };
  // --- End Delete Mutation ---
  
  // Adapter to map full bookmark to form input
  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark({
      id: bookmark.id,
      title: bookmark.title,
      description: bookmark.description ?? undefined,
      notes: bookmark.notes ?? undefined,
    });
  };
  
  // Add loading state check
  if (isLoading) {
    return <Loading />;
  }

  // Add error state check
  if (error) {
    return <ErrorDisplay message={error.message ?? 'Failed to load bookmarks'} />;
  }

  // Adjust check for paginated structure (assuming search returns { bookmarks: [], total: number })
  if (!searchResult || !searchResult.bookmarks || searchResult.bookmarks.length === 0) { 
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
          <p className="text-center text-gray-500 py-4">No bookmarks found.</p>
        </CardContent>
      </Card>
    );
  }

  const bookmarks = searchResult.bookmarks; // Extract bookmarks array

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>My Bookmarks</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
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

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex space-x-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Added</SelectItem>
                <SelectItem value="lastVisited">Last Visited</SelectItem>
                <SelectItem value="visitCount">Visit Count</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Map over tagsResult.data and provide explicit type */}
          {tagsResult?.data.map((tag: Tag) => ( 
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => {
                setSelectedTags((prev) =>
                  prev.includes(tag.id)
                    ? prev.filter((id) => id !== tag.id)
                    : [...prev, tag.id]
                );
              }}
            >
              {tag.name}
            </Badge>
          ))}
          {/* Remove folder badges for now as multi-folder filter isn't supported by schema */}
          {/* {folders?.map((folder) => (
            <Badge
              key={folder.id}
              variant={selectedFolders.includes(folder.id) ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => {
                setSelectedFolders((prev) =>
                  prev.includes(folder.id)
                    ? prev.filter((id) => id !== folder.id)
                    : [...prev, folder.id]
                );
              }}
            >
              {folder.name}
            </Badge>
          ))} */}
        </div>
      </CardHeader>

      <CardContent>
        <div
          className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-4'
          }`}
        >
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={handleEditBookmark}
              viewMode={viewMode}
            />
          ))}
        </div>
      </CardContent>

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
              onSuccess={() => setEditingBookmark(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
