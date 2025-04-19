import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { redirect } from '@tanstack/react-router';
import { ROUTES } from '../../types';

interface Folder {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  bookmarks: Array<{
    id: string;
    title: string;
    url: string;
  }>;
}

const folderParamsSchema = z.object({
  folderId: z.string().uuid().catch('invalid-uuid'),
});

export const Route = createFileRoute(ROUTES.AUTHENTICATED.FOLDER_DETAIL)({
  loader: async ({ params }) => {
    // Example validation - you can replace this with your actual validation logic
    const isAuthenticated = true // Replace with your auth check
    
    if (!isAuthenticated) {
      throw redirect({
        to: ROUTES.LOGIN,
        search: {
          redirect: `/folders/${params.folderId}`
        }
      })
    }

    // Validate folder ID
    const validatedParams = folderParamsSchema.parse(params);
    if (validatedParams.folderId === 'invalid-uuid') {
      throw new Error('Invalid Folder ID');
    }

    // Fetch folder data
    const folder = await fetchFolderById(params.folderId);
    if (!folder) {
      throw new Error('Folder not found');
    }

    return {
      folder
    }
  },
  component: FolderDetailComponent,
  pendingComponent: () => <div>Loading folder...</div>,
  errorComponent: ({ error }) => <div>Error loading folder: {error.message}</div>,
});

// Example data fetching function - replace with your actual implementation
async function fetchFolderById(id: string): Promise<Folder | null> {
  // Implement your data fetching logic here
  return {
    id,
    name: 'Sample Folder',
    description: 'A sample folder description',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookmarks: []
  };
}

function FolderDetailComponent() {
  const { folder } = Route.useLoaderData()
  
  return (
    <div>
      <h1>{folder.name}</h1>
      {folder.description && <p>{folder.description}</p>}
      
      <div className="metadata">
        <p>Created: {new Date(folder.createdAt).toLocaleString()}</p>
        <p>Last Updated: {new Date(folder.updatedAt).toLocaleString()}</p>
      </div>

      <div className="bookmarks">
        <h2>Bookmarks</h2>
        {folder.bookmarks.length === 0 ? (
          <p>No bookmarks in this folder</p>
        ) : (
          <ul>
            {folder.bookmarks.map((bookmark) => (
              <li key={bookmark.id}>
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                  {bookmark.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
