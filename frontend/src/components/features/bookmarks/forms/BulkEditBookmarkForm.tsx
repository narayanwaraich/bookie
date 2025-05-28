import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import {
  Loader2,
  Tag as TagIcon,
  Folder as FolderIcon,
  Trash2,
} from "lucide-react";

// Define types for tags and folders - should match your tRPC output
type Tag = { id: string; name: string };
type Folder = { id: string; name: string };

const bulkEditSchema = z
  .object({
    action: z.enum(["addTag", "removeTag", "moveToFolder", "delete"]),
    tagId: z.string().uuid().optional(),
    folderId: z.string().uuid().optional(),
  })
  .refine(
    (data) => {
      if (data.action === "addTag" || data.action === "removeTag")
        return !!data.tagId;
      if (data.action === "moveToFolder") return !!data.folderId;
      return true;
    },
    {
      message: "A tag or folder must be selected for the chosen action.",
      path: ["tagId"], // Or path: ["folderId"] depending on action
    },
  );

type BulkEditFormValues = z.infer<typeof bulkEditSchema>;

interface BulkEditBookmarkFormProps {
  selectedBookmarkIds: string[];
  onSuccess?: () => void; // e.g., to close a dialog and clear selection
}

export function BulkEditBookmarkForm({
  selectedBookmarkIds,
  onSuccess,
}: BulkEditBookmarkFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: tagsData, isLoading: isLoadingTags } = useQuery(
    trpc.tags.list.queryOptions({ limit: 100 }),
  ); // Adjust limit as needed
  const { data: foldersData, isLoading: isLoadingFolders } = useQuery(
    trpc.folders.list.queryOptions({ limit: 100 }),
  );

  const form = useForm<BulkEditFormValues>({
    resolver: zodResolver(bulkEditSchema),
    defaultValues: { action: undefined },
  });

  const watchedAction = form.watch("action");

  const bulkActionMutation = useMutation(
    trpc.bookmarks.bulkAction.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message || "Bulk action successful!");
        queryClient.invalidateQueries({
          queryKey: trpc.bookmarks.search.queryKey({}),
        });
        // Potentially invalidate folder/tag specific queries too
        form.reset();
        setIsOpen(false);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Bulk action failed: ${error.message}`);
      },
    }),
  );

  const onSubmit = (values: BulkEditFormValues) => {
    if (selectedBookmarkIds.length === 0) {
      toast.error("No bookmarks selected.");
      return;
    }
    bulkActionMutation.mutate({
      action: values.action,
      bookmarkIds: selectedBookmarkIds,
      tagId:
        values.action === "addTag" || values.action === "removeTag"
          ? values.tagId
          : undefined,
      targetFolderId:
        values.action === "moveToFolder" ? values.folderId : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={selectedBookmarkIds.length === 0}>
          Bulk Edit ({selectedBookmarkIds.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            Bulk Edit {selectedBookmarkIds.length} Bookmarks
          </DialogTitle>
          <DialogDescription>
            Apply an action to all selected bookmarks.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an action" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="addTag">
                        <TagIcon className="inline h-4 w-4 mr-2" />
                        Add Tag
                      </SelectItem>
                      <SelectItem value="removeTag">
                        <TagIcon className="inline h-4 w-4 mr-2" />
                        Remove Tag
                      </SelectItem>
                      <SelectItem value="moveToFolder">
                        <FolderIcon className="inline h-4 w-4 mr-2" />
                        Move to Folder
                      </SelectItem>
                      <SelectItem value="delete" className="text-destructive">
                        <Trash2 className="inline h-4 w-4 mr-2" />
                        Delete Selected
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(watchedAction === "addTag" || watchedAction === "removeTag") && (
              <FormField
                control={form.control}
                name="tagId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger disabled={isLoadingTags}>
                          <SelectValue
                            placeholder={
                              isLoadingTags ? "Loading tags..." : "Select a tag"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tagsData?.data.map((tag: Tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchedAction === "moveToFolder" && (
              <FormField
                control={form.control}
                name="folderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger disabled={isLoadingFolders}>
                          <SelectValue
                            placeholder={
                              isLoadingFolders
                                ? "Loading folders..."
                                : "Select a folder"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Add "None" or "Unsorted" option? */}
                        {foldersData?.data.map((folder: Folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  form.reset();
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={bulkActionMutation.isPending || !watchedAction}
                variant={watchedAction === "delete" ? "destructive" : "default"}
              >
                {bulkActionMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Apply Action
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
