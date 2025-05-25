import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ColorPicker } from "@/components/ui/color-picker"; // Assuming you have this
import { trpc } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { inferOutput } from "@trpc/tanstack-react-query";

type TagData = inferOutput<typeof trpc.tags.getById>; // Or list item type if simpler

const tagFormSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50, "Tag name too long"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color")
    .optional()
    .nullable(),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

interface TagFormProps {
  tag?: TagData; // For editing
  onSuccess?: () => void; // e.g., to close a dialog
}

export function TagForm({ tag, onSuccess }: TagFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: tag?.name || "",
      color: tag?.color || null,
    },
  });

  const createMutation = useMutation(
    trpc.tags.create.mutationOptions({
      onSuccess: () => {
        toast.success("Tag created successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.tags.list.queryKey({}),
        });
        onSuccess?.();
        form.reset();
      },
      onError: (error) => toast.error(`Failed to create tag: ${error.message}`),
    }),
  );

  const updateMutation = useMutation(
    trpc.tags.update.mutationOptions({
      onSuccess: () => {
        toast.success("Tag updated successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.tags.list.queryKey({}),
        });
        if (tag)
          queryClient.invalidateQueries({
            queryKey: trpc.tags.getById.queryKey({ id: tag.id }),
          });
        onSuccess?.();
      },
      onError: (error) => toast.error(`Failed to update tag: ${error.message}`),
    }),
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: TagFormValues) => {
    if (tag) {
      updateMutation.mutate({ id: tag.id, ...values });
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
              <FormLabel>Tag Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Work, Personal, Reading" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color (Optional)</FormLabel>
              <FormControl>
                <ColorPicker
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            {tag ? "Save Changes" : "Create Tag"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
