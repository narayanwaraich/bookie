import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/folders/')({
  component: FoldersListComponent,
  // Optional: Loader to fetch folders
  // loader: async () => fetchFolders(),
});

function FoldersListComponent() {
  // const folders = Route.useLoaderData(); // Example
  return (
    <div>
      <h1>Folders</h1>
      {/* List folders here */}
      {/* {JSON.stringify(folders)} */}
    </div>
  );
}
