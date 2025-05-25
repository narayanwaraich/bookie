import { createFileRoute } from "@tanstack/react-router";
import { ImportExportView } from "@/components/features/import-export/ui/ImportExportView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export const Route = createFileRoute("/_authenticated/import-export")({
  component: ImportExportView,
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading import/export options: ${error.message}`}
    />
  ),
});
