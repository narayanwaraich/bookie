import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';

interface SyncStatus {
  lastSyncTime: string;
  status: 'synced' | 'syncing' | 'error';
  error?: string;
  pendingChanges: number;
}

export const Route = createFileRoute('/_authenticated/sync')({
  loader: async () => {
    // Example validation - you can replace this with your actual validation logic
    const isAuthenticated = true // Replace with your auth check
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/sync'
        }
      })
    }

    // Fetch sync status
    const syncStatus = await fetchSyncStatus()

    return {
      syncStatus
    }
  },
  component: SyncComponent,
});

// Example data fetching function - replace with your actual implementation
async function fetchSyncStatus(): Promise<SyncStatus> {
  // Implement your data fetching logic here
  return {
    lastSyncTime: new Date().toISOString(),
    status: 'synced',
    pendingChanges: 0
  };
}

function SyncComponent() {
  const { syncStatus } = Route.useLoaderData()
  
  return (
    <div>
      <h1>Sync Status</h1>
      <div>
        <p>Last Sync: {new Date(syncStatus.lastSyncTime).toLocaleString()}</p>
        <p>Status: {syncStatus.status}</p>
        {syncStatus.error && <p className="error">Error: {syncStatus.error}</p>}
        <p>Pending Changes: {syncStatus.pendingChanges}</p>
        
        <button 
          onClick={() => {
            // Implement manual sync trigger
          }}
          disabled={syncStatus.status === 'syncing'}
        >
          {syncStatus.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    </div>
  );
}
