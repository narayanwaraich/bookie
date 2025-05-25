import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
// import CollectionCard from './CollectionCard'; // Future
// import { useQuery } from '@tanstack/react-query'; // Future
// import { trpc } from '@/lib/api'; // Future
// import { Loading } from '@/components/ui/Loading'; // Future
// import { ErrorDisplay } from '@/components/ui/ErrorDisplay'; // Future

export function CollectionListView() {
  // const { data, isLoading, error } = useQuery(trpc.collections.list.queryOptions({})); // Example query

  // if (isLoading) return <Loading />;
  // if (error) return <ErrorDisplay title="Error Loading Collections" message={error.message} />;

  return (
    <div>
      <PageHeader
        title="My Collections"
        description="Organize your bookmarks into curated collections."
        actions={
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        }
      />
      <div className="text-center py-10 text-muted-foreground">
        <p>
          Collections feature coming soon. You'll be able to create and manage
          collections here.
        </p>
        {/* Placeholder for list of collections */}
        {/* {data?.collections.map(collection => <CollectionCard key={collection.id} collection={collection} />)} */}
      </div>
    </div>
  );
}
