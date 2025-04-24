import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

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
  folderId: z.string().uuid(),
});

export const Route = createFileRoute('/_authenticated/folders/$folderId')({
  loader: async ({ params }) => {
    const validatedParams = folderParamsSchema.parse(params);
  },
  component: FolderDetailComponent,
  pendingComponent: () => <div>Loading folder...</div>,
  errorComponent: ({ error }) => <div>Error loading folder: {error.message}</div>,
});

function FolderDetailComponent() {
  const { folder } = Route.useLoaderData()
  
  return (
    <>
      {/* <h1>{folder.name}</h1>
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
      </div> */}
    </>
  );
}
