// src/components/features/search/SearchResultsPage.tsx
import React from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { Loading } from "@/components/ui/Loading";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { PageHeader } from "@/components/layout/PageHeader";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SearchResultsPage() {
  const { q: searchQuery } = useSearch({ from: "/_authenticated/search" }); // Type-safe search params

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery(
    // Assuming you create a trpc.search.global procedure
    // This is a placeholder, adjust to your actual tRPC procedure for global search
    trpc.bookmarks.search.queryOptions(
      // Using bookmark search as placeholder
      { query: searchQuery || "", limit: 50 },
      { enabled: !!searchQuery },
    ),
  );

  if (!searchQuery) {
    return (
      <div>
        <PageHeader
          title="Search"
          description="Enter a term to search across your content."
        />
        <p className="text-center text-muted-foreground">
          Please enter a search query.
        </p>
      </div>
    );
  }

  if (isLoading) return <Loading />;
  if (error)
    return <ErrorDisplay title="Search Error" message={error.message} />;

  const bookmarks = searchResults?.bookmarks ?? []; // Placeholder: adapt to global search result structure

  return (
    <div>
      <PageHeader title={`Search Results for "${searchQuery}"`} />
      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {/* This is a placeholder for how you might render different types */}
          {/* You'll need to adapt based on your actual global search response */}
          <Card>
            <CardHeader>
              <CardTitle>Bookmarks ({bookmarks.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {bookmarks.map(
                (
                  item: any, // Replace 'any' with actual type
                ) => (
                  <div key={item.id} className="p-2 border-b">
                    <Link
                      to="/bookmarks/$bookmarkId"
                      params={{ bookmarkId: item.id }}
                      className="font-medium hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.url}
                    </p>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
          {/* Add sections for Folders, Tags, Collections if your global search returns them */}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No results found for "{searchQuery}".
        </p>
      )}
    </div>
  );
}
