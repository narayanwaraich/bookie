import { createFileRoute } from "@tanstack/react-router";
import SyncComponent from "@/components/features/sync/SyncStatusView";
interface SyncStatus {
  lastSyncTime: string;
  status: "synced" | "syncing" | "error";
  error?: string;
  pendingChanges: number;
}

export const Route = createFileRoute("/_authenticated/sync")({
  component: SyncComponent,
});
