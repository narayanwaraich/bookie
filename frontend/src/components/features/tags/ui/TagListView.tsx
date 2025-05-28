import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
// import { useQuery } from '@tanstack/react-query'; // Future
// import { trpc } from '@/lib/api'; // Future

export function TagListView() {
  // const { data, isLoading, error } = useQuery(trpc.tags.list.queryOptions({})); // Example

  return (
    <div>
      <PageHeader
        title="My Tags"
        description="Manage all your tags."
        actions={
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Tag
          </Button>
        }
      />
      <div className="text-center py-10 text-muted-foreground">
        <p>
          Tags feature coming soon. You'll be able to create and manage tags
          here.
        </p>
        {/* {data?.tags.map(tag => <div key={tag.id}>{tag.name}</div>)} */}
      </div>
    </div>
  );
}
