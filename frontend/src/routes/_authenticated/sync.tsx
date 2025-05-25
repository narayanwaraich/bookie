import { createFileRoute } from "@tanstack/react-router";
import { SyncStatusView } from "@/components/features/sync/ui/SyncStatusView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export const Route = createFileRoute("/_authenticated/sync")({
  component: SyncStatusView,
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading syncing status: ${error.message}`}
    />
  ),
});
