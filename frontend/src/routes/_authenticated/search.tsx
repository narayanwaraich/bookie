import { createFileRoute } from "@tanstack/react-router";
import { SearchResultsPage } from "@/components/features/search/SearchResultsPage";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export const Route = createFileRoute("/_authenticated/search")({
  component: SearchResultsPage,
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading collections: ${error.message}`}
    />
  ),
});
