import { createFileRoute } from '@tanstack/react-router';

interface SyncStatus {
  lastSyncTime: string;
  status: 'synced' | 'syncing' | 'error';
  error?: string;
  pendingChanges: number;
}

export const Route = createFileRoute('/_authenticated/sync')({
  component: SyncComponent,
});

function SyncComponent() {
  const { syncStatus } = Route.useLoaderData()
  
  return (
    <>
    </>
  );
}
