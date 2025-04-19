import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { redirect } from '@tanstack/react-router';

interface Tag {
  id: string;
  name: string;
  color?: string;
  bookmarks: Array<{
    id: string;
    title: string;
    url: string;
  }>;
}

// Assuming tagId is a UUID, adjust if it's a string name
const tagParamsSchema = z.object({
  tagId: z.string().uuid().catch('invalid-uuid'), 
});

export const Route = createFileRoute('/_authenticated/tags/$tagId')({
  loader: async ({ params }) => {
    // Example validation - you can replace this with your actual validation logic
    const isAuthenticated = true // Replace with your auth check
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: `/tags/${params.tagId}`
        }
      })
    }

    // Validate tag ID
    const validatedParams = tagParamsSchema.parse(params);
    if (validatedParams.tagId === 'invalid-uuid') {
      throw new Error('Invalid Tag ID');
    }

    // Fetch tag data
    const tag = await fetchTagById(params.tagId);
    if (!tag) {
      throw new Error('Tag not found');
    }

    return {
      tag
    }
  },
  component: TagDetailComponent,
  pendingComponent: () => <div>Loading tag details...</div>,
  errorComponent: ({ error }) => <div>Error loading tag details: {error.message}</div>,
});

// Example data fetching function - replace with your actual implementation
async function fetchTagById(id: string): Promise<Tag | null> {
  // Implement your data fetching logic here
  return {
    id,
    name: 'Sample Tag',
    color: '#FF0000',
    bookmarks: []
  };
}

function TagDetailComponent() {
  const { tag } = Route.useLoaderData()
  
  return (
    <div>
      <h1>
        {tag.name}
        {tag.color && (
          <span 
            className="tag-color" 
            style={{ 
              backgroundColor: tag.color,
              width: '20px',
              height: '20px',
              display: 'inline-block',
              marginLeft: '10px',
              borderRadius: '50%'
            }}
          />
        )}
      </h1>

      <div className="bookmarks">
        <h2>Bookmarks</h2>
        {tag.bookmarks.length === 0 ? (
          <p>No bookmarks with this tag</p>
        ) : (
          <ul>
            {tag.bookmarks.map((bookmark) => (
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
