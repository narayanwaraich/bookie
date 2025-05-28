import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/color-picker";
import { Icons } from "@/components/ui/icons";
import type { inferOutput } from "@trpc/tanstack-react-query";
import { createFolderSchema as folderSchema } from "@server/api/models/schemas";

// Use the FolderTreeNode type from FolderTree if it's exported and suitable,
// or define a similar one here for the tree structure.
interface FolderTreeNodeForForm {
  id: string;
  name: string;
  parentId: string | null;
  children: FolderTreeNodeForForm[];
  // Add other fields if needed by the form or logic
}

type FolderFormValues = z.infer<typeof folderSchema>;

interface FolderFormProps {
  folder?: {
    // Existing folder data for editing
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    color?: string | null;
    parentId?: string | null;
  };
  parentId?: string; // Default parentId for new folders (e.g., from context menu)
  onSuccess?: () => void;
}

// Helper function to flatten the folder tree for the select dropdown
const flattenFolderTree = (
  nodes: FolderTreeNodeForForm[],
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
  nodes: FolderTreeNodeForForm[],
): Set<string> => {
  const ids = new Set<string>();
  const findDescendants = (currentFolderId: string) => {
    const node =
      nodes.find((n) => n.id === currentFolderId) ||
      nodes.flatMap((n) => n.children).find((n) => n.id === currentFolderId); // Simplified search

    // A more robust search would traverse the tree properly
    const queue: FolderTreeNodeForForm[] = [];
    const visited = new Set<string>();

    const findNode = (
      id: string,
      tree: FolderTreeNodeForForm[],
    ): FolderTreeNodeForForm | undefined => {
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

    if (startNode && startNode.children) {
      queue.push(...startNode.children);
    }

    while (queue.length > 0) {
      const current = queue.shift();
      if (current && !visited.has(current.id)) {
        visited.add(current.id);
        ids.add(current.id);
        if (current.children) {
          queue.push(...current.children);
        }
      }
    }
  };
  findDescendants(folderId);
  return ids;
};

export const FolderForm: React.FC<FolderFormProps> = ({
  folder,
  parentId,
  onSuccess,
}) => {
  // Fetch the folder tree for parent selection
  const { data: folderTree, isLoading: isLoadingTree } = useQuery(
    trpc.folders.getTree.queryOptions(),
  );

  const disabledParentFolderIds = React.useMemo(() => {
    if (!folder || !folderTree) return new Set<string>();
    const ids = getAllDescendantIds(
      folder.id,
      folderTree as FolderTreeNodeForForm[],
    );
    ids.add(folder.id); // Cannot select itself as parent
    return ids;
  }, [folder, folderTree]);

  const parentFolderOptions = React.useMemo(() => {
    if (!folderTree) return [];
    return flattenFolderTree(
      folderTree as FolderTreeNodeForForm[],
      0,
      disabledParentFolderIds,
    );
  }, [folderTree, disabledParentFolderIds]);

  const form = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: folder?.name || "",
      description: folder?.description || "",
      icon: folder?.icon || "folder",
      color: folder?.color || "gray", // Schema default is 'gray'
      parentId: folder?.parentId ?? parentId ?? undefined,
    },
  });

  // Correct query key for tree (takes no input)
  const treeQueryKey = trpc.folders.getTree.queryKey();
  // We might not need the list key if we only invalidate tree
  // const listQueryKey = trpc.folders.list.queryKey({});

  // const apiFolders = parentFolderOptions; // This line is no longer needed as parentFolderOptions is used directly

  const createMutation = useMutation(
    trpc.folders.create.mutationOptions({
      onSuccess: () => {
        toast.success("Folder created successfully");
        // Invalidate only the tree query, as it's the primary display source
        queryClient.invalidateQueries({
          queryKey: treeQueryKey,
        });
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Failed to create folder: ${error.message}`);
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.folders.update.mutationOptions({
      onSuccess: () => {
        toast.success("Folder updated successfully");
        // Invalidate only the tree query
        queryClient.invalidateQueries({
          queryKey: treeQueryKey,
        });
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Failed to update folder: ${error.message}`);
      },
    }),
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: FolderFormValues) => {
    // Ensure parentId is explicitly undefined if empty string or null/undefined from form values
    const submissionData = {
      ...values,
      parentId: values.parentId || undefined,
    };

    if (folder) {
      // Pass explicitly undefined parentId for root
      updateMutation.mutate({ id: folder.id, ...submissionData });
    } else {
      createMutation.mutate(submissionData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Folder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Folder description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="folder">
                      <div className="flex items-center gap-2">
                        <Icons.folder className="h-4 w-4" />
                        <span>Folder</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bookmark">
                      <div className="flex items-center gap-2">
                        <Icons.bookmark className="h-4 w-4" />
                        <span>Bookmark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="star">
                      <div className="flex items-center gap-2">
                        <Icons.star className="h-4 w-4" />
                        <span>Star</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="heart">
                      <div className="flex items-center gap-2">
                        <Icons.heart className="h-4 w-4" />
                        <span>Heart</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <ColorPicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Remove the !parentId condition to always show the dropdown */}
        {/* {!parentId && ( */}
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Folder</FormLabel>
              {/* Map undefined/null field value to "" for the Select component */}
              <Select
                value={field.value ?? ""}
                onValueChange={(value) =>
                  field.onChange(value === "" ? undefined : value)
                } // Map "" back to undefined
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent folder" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None (Root)</SelectItem>
                  {/* Use parentFolderOptions directly */}
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
        {/* )} */}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting
            ? "Saving..."
            : folder
              ? "Save Changes"
              : "Create Folder"}
        </Button>
      </form>
    </Form>
  );
};
