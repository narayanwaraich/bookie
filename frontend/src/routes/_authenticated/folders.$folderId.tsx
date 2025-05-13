import React, { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { trpc } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FolderForm } from '@/components/features/folders/FolderForm';
import { BookmarkList } from '@/components/features/bookmarks/BookmarkList'; // Re-use BookmarkList
import { Loading } from '@/components/common/Loading';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { Pencil, Trash2, PlusCircle, Folder as FolderIcon } from 'lucide-react';
import { toast } from 'sonner';

// Define a type for the folder tree node structure if not imported
interface FolderTreeNode {
  id: string;
  name: string;
  parentId: string | null;
  children: FolderTreeNode[];
  bookmarkCount?: number; // Make optional as it might not always be present or needed here
  // Add other fields if necessary, e.g., icon, color
}


const folderParamsSchema = z.object({
  folderId: z.string().uuid('Invalid folder ID.'),
});

export const Route = createFileRoute('/_authenticated/folders/$folderId')({
  parseParams: (params) => folderParamsSchema.parse(params), // This ensures params are validated
  loaderDeps: ({ params: { folderId } }) => ({ folderId }), // Pass validated folderId to loader
  loader: async ({ deps: { folderId }, context }) => {
    const folderQueryOptions = trpc.folders.getById.queryOptions({ id: folderId });
    const folder = await context.queryClient.ensureQueryData(folderQueryOptions);

    // Pre-fetch bookmarks for this folder.
    const bookmarksQueryOptions = trpc.bookmarks.search.queryOptions({ folderId: folderId, limit: 10 });
    await context.queryClient.ensureQueryData(bookmarksQueryOptions);

    return { folder };
  },
  component: FolderDetailComponent,
  pendingComponent: Loading,
  errorComponent: ({ error }) => <ErrorDisplay message={error.message || 'Error loading folder.'} />,
});

function FolderDetailComponent() {
  const routeContext = Route.useRouteContext();
  const { folderId } = routeContext.params; // Access params from the route context
  const { folder } = Route.useLoaderData();
  const navigate = useNavigate();

  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
  const [isCreateSubfolderOpen, setIsCreateSubfolderOpen] = useState(false);

  const { data: allFoldersTree } = useQuery(trpc.folders.getTree.queryOptions());

  const subfolders = React.useMemo(() => {
    if (!allFoldersTree) return [];
    // Cast allFoldersTree to the defined FolderTreeNode[] type for findNode
    const findNode = (id: string, tree: FolderTreeNode[]): FolderTreeNode | undefined => {
      for (const n of tree) {
        if (n.id === id) return n;
        if (n.children && n.children.length > 0) {
          const found = findNode(id, n.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    const currentFolderNode = findNode(folderId, allFoldersTree as FolderTreeNode[]);
    return currentFolderNode?.children || [];
  }, [allFoldersTree, folderId]);


  const deleteFolderMutation = useMutation(trpc.folders.delete.mutationOptions({
    onSuccess: () => {
      toast.success('Folder deleted successfully.');
      queryClient.invalidateQueries({ queryKey: trpc.folders.getTree.queryKey() });
      queryClient.invalidateQueries({ queryKey: trpc.folders.list.queryKey({}) });
      navigate({ to: '/folders', replace: true });
    },
    onError: (error) => {
      toast.error(`Failed to delete folder: ${error.message}`);
    },
  }));

  const handleDeleteFolder = () => {
    deleteFolderMutation.mutate({ id: folderId });
  };

  if (!folder) {
    return <ErrorDisplay message="Folder not found." />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{folder.name}</CardTitle>
            <div className="flex items-center space-x-2">
              <Dialog open={isCreateSubfolderOpen} onOpenChange={setIsCreateSubfolderOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Subfolder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Subfolder in "{folder.name}"</DialogTitle></DialogHeader>
                  <FolderForm parentId={folderId} onSuccess={() => setIsCreateSubfolderOpen(false)} />
                </DialogContent>
              </Dialog>
              <Dialog open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Edit Folder</DialogTitle></DialogHeader>
                  <FolderForm folder={folder} onSuccess={() => setIsEditFolderOpen(false)} />
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
                    <AlertDialogTitle>Delete "{folder.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete the folder and all its contents (subfolders and bookmarks). This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteFolder} className="bg-red-500 hover:bg-red-600">
                      Delete Folder
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {folder.description && <CardDescription className="pt-2">{folder.description}</CardDescription>}
        </CardHeader>
      </Card>

      {subfolders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subfolders</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Add explicit type for subfolder */}
            {subfolders.map((subfolder: FolderTreeNode) => (
              <Link key={subfolder.id} to="/folders/$folderId" params={{ folderId: subfolder.id }}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium truncate">{subfolder.name}</CardTitle>
                    <FolderIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      {subfolder.bookmarkCount ?? 0} bookmarks
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Bookmarks in this Folder</h2>
        {/* Pass folderId to BookmarkList so it filters bookmarks for the current folder */}
        <BookmarkList /> 
      </div>
    </div>
  );
}
