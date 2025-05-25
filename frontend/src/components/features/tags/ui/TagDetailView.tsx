import React from "react";
import { useParams } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
// import { useQuery } from '@tanstack/react-query'; // Future
// import { trpc } from '@/lib/api'; // Future
// import { BookmarkList } from '@/components/features/bookmarks/ui/BookmarkList'; // Future

interface TagDetailViewProps {
  tagId: string;
}

export function TagDetailView({ tagId }: TagDetailViewProps) {
  // const { data: tag, isLoading, error } = useQuery(trpc.tags.getById.queryOptions({ id: tagId }));

  return (
    <div>
      <PageHeader
        title={`Tag: ${tagId}`} // Replace with tag.name
        description="Bookmarks associated with this tag."
      />
      <div className="text-center py-10 text-muted-foreground">
        <p>
          Viewing details for tag ID: {tagId}. Bookmarks with this tag will be
          listed here.
        </p>
        {/* <BookmarkList initialTagIds={[tagId]} /> */}
      </div>
    </div>
  );
}
