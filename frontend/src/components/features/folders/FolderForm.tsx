import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { trpc } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { Icons } from '@/components/ui/icons';
import type { inferOutput } from '@trpc/tanstack-react-query';
import {createFolderSchema as folderSchema} from "@server/models/schemas";


type FolderListData = inferOutput<typeof trpc.folders.list>;
type ApiFolder = FolderListData['data'][number]; // Type for a single node in the tree (includes children)

type FolderFormValues = z.infer<typeof folderSchema>;

interface FolderFormProps {
  folder?: {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    color?: string | null;
    parentId?: string | null;
  };
  parentId?: string;
  onSuccess?: () => void;
}

export const FolderForm: React.FC<FolderFormProps> = ({ folder, parentId, onSuccess }) => {

  // Fetch available parent folders for selection
  const { data: foldersResponse } = useQuery(trpc.folders.list.queryOptions({}));
  const parentFolderOptions  = foldersResponse?.data || [];

  const form = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: folder?.name || '',
      description: folder?.description || '',
      icon: folder?.icon || 'folder',
      color: folder?.color || 'gray', // Schema default is 'gray'
      parentId: folder?.parentId ?? parentId ?? undefined, 
    },
  });

  // Correct query key for tree (takes no input)
  const treeQueryKey = trpc.folders.getTree.queryKey(); 
  // We might not need the list key if we only invalidate tree
  // const listQueryKey = trpc.folders.list.queryKey({}); 

  const apiFolders = parentFolderOptions

  const createMutation = useMutation(trpc.folders.create.mutationOptions({
    onSuccess: () => {
      toast.success('Folder created successfully');
      // Invalidate only the tree query, as it's the primary display source
      queryClient.invalidateQueries({ 
        queryKey: treeQueryKey 
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to create folder: ${error.message}`);
    },
  }));

  const updateMutation = useMutation(trpc.folders.update.mutationOptions({
    onSuccess: () => {
      toast.success('Folder updated successfully');
      // Invalidate only the tree query
      queryClient.invalidateQueries({ 
        queryKey: treeQueryKey 
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to update folder: ${error.message}`);
    },
  }));

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: FolderFormValues) => {
    // Ensure parentId is explicitly undefined if empty string or null/undefined from form values
    const submissionData = { 
      ...values, 
      parentId: values.parentId || undefined 
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
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
                  <ColorPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
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
                  onValueChange={(value) => field.onChange(value === "" ? undefined : value)} // Map "" back to undefined
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parent folder" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None (Root)</SelectItem>
                    {apiFolders.map((folder: ApiFolder) => (
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
        {/* )} */}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : folder ? 'Save Changes' : 'Create Folder'}
        </Button>
      </form>
    </Form>
  );
};
