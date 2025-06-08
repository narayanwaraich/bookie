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
      <div className="mb-4">
        <FolderPathBreadcrumb currentFolderId={folder.id} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Bookmarks in this Folder</h2>
        <BookmarkList initialFolderId={folder.id} showFolderFilter={false} />
      </div>
    </div>
  );
}
