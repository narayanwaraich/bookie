import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { queryClient } from "@/lib/queryClient"; // For direct invalidation
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { FolderForm } from "@/components/features/folders/forms/FolderForm";
import { BookmarkList } from "@/components/features/bookmarks/ui/BookmarkList";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Pencil,
  Trash2,
  PlusCircle,
  Folder as FolderIconLucide,
} from "lucide-react";
import { toast } from "sonner";
import type { inferOutput } from "@trpc/tanstack-react-query";
import { FolderPathBreadcrumb } from "./FolderPathBreadcrumb";

// Assuming FolderTreeNode is similar to what you used or will define
type FolderData = inferOutput<typeof trpc.folders.getById>; // If you have this query
type FolderTreeNode = inferOutput<typeof trpc.folders.getTree>[number];

interface FolderContentViewProps {
  folder: FolderData; // The specific folder being viewed
  // subfolders: FolderTreeNode[]; // Direct children
  allFoldersTree?: FolderTreeNode[]; // For finding subfolders if not passed directly
}

export function FolderContentView({
  folder,
  allFoldersTree,
}: FolderContentViewProps) {
  const navigate = useNavigate();
  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
  const [isCreateSubfolderOpen, setIsCreateSubfolderOpen] = useState(false);

  const subfolders = React.useMemo(() => {
    if (!allFoldersTree) return [];
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
    const currentFolderNode = findNode(folder.id, allFoldersTree);
    return currentFolderNode?.children || [];
  }, [allFoldersTree, folder.id]);

  const deleteFolderMutation = useMutation(
    trpc.folders.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Folder deleted successfully.");
        queryClient.invalidateQueries({
          queryKey: trpc.folders.getTree.queryKey(),
        });
        // Potentially navigate up or to a default folder view
        navigate({ to: "/folders", replace: true });
      },
      onError: (error) => {
        toast.error(`Failed to delete folder: ${error.message}`);
      },
    }),
  );

  const handleDeleteFolder = () => {
    deleteFolderMutation.mutate({ id: folder.id });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={folder.name}
        description={folder.description || "Contents of this folder."}
        actions={
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
                  <DialogTitle>Create Subfolder in "{folder.name}"</DialogTitle>
                </DialogHeader>
                <FolderForm
                  parentId={folder.id}
                  onSuccess={() => setIsCreateSubfolderOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Dialog open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
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
                    This will delete the folder and all its contents (subfolders
                    and bookmarks). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteFolder}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete Folder
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />
      <div className="mb-4">
        <FolderPathBreadcrumb currentFolderId={folder.id} />
      </div>
      {subfolders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subfolders</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subfolders.map((subfolder) => (
              <Link
                key={subfolder.id}
                to="/folders/$folderId"
                params={{ folderId: subfolder.id }}
                className="block"
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium truncate">
                      {subfolder.name}
                    </CardTitle>
                    <FolderIconLucide className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      {subfolder.bookmarkCount ?? 0} bookmarks
                    </div>
                    {/* Add other subfolder info if needed */}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Bookmarks in this Folder</h2>
        <BookmarkList initialFolderId={folder.id} showFolderFilter={false} />
      </div>
    </div>
  );
}
