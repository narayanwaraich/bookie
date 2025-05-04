import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { trpc } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner'; // Assuming sonner is used for notifications

const addBookmarkSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  // Add other fields like title, description later if needed
});

type AddBookmarkFormValues = z.infer<typeof addBookmarkSchema>;

interface AddBookmarkFormProps {
  onSuccess?: () => void; // Optional callback for success (e.g., close dialog)
}

export const AddBookmarkForm: React.FC<AddBookmarkFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddBookmarkFormValues>({
    resolver: zodResolver(addBookmarkSchema),
    defaultValues: {
      url: '',
    },
  });

  const createMutation = useMutation(trpc.bookmarks.create.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Bookmark "${data.title || data.url}" added successfully!`);
      // Invalidate the search query to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: trpc.bookmarks.search.queryKey({}) 
      });
      form.reset(); // Reset the form
      onSuccess?.(); // Call success callback if provided
    },
    onError: (error) => {
      toast.error(`Failed to add bookmark: ${error.message}`);
    },
    onSettled: () => {
      setIsSubmitting(false); // Re-enable button
    }
  }));

  const onSubmit = (values: AddBookmarkFormValues) => {
    setIsSubmitting(true);
    createMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bookmark URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Bookmark'}
        </Button>
      </form>
    </Form>
  );
};
