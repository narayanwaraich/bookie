import React from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { useParams } from "@tanstack/react-router"; // Or use Route.useParams() if preferred
import { Loading } from "@/components/ui/Loading";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CalendarDays, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, format } from "date-fns";
// import EditBookmarkForm from '../forms/EditBookmarkForm'; // Future
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Future

interface BookmarkDetailViewProps {
  bookmarkId: string; // Passed from route params
}

export function BookmarkDetailView({ bookmarkId }: BookmarkDetailViewProps) {
  const {
    data: bookmark,
    isLoading,
    error,
  } = useQuery(
    // Assuming you have a trpc.bookmarks.getById query
    trpc.bookmarks.getById.queryOptions({ id: bookmarkId }),
  );

  // TODO: Add Edit/Delete functionality in the future
  // const [isEditing, setIsEditing] = React.useState(false);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorDisplay title="Error Loading Bookmark" message={error.message} />
    );
  if (!bookmark)
    return (
      <ErrorDisplay
        title="Bookmark Not Found"
        message="The requested bookmark could not be found."
      />
    );

  return (
    <div>
      <PageHeader
        title={bookmark.title || "Bookmark Detail"}
        description={bookmark.url}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Link
              </a>
            </Button>
            {/* <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" />Edit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Edit Bookmark</DialogTitle></DialogHeader>
                {isEditing && <EditBookmarkForm bookmark={bookmark} onSuccess={() => setIsEditing(false)} />}
              </DialogContent>
            </Dialog> */}
            {/* Add Delete button with confirmation */}
          </>
        }
      />

      <Card>
        <CardHeader>
          {bookmark.favicon && (
            <img
              src={bookmark.favicon}
              alt="Favicon"
              className="h-8 w-8 mb-2 rounded"
            />
          )}
          <CardTitle>{bookmark.title}</CardTitle>
          <CardDescription>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {bookmark.url}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookmark.previewImage && (
            <img
              src={bookmark.previewImage}
              alt="Preview"
              className="rounded-md max-h-64 object-contain border"
            />
          )}
          {bookmark.description && (
            <div>
              <h3 className="font-semibold text-md mb-1">Description</h3>
              <p className="text-sm text-muted-foreground">
                {bookmark.description}
              </p>
            </div>
          )}
          {bookmark.notes && (
            <div>
              <h3 className="font-semibold text-md mb-1">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {bookmark.notes}
              </p>
            </div>
          )}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-md mb-1">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {bookmark.tags.map((tagMembership) => (
                  <Badge
                    key={tagMembership.tag.id}
                    variant="secondary"
                    style={{
                      backgroundColor: tagMembership.tag.color || undefined,
                    }}
                  >
                    {tagMembership.tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {bookmark.folders && bookmark.folders.length > 0 && (
            <div>
              <h3 className="font-semibold text-md mb-1">In Folders</h3>
              <div className="flex flex-wrap gap-2">
                {bookmark.folders.map((folderMembership) => (
                  <Badge key={folderMembership.folder.id} variant="outline">
                    {folderMembership.folder.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground space-x-4">
          <span>
            <CalendarDays className="inline h-3 w-3 mr-1" />
            Added: {format(new Date(bookmark.createdAt), "PPp")} (
            {formatDistanceToNow(new Date(bookmark.createdAt), {
              addSuffix: true,
            })}
            )
          </span>
          {bookmark.lastVisited && (
            <span>
              <CalendarDays className="inline h-3 w-3 mr-1" />
              Last Visited: {format(new Date(bookmark.lastVisited), "PPp")} (
              {formatDistanceToNow(new Date(bookmark.lastVisited), {
                addSuffix: true,
              })}
              )
            </span>
          )}
          <span>Visits: {bookmark.visitCount}</span>
        </CardFooter>
      </Card>
    </div>
  );
}
