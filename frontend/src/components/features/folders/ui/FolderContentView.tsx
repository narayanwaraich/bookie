import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { trpc } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "@tanstack/react-router";
import { PlusCircle, Pencil, Trash2, Folder as FolderIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { BookmarkList } from "../../bookmarks/ui/BookmarkList";
import { FolderForm } from "../forms/FolderForm";
import { Route as FolderRoute } from "@/routes/_authenticated/folders.$folderId";

// Define a type for the folder tree node structure if not imported
interface FolderTreeNode {
  id: string;
  name: string;
  parentId: string | null;
  children: FolderTreeNode[];
  bookmarkCount?: number; // Make optional as it might not always be present or needed here
  // Add other fields if necessary, e.g., icon, color
}

export default function FolderDetailComponent() {
  // Get the folder data from the route loader
  const { folder, folderId } = FolderRoute.useLoaderData();
  const navigate = useNavigate();

  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
  const [isCreateSubfolderOpen, setIsCreateSubfolderOpen] = useState(false);

  const { data: allFoldersTree } = useQuery(
    trpc.folders.getTree.queryOptions(),
  );

  const subfolders = React.useMemo(() => {
    if (!allFoldersTree) return [];
    // Cast allFoldersTree to the defined FolderTreeNode[] type for findNode
    const findNode = (
      id: string,
      tree: FolderTreeNode[],
    ): FolderTreeNode | undefined => {
      for (const n of tree) {
        if (n.id === id) return n;
        if (n.children && n.children.length > 0) {
          const found = findNode(id, n.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    const currentFolderNode = findNode(
      folderId,
      allFoldersTree as FolderTreeNode[],
    );
    return currentFolderNode?.children || [];
  }, [allFoldersTree, folderId]);

  const deleteFolderMutation = useMutation(
    trpc.folders.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Folder deleted successfully.");
        queryClient.invalidateQueries({
          queryKey: trpc.folders.getTree.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.folders.list.queryKey({}),
        });
        navigate({ to: "/folders", replace: true });
      },
      onError: (error) => {
        toast.error(`Failed to delete folder: ${error.message}`);
      },
    }),
  );

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
              <Dialog
                open={isCreateSubfolderOpen}
                onOpenChange={setIsCreateSubfolderOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Subfolder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Create Subfolder in "{folder.name}"
                    </DialogTitle>
                  </DialogHeader>
                  <FolderForm
                    parentId={folderId}
                    onSuccess={() => setIsCreateSubfolderOpen(false)}
                  />
                </DialogContent>
              </Dialog>
              <Dialog
                open={isEditFolderOpen}
                onOpenChange={setIsEditFolderOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Folder</DialogTitle>
                  </DialogHeader>
                  <FolderForm
                    folder={folder}
                    onSuccess={() => setIsEditFolderOpen(false)}
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
                    <AlertDialogTitle>Delete "{folder.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete the folder and all its contents
                      (subfolders and bookmarks). This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteFolder}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete Folder
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {folder.description && (
            <CardDescription className="pt-2">
              {folder.description}
            </CardDescription>
          )}
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
              <Link
                key={subfolder.id}
                to="/folders/$folderId"
                params={{ folderId: subfolder.id }}
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium truncate">
                      {subfolder.name}
                    </CardTitle>
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
        <BookmarkList folderId={folderId} />
      </div>
    </div>
  );
}
