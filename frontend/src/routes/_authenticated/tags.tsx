import { createFileRoute } from "@tanstack/react-router";
import { TagListView } from "@/components/features/tags/ui/TagListView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export const Route = createFileRoute("/_authenticated/tags")({
  component: TagListView,
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading tags: ${error.message}`}
    />
  ),
});
