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
import { Link } from "@tanstack/react-router";
import { BookmarkMetadataDisplay } from "@/components/features/bookmarks/ui/BookmarkMetadataDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { List } from "lucide-react";

export function RecentBookmarksWidget() {
  const {
    data: recentBookmarksData,
    isLoading,
    error,
  } = useQuery(
    trpc.bookmarks.getRecent.queryOptions({ limit: 5 }), // Fetch 5 recent bookmarks
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Recent Bookmarks</CardTitle>
        <CardDescription>Your latest additions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Could not load recent bookmarks.
            </AlertDescription>
          </Alert>
        )}
        {recentBookmarksData &&
          recentBookmarksData.length === 0 &&
          !isLoading && (
            <div className="text-center text-muted-foreground py-4">
              <List className="mx-auto h-8 w-8 mb-2" />
              No recent bookmarks found.
            </div>
          )}
        {recentBookmarksData && recentBookmarksData.length > 0 && (
          <ul className="space-y-3">
            {recentBookmarksData.map((bookmark) => (
              <li
                key={bookmark.id}
                className="border-b pb-2 last:border-b-0 last:pb-0"
              >
                <Link
                  to="/bookmarks/$bookmarkId"
                  params={{ bookmarkId: bookmark.id }}
                  className="block hover:bg-muted/50 p-1 rounded-md -m-1"
                >
                  <BookmarkMetadataDisplay
                    url={bookmark.url}
                    title={bookmark.title}
                    favicon={bookmark.favicon}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
