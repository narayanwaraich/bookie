import React from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, Folder, Tag } from "lucide-react"; // Assuming Tag is the correct icon
import { Alert, AlertDescription } from "@/components/ui/alert";

export function StatisticsWidget() {
  // Example: You might have a tRPC procedure to get user stats
  // const { data: stats, isLoading, error } = useQuery(trpc.user.getStats.queryOptions());

  const isLoading = false; // Placeholder
  const error = null; // Placeholder
  const stats = {
    // Placeholder data
    totalBookmarks: 125,
    totalFolders: 15,
    totalTags: 30,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Your collection at a glance.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>Could not load statistics.</AlertDescription>
          </Alert>
        )}
        {stats && !isLoading && !error && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bookmark className="h-5 w-5 mr-2 text-primary" />
                <span>Total Bookmarks</span>
              </div>
              <span className="font-semibold">{stats.totalBookmarks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Folder className="h-5 w-5 mr-2 text-yellow-500" />
                <span>Total Folders</span>
              </div>
              <span className="font-semibold">{stats.totalFolders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-green-500" />{" "}
                {/* Ensure Tag icon is correctly imported */}
                <span>Total Tags</span>
              </div>
              <span className="font-semibold">{stats.totalTags}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
