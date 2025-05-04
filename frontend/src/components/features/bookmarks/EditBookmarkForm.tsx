import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { trpc } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';
import { updateBookmarkSchema } from '@server/models/schemas';

const editBookmarkSchema = updateBookmarkSchema.omit({ fullTextSearch: true })
type EditBookmarkFormValues =  z.infer<typeof editBookmarkSchema>;

export type EditBookmarkFormInput = {
  id: string;
  title: string;
  description?: string;
  notes?: string | null;
}

interface EditBookmarkFormProps {
  bookmark: EditBookmarkFormInput;
  onSuccess?: () => void;
}

export const EditBookmarkForm: React.FC<EditBookmarkFormProps> = ({ bookmark, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditBookmarkFormValues>({
    resolver: zodResolver(editBookmarkSchema),
    defaultValues: {
      title: bookmark.title || '',
      description: bookmark.description || '',
      notes: bookmark.notes || '',
    },
  });

  const updateMutation = useMutation(trpc.bookmarks.update.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Bookmark "${data.title}" updated successfully!`);
      queryClient.invalidateQueries({ 
        queryKey: trpc.bookmarks.search.queryKey({}) 
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to update bookmark: ${error.message}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  }));

  const onSubmit = (values: EditBookmarkFormValues) => {
    setIsSubmitting(true);
    updateMutation.mutate({
      id: bookmark.id,
      title: values.title,
      description: values.description,
      notes: values.notes,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title (Optional)</FormLabel> 
              <FormControl>
                <Input placeholder="Bookmark title" {...field} value={field.value ?? ''} /> 
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
                  placeholder="Brief description of the bookmark"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage /> 
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel> 
              <FormControl>
                <Textarea
                  placeholder="Personal notes about this bookmark"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage /> 
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || updateMutation.isPending}> {/* Also disable on mutation pending */}
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};
