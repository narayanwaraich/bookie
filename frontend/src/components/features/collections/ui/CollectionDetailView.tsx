// src/components/features/collections/ui/CollectionDetailView.tsx
import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { Loading } from "@/components/ui/Loading";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
// import { BookmarkList } from "@/components/features/bookmarks/ui/BookmarkList";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users, Lock } from "lucide-react"; // Added icons
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CollectionForm } from "../forms/CollectionForm"; // Adjust path
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
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Added QueryClient
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router"; // Added useNavigate

interface CollectionDetailViewProps {
  collectionId: string;
}

export function CollectionDetailView({
  collectionId,
}: CollectionDetailViewProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient(); // For invalidation
  const navigate = useNavigate(); // For navigation after delete

  const queryOptions = trpc.collections.getById.queryOptions({
    id: collectionId,
  });
  const { data: collection, isLoading, error } = useQuery(queryOptions);

  const deleteMutation = useMutation(
    trpc.collections.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Collection deleted successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.collections.list.queryKey({}),
        });
        navigate({ to: "/collections" }); // Navigate back to list
      },
      onError: (err) => {
        toast.error(`Failed to delete collection: ${err.message}`);
      },
    }),
  );

  const handleDelete = () => {
    deleteMutation.mutate({ id: collectionId });
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorDisplay title="Error Loading Collection" message={error.message} />
    );
  if (!collection)
    return (
      <ErrorDisplay
        title="Collection Not Found"
        message="The requested collection could not be found."
      />
    );

  return (
    <div>
      <PageHeader
        title={collection.name}
        description={collection.description || "Bookmarks in this collection."}
        actions={
          <div className="flex space-x-2">
            {collection.isPublic ? (
              <Button variant="outline" size="sm" disabled>
                <Users className="mr-2 h-4 w-4" /> Public
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <Lock className="mr-2 h-4 w-4" /> Private
              </Button>
            )}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Collection</DialogTitle>
                </DialogHeader>
                <CollectionForm
                  collection={collection}
                  onSuccess={() => setIsEditOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete "{collection.name}"?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All bookmarks will remain, but
                    this collection will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />
      {/*
        The backend `collectionService.getCollectionById` already includes paginated bookmarks.
        You can either:
        1. Display them directly here using collection.bookmarks.data.
        2. Adapt BookmarkList to accept pre-fetched data or use its own query with collectionId.
           For simplicity, if BookmarkList is complex with its own filters/sort,
           it might be easier to let it fetch its own data using `initialCollectionId={collectionId}`
           (You'll need to add `initialCollectionId` prop to BookmarkList and use it in its query).

           For now, let's assume BookmarkList can take an `initialFolderId` (or we adapt it).
           The backend schema `getBookmarksInContainerQuerySchema` is generic.
           The `BookmarkList` would need to call `trpc.bookmarks.search` with a `collectionId` filter.
           The backend `bookmark.service.ts -> searchBookmarks` does not currently filter by collectionId.
           You'd need to add that filter to the backend if `BookmarkList` is to be reused directly.

           Alternatively, if `collection.bookmarks.data` from `getCollectionById` is sufficient (e.g., not requiring extensive client-side filtering on *this specific page* beyond what the backend provides),
           you can render them directly or pass this pre-fetched data to a simpler list component.
      */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Bookmarks in this Collection
        </h2>
        {/* Option 1: If BookmarkList can filter by collectionId (requires backend search update) */}
        {/* <BookmarkList initialCollectionId={collectionId} showFolderFilter={false} /> */}

        {/* Option 2: Displaying bookmarks fetched with the collection */}
        {collection.bookmarks?.data && collection.bookmarks.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {collection.bookmarks.data.map((bookmark) => (
              // You'll need a BookmarkCard component similar to the one in BookmarkList
              // For now, a simple representation:
              <div key={bookmark.id} className="p-4 border rounded-md bg-card">
                <h3 className="font-semibold truncate">{bookmark.title}</h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline truncate block"
                >
                  {bookmark.url}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No bookmarks in this collection yet.
          </p>
        )}
        {/* TODO: Add pagination for collection.bookmarks if needed */}
      </div>
    </div>
  );
}
