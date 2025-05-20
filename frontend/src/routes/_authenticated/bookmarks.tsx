import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { BookmarkList } from "@/components/features/bookmarks/ui/BookmarkList";
import { Loading } from "@/components/ui/Loading";

export const Route = createFileRoute("/_authenticated/bookmarks")({
  loader: async ({ context: { trpc, queryClient } }) => {
    const queryOptions = trpc.bookmarks.search.queryOptions({});
    await queryClient.ensureQueryData(queryOptions);
    return;
  },
  component: BookmarksPage,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  pendingComponent: Loading,
});

function BookmarksPage() {
  return (
    <div className="container mx-auto p-4">
      <BookmarkList />
    </div>
  );
}
