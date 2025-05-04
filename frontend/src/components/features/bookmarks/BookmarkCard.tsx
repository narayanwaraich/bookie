import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { inferOutput } from '@trpc/tanstack-react-query';
import { 
  MoreVertical, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Folder, 
  Tag 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';

type BookmarkSearchResult = inferOutput<typeof trpc.bookmarks.search>;
type Bookmark = BookmarkSearchResult['bookmarks'][number]; 

interface BookmarkCardProps {
  bookmark: Bookmark; // Use the adjusted type
  onEdit: (bookmark: Bookmark) => void;
  viewMode: 'grid' | 'list';
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ 
  bookmark, 
  onEdit,
  viewMode 
}) => {
  const deleteMutation = useMutation(trpc.bookmarks.delete.mutationOptions({
    onSuccess: () => {
      toast.success('Bookmark deleted successfully');
      queryClient.invalidateQueries({ 
        queryKey: trpc.bookmarks.search.queryKey({}) 
      });
    },
    onError: (error) => {
      toast.error(`Failed to delete bookmark: ${error.message}`);
    },
  }));

  const handleDelete = () => {
    deleteMutation.mutate({ id: bookmark.id });
  };

  const isGrid = viewMode === 'grid';

  return (
    <Card className={`${isGrid ? 'w-full' : 'w-full'} hover:shadow-md transition-shadow`}>
      {isGrid && bookmark.previewImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={bookmark.previewImage}
            alt={bookmark.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {bookmark.favicon && (
              <img
                src={bookmark.favicon}
                alt=""
                className="w-4 h-4"
              />
            )}
            <h3 className="font-semibold line-clamp-2">
              {bookmark.title || bookmark.url}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(bookmark.url, '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(bookmark)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this bookmark.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {bookmark.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {bookmark.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* <div className="flex flex-wrap gap-2">
          {bookmark.folders?.map((folder) => (
            <Badge key={folder.id} variant="secondary">
              <Folder className="mr-1 h-3 w-3" />
              {folder.name}
            </Badge>
          ))}
          {bookmark.tags?.map((tag) => (
            <Badge key={tag.id} variant="outline">
              <Tag className="mr-1 h-3 w-3" />
              {tag.name}
            </Badge>
          ))}
        </div> */}
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>
            {/* Convert date string before formatting */}
            Added {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })} 
          </span>
          {bookmark.lastVisited && (
            <span>
              {/* Convert date string before formatting */}
              Last visited {formatDistanceToNow(new Date(bookmark.lastVisited), { addSuffix: true })} 
            </span>
          )}
          <span>{bookmark.visitCount} visits</span>
        </div>
      </CardFooter>
    </Card>
  );
};
