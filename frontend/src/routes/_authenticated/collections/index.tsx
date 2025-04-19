import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/collections/')({
  component: CollectionsListComponent,
  // Optional: Loader to fetch collections
  // loader: async () => fetchCollections(),
});

function CollectionsListComponent() {
  // const collections = Route.useLoaderData(); // Example
  return (
    <div>
      <h1>Collections</h1>
      {/* List collections here */}
      {/* {JSON.stringify(collections)} */}
    </div>
  );
}
