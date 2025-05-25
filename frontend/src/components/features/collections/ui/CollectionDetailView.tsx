import React from "react";
import { useParams } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
// import { useQuery } from '@tanstack/react-query'; // Future
// import { trpc } from '@/lib/api'; // Future
// import { Loading } from '@/components/ui/Loading'; // Future
// import { ErrorDisplay } from '@/components/ui/ErrorDisplay'; // Future
// import { BookmarkList } from '@/components/features/bookmarks/ui/BookmarkList'; // Future

interface CollectionDetailViewProps {
  collectionId: string;
}

export function CollectionDetailView({
  collectionId,
}: CollectionDetailViewProps) {
  // const { data: collection, isLoading, error } = useQuery(trpc.collections.getById.queryOptions({ id: collectionId }));

  // if (isLoading) return <Loading />;
  // if (error) return <ErrorDisplay title="Error Loading Collection" message={error.message} />;
  // if (!collection) return <ErrorDisplay title="Collection Not Found" message="The requested collection could not be found." />;

  return (
    <div>
      <PageHeader
        title={`Collection: ${collectionId}`} // Replace with collection.name
        description={"Details of this collection."} // Replace with collection.description
      />
      <div className="text-center py-10 text-muted-foreground">
        <p>
          Viewing details for collection ID: {collectionId}. Bookmarks in this
          collection will be listed here.
        </p>
        {/* <BookmarkList initialCollectionId={collectionId} /> */}
      </div>
    </div>
  );
}
