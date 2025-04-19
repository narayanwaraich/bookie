import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { redirect } from '@tanstack/react-router';

interface Collection {
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

const collectionParamsSchema = z.object({
  collectionId: z.string().uuid().catch('invalid-uuid'),
});

export const Route = createFileRoute('/_authenticated/collections/$collectionId')({
  loader: async ({ params }) => {
    // Example validation - you can replace this with your actual validation logic
    const isAuthenticated = true // Replace with your auth check
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: `/collections/${params.collectionId}`
        }
      })
    }

    // Validate collection ID
    const validatedParams = collectionParamsSchema.parse(params);
    if (validatedParams.collectionId === 'invalid-uuid') {
      throw new Error('Invalid Collection ID');
    }

    // Fetch collection data
    const collection = await fetchCollectionById(params.collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }

    return {
      collection
    }
  },
  component: CollectionDetailComponent,
  pendingComponent: () => <div>Loading collection...</div>,
  errorComponent: ({ error }) => <div>Error loading collection: {error.message}</div>,
});

// Example data fetching function - replace with your actual implementation
async function fetchCollectionById(id: string): Promise<Collection | null> {
  // Implement your data fetching logic here
  return {
    id,
    name: 'Sample Collection',
    description: 'A sample collection description',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookmarks: []
  };
}

function CollectionDetailComponent() {
  const { collection } = Route.useLoaderData()
  
  return (
    <div>
      <h1>{collection.name}</h1>
      {collection.description && <p>{collection.description}</p>}
      
      <div className="metadata">
        <p>Created: {new Date(collection.createdAt).toLocaleString()}</p>
        <p>Last Updated: {new Date(collection.updatedAt).toLocaleString()}</p>
      </div>

      <div className="bookmarks">
        <h2>Bookmarks</h2>
        {collection.bookmarks.length === 0 ? (
          <p>No bookmarks in this collection</p>
        ) : (
          <ul>
            {collection.bookmarks.map((bookmark) => (
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
