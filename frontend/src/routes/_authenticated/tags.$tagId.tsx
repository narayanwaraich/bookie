import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TagDetailView } from "@/components/features/tags/ui/TagDetailView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

const tagParamsSchema = z.object({
  tagId: z.string().uuid(),
});

export const Route = createFileRoute("/_authenticated/tags/$tagId")({
  parseParams: (params) => tagParamsSchema.parse(params),
  component: TagDetailPage,
  pendingComponent: () => <div>Loading tag details...</div>,
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
