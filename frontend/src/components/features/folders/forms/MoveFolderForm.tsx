import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { inferOutput } from "@trpc/tanstack-react-query";

type FolderTreeNode = inferOutput<typeof trpc.folders.getTree>[number];
type FolderData = inferOutput<typeof trpc.folders.getById>; // Assuming you have this

// Helper function to flatten the folder tree for the select dropdown
const flattenFolderTree = (
  nodes: FolderTreeNode[],
  level = 0,
  disabledIds: Set<string> = new Set(),
): { label: string; value: string; disabled: boolean }[] => {
  let options: { label: string; value: string; disabled: boolean }[] = [];
  for (const node of nodes) {
    options.push({
      label: `${"— ".repeat(level)}${node.name}`,
      value: node.id,
      disabled: disabledIds.has(node.id),
    });
    if (node.children && node.children.length > 0) {
      options = options.concat(
        flattenFolderTree(node.children, level + 1, disabledIds),
      );
    }
  }
  return options;
};

// Helper function to get all descendant IDs of a folder
const getAllDescendantIds = (
  folderId: string,
  nodes: FolderTreeNode[],
): Set<string> => {
  const ids = new Set<string>();
  const findDescendants = (currentFolderId: string) => {
    const node =
      nodes.find((n) => n.id === currentFolderId) ||
      nodes.flatMap((n) => n.children).find((n) => n.id === currentFolderId); // Simplified search
    const queue: FolderTreeNode[] = [];
    const visited = new Set<string>();
    const findNode = (
      id: string,
      tree: FolderTreeNode[],
    ): FolderTreeNode | undefined => {
      for (const n of tree) {
        if (n.id === id) return n;
        if (n.children) {
          const found = findNode(id, n.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    const startNode = findNode(currentFolderId, nodes);
    if (startNode?.children) queue.push(...startNode.children);
    while (queue.length > 0) {
      const current = queue.shift();
      if (current && !visited.has(current.id)) {
        visited.add(current.id);
        ids.add(current.id);
        if (current.children) queue.push(...current.children);
      }
    }
  };
  findDescendants(folderId);
  return ids;
};

const moveFolderSchema = z.object({
  newParentId: z.string().uuid().nullable().optional(), // Allow null for moving to root
});

type MoveFolderFormValues = z.infer<typeof moveFolderSchema>;

interface MoveFolderFormProps {
  folderToMove: FolderData; // The folder being moved
  onSuccess?: () => void;
}

export function MoveFolderForm({
  folderToMove,
  onSuccess,
}: MoveFolderFormProps) {
  const queryClient = useQueryClient();
  const { data: folderTree, isLoading: isLoadingTree } = useQuery(
    trpc.folders.getTree.queryOptions(),
  );

  const disabledParentFolderIds = React.useMemo(() => {
    if (!folderTree) return new Set<string>();
    const ids = getAllDescendantIds(folderToMove.id, folderTree);
    ids.add(folderToMove.id); // Cannot select itself as parent
    return ids;
  }, [folderToMove.id, folderTree]);

  const parentFolderOptions = React.useMemo(() => {
    if (!folderTree) return [];
    return flattenFolderTree(folderTree, 0, disabledParentFolderIds);
  }, [folderTree, disabledParentFolderIds]);

  const form = useForm<MoveFolderFormValues>({
    resolver: zodResolver(moveFolderSchema),
    defaultValues: {
      newParentId: folderToMove.parentId,
    },
  });

  const updateFolderMutation = useMutation(
    trpc.folders.update.mutationOptions({
      // Assuming move is part of update
      onSuccess: () => {
        toast.success("Folder moved successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.folders.getTree.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.folders.getById.queryKey({ id: folderToMove.id }),
        });
        if (folderToMove.parentId) {
          queryClient.invalidateQueries({
            queryKey: trpc.folders.getById.queryKey({
              id: folderToMove.parentId,
            }),
          });
        }
        if (form.getValues().newParentId) {
          queryClient.invalidateQueries({
            queryKey: trpc.folders.getById.queryKey({
              id: form.getValues().newParentId!,
            }),
          });
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Failed to move folder: ${error.message}`);
      },
    }),
  );

  const onSubmit = (values: MoveFolderFormValues) => {
    if (values.newParentId === folderToMove.parentId) {
      toast.info("No change in parent folder.");
      onSuccess?.();
      return;
    }
    updateFolderMutation.mutate({
      id: folderToMove.id,
      parentId: values.newParentId || undefined, // Send undefined if null/empty for root
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newParentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Move "{folderToMove.name}" to</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "root" ? null : value)
                }
                defaultValue={field.value ?? "root"}
                disabled={isLoadingTree}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingTree
                          ? "Loading folders..."
                          : "Select a parent folder"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="root">None (Root Folder)</SelectItem>
                  {parentFolderOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onSuccess}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateFolderMutation.isPending || isLoadingTree}
          >
            {updateFolderMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Move Folder
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
