import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { trpc } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { inferOutput } from "@trpc/tanstack-react-query";

type CollectionData = inferOutput<typeof trpc.collections.getById>; // Or list item

const collectionFormSchema = z.object({
  name: z
    .string()
    .min(1, "Collection name is required")
    .max(100, "Name too long"),
  description: z
    .string()
    .max(500, "Description too long")
    .optional()
    .nullable(),
  isPublic: z.boolean().optional(),
  thumbnail: z.string().url("Invalid URL for thumbnail").optional().nullable(),
  // bookmarkIds: z.array(z.string().uuid()).optional(), // For adding bookmarks during creation
});

type CollectionFormValues = z.infer<typeof collectionFormSchema>;

interface CollectionFormProps {
  collection?: CollectionData; // For editing
  onSuccess?: () => void;
}

export function CollectionForm({ collection, onSuccess }: CollectionFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: collection?.name || "",
      description: collection?.description || null,
      isPublic: collection?.isPublic || false,
      thumbnail: collection?.thumbnail || null,
    },
  });

  const createMutation = useMutation(
    trpc.collections.create.mutationOptions({
      onSuccess: () => {
        toast.success("Collection created successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.collections.list.queryKey({}),
        });
        onSuccess?.();
        form.reset();
      },
      onError: (error) =>
        toast.error(`Failed to create collection: ${error.message}`),
    }),
  );

  const updateMutation = useMutation(
    trpc.collections.update.mutationOptions({
      onSuccess: () => {
        toast.success("Collection updated successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.collections.list.queryKey({}),
        });
        if (collection)
          queryClient.invalidateQueries({
            queryKey: trpc.collections.getById.queryKey({ id: collection.id }),
          });
        onSuccess?.();
      },
      onError: (error) =>
        toast.error(`Failed to update collection: ${error.message}`),
    }),
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: CollectionFormValues) => {
    if (collection) {
      updateMutation.mutate({ id: collection.id, ...values });
    } else {
      createMutation.mutate(values);
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
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Web Design Inspiration" {...field} />
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief summary of this collection"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.png"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Publicly Accessible</FormLabel>
                <FormDescription>
                  If checked, this collection can be viewed by anyone with the
                  link.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        {/* TODO: Add multi-select for initial bookmarks? */}
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onSuccess}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {collection ? "Save Changes" : "Create Collection"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
