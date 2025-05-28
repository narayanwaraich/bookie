import { createFileRoute } from "@tanstack/react-router";
import { TagListView } from "@/components/features/tags/ui/TagListView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export const Route = createFileRoute("/_authenticated/tags")({
  component: TagListView,
  // loader: async ({ context }) => {
  //   // await context.queryClient.ensureQueryData(context.trpc.tags.list.queryOptions({}));
  //   // return {};
  // }
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading tags: ${error.message}`}
    />
  ),
});
