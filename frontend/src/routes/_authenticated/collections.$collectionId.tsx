import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

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

const collectionParamsSchema = z.object({ collectionId: z.string().uuid() });

export const Route = createFileRoute(
  "/_authenticated/collections/$collectionId",
)({
  loader: async ({ params }) => {
    const validatedParams = collectionParamsSchema.parse(params);
  },
  component: CollectionDetailComponent,
  pendingComponent: () => <div>Loading collection...</div>,
  errorComponent: ({ error }) => (
    <div>Error loading collection: {error.message}</div>
  ),
});

function CollectionDetailComponent() {
  // const { collection } = Route.useLoaderData()

  return (
    <>
      {/* <h1>{collection.name}</h1>
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
      </div> */}
    </>
  );
}
