import { createFileRoute } from "@tanstack/react-router";
import { SyncStatusView } from "@/components/features/sync/ui/SyncStatusView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export const Route = createFileRoute("/_authenticated/sync")({
  component: SyncStatusView,
  // loader: async ({ context }) => {
  //   // await context.queryClient.ensureQueryData(context.trpc.sync.getStatus.queryOptions());
  //   // return {};
  // }
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading syncing status: ${error.message}`}
    />
  ),
});
