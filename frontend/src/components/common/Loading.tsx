import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const Loading: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
};
