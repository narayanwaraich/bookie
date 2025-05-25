import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CollectionDetailView } from "@/components/features/collections/ui/CollectionDetailView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { Loading } from "@/components/ui/Loading";

const collectionParamsSchema = z.object({ collectionId: z.string().uuid() });

export const Route = createFileRoute(
  "/_authenticated/collections/$collectionId",
)({
  parseParams: (params) => collectionParamsSchema.parse(params),
  component: CollectionDetailPage,
  // loader: async ({ params, context }) => {
  //   // const { collectionId } = collectionParamsSchema.parse(params);
  //   // await context.queryClient.ensureQueryData(context.trpc.collections.getById.queryOptions({ id: collectionId }));
  //   // return {};
  // },
  pendingComponent: Loading,
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading collections: ${error.message}`}
    />
  ),
});

function CollectionDetailPage() {
  const { collectionId } = Route.useParams();
  return <CollectionDetailView collectionId={collectionId} />;
}
