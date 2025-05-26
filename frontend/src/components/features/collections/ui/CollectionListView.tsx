// src/components/features/collections/ui/CollectionListView.tsx
import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { Loading } from "@/components/ui/Loading";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CollectionForm } from "../forms/CollectionForm";
import { CollectionCard } from "./CollectionCard";
import type { inferOutput } from "@trpc/tanstack-react-query";
import { EmptyState } from "@/components/ui/EmptyState";

type CollectionListResult = inferOutput<typeof trpc.collections.list>;
type CollectionItem = CollectionListResult["data"][number]; // Adjusted to match backend

export function CollectionListView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Default query params, adjust as needed (pagination, sorting)
  const queryOptions = trpc.collections.list.queryOptions({
    limit: 20,
    offset: 0,
    sortBy: "name",
    sortOrder: "asc",
  });

  const { data: collectionsResult, isLoading, error } = useQuery(queryOptions);

  if (isLoading && !collectionsResult) return <Loading />; // Show loading only on initial fetch
  if (error)
    return (
      <ErrorDisplay title="Error Loading Collections" message={error.message} />
    );

  const collections = collectionsResult?.data ?? [];
  const totalCollections = collectionsResult?.totalCount ?? 0;

  return (
    <div>
      <PageHeader
        title="My Collections"
        description="Organize your bookmarks into curated collections."
        actions={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <CollectionForm onSuccess={() => setIsCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.map((collection: CollectionItem) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PlusCircle}
          title="No Collections Yet"
          description="Get started by creating your first collection to group your bookmarks."
          action={{
            label: "Create Collection",
            onClick: () => setIsCreateOpen(true),
          }}
        />
      )}
      {/* TODO: Add pagination if totalCollections > collections.length */}
    </div>
  );
}
