import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
// import { useQuery } from '@tanstack/react-query'; // Future
// import { trpc } from '@/lib/api'; // Future

export function SyncStatusView() {
  // const { data: syncStatus, isLoading, error } = useQuery(trpc.sync.getStatus.queryOptions());

  return (
    <div>
      <PageHeader
        title="Sync Status"
        description="View the synchronization status of your data across devices."
      />
      <div className="text-center py-10 text-muted-foreground">
        <p>Sync status information will be displayed here.</p>
        {/* Display syncStatus details */}
      </div>
    </div>
  );
}
