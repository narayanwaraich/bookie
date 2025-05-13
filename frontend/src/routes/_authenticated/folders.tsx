import React, { useState } from 'react';
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FolderForm } from '@/components/features/folders/FolderForm';
import { PlusCircle } from 'lucide-react';
// The FolderTree is now in the main layout (_authenticated.tsx), so we might not need to render it here directly
// unless this page is meant to show something different when no specific folder is selected.

export const Route = createFileRoute('/_authenticated/folders')({
  component: FoldersPageLayout,
  // loader: async ({ context }) => {
  //   // Example: prefetch folder tree if not already handled by FolderTree component itself
  //   // await context.queryClient.prefetchQuery(context.trpc.folders.getTree.queryOptions());
  //   return {}; 
  // }
});

function FoldersPageLayout() {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const router = useRouter();

  // This component now acts as a layout for /folders and /folders/$folderId
  // The FolderTree is in the main sidebar.
  // The <Outlet /> will render either a default view for /folders 
  // or the specific folder view for /folders/$folderId

  // We can add a default view for the /folders route if needed,
  // or it can simply be a container for the Outlet.
  // For now, let's add a "Create Folder" button at this level.

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Folders</h1>
        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Folder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <FolderForm 
              onSuccess={() => {
                setIsCreateFolderOpen(false);
                // Optionally, navigate to the new folder or refresh data
                // router.invalidate(); // This might be too broad, rely on query invalidation in form
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Outlet will render child routes like /folders/$folderId or an index route if defined */}
      <Outlet /> 
      
      {/* Fallback content if no child route is matched (e.g., for /folders itself) */}
      {/* This can be an index route component for /folders/index.tsx */}
      {!router.state.matches.some(match => match.routeId === '/_authenticated/folders/$folderId') && (
         <div className="text-center text-muted-foreground py-10">
           <p>Select a folder from the sidebar to view its contents, or create a new one.</p>
         </div>
      )}
    </div>
  );
}
