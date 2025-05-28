import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TagDetailView } from "@/components/features/tags/ui/TagDetailView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { Loading } from "@/components/ui/Loading";

const tagParamsSchema = z.object({
  tagId: z.string().uuid(),
});

export const Route = createFileRoute("/_authenticated/tags/$tagId")({
  parseParams: (params) => tagParamsSchema.parse(params),
  component: TagDetailPage,
  // loader: async ({ params, context }) => {
  //   // const { tagId } = tagParamsSchema.parse(params);
  //   // await context.queryClient.ensureQueryData(context.trpc.tags.getById.queryOptions({ id: tagId }));
  //   // return {};
  // },
  pendingComponent: Loading,
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading bookmark: ${error.message}`}
    />
  ),
});

function TagDetailPage() {
  // useParams from TanStack Router is better here as it's type-safe with parseParams
  const { tagId } = Route.useParams();
  return <TagDetailView tagId={tagId} />;
}
