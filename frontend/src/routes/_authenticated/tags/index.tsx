import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/tags/')({
  component: TagsListComponent,
  // Optional: Loader to fetch tags
  // loader: async () => fetchTags(),
});

function TagsListComponent() {
  // const tags = Route.useLoaderData(); // Example
  return (
    <div>
      <h1>Tags</h1>
      {/* List tags here */}
      {/* {JSON.stringify(tags)} */}
    </div>
  );
}
