import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

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

const tagParamsSchema = z.object({
  tagId: z.string().uuid(),
});

export const Route = createFileRoute('/_authenticated/tags/$tagId')({
  loader: async ({ params }) => {
    const validatedParams = tagParamsSchema.parse(params);
  },
  component: TagDetailComponent,
  pendingComponent: () => <div>Loading tag details...</div>,
  errorComponent: ({ error }) => <div>Error loading tag details: {error.message}</div>,
});


function TagDetailComponent() {
  const { tag } = Route.useLoaderData()
  
  return (
    <>
    </>
  );
}
