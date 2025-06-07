import {
  createFileRoute,
  ErrorComponent,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { BookmarkList } from "@/components/features/bookmarks/ui/BookmarkList";
import { Loading } from "@/components/ui/Loading";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { FolderTree } from "@/components/features/folders/ui/FolderTree";

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
  const router = useRouterState();
  const navigate = useNavigate();

  const handleFolderSelection = (folderId: string) => {
    navigate({ to: "/folders/$folderId", params: { folderId } });
  };

  return (
    <AuthenticatedLayout
      sidebarContent={
        <FolderTree
          selectedFolderId={
            router.location.pathname.startsWith("/folders/")
              ? router.location.pathname.split("/").pop()
              : undefined
          }
          onFolderSelect={handleFolderSelection}
        />
      }
    >
      <BookmarkList />
    </AuthenticatedLayout>
  );
}
