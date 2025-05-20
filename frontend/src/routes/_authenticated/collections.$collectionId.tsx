import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import CollectionDetailComponent from "@/components/features/collections/CollectionDetailView";

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
