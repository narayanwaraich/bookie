import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CollectionDetailView } from "@/components/features/collections/ui/CollectionDetailView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

const collectionParamsSchema = z.object({ collectionId: z.string().uuid() });

export const Route = createFileRoute(
  "/_authenticated/collections/$collectionId",
)({
  parseParams: (params) => collectionParamsSchema.parse(params),
  component: CollectionDetailPage,
  pendingComponent: () => <div>Loading collection...</div>,
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading bookmark: ${error.message}`}
    />
  ),
});

function CollectionDetailPage() {
  const { collectionId } = Route.useParams();
  return <CollectionDetailView collectionId={collectionId} />;
}
