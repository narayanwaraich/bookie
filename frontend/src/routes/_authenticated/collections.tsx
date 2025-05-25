import { createFileRoute } from "@tanstack/react-router";
import { CollectionListView } from "@/components/features/collections/ui/CollectionListView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export const Route = createFileRoute("/_authenticated/collections")({
  component: CollectionListView,
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading collections: ${error.message}`}
    />
  ),
});
