// src/routes/_authenticated/folders.$folderId.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "@/lib/api";
import { z } from "zod";
import { Loading } from "@/components/ui/Loading";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { FolderTree } from "@/components/features/folders/ui/FolderTree";
import { BookmarkList } from "@/components/features/bookmarks/ui/BookmarkList";

const folderParamsSchema = z.object({
  folderId: z.string().uuid("Invalid folder ID."),
});

export const Route = createFileRoute("/_authenticated/folders/$folderId")({
  params: {
    parse: (params) => folderParamsSchema.parse(params),
  },
  loader: async ({ params, context }) => {
    const folderId = params.folderId;
    const folderQueryOptions = trpc.folders.getById.queryOptions({
      id: folderId,
    });
    const folder =
      await context.queryClient.ensureQueryData(folderQueryOptions);

    // Pre-fetch bookmarks for this folder.
    const bookmarksQueryOptions = trpc.bookmarks.search.queryOptions({
      folderId: folderId,
      limit: 10,
    });
    await context.queryClient.ensureQueryData(bookmarksQueryOptions);

    return { folderId, folder }; // Return both
  },
  component: FolderDetailPage,
  pendingComponent: Loading,
  errorComponent: ({ error }) => (
    <ErrorDisplay message={error.message || "Error loading folder."} />
  ),
});

function FolderDetailPage() {
  const { folderId, folder } = Route.useLoaderData();

  if (!folder) {
    return <ErrorDisplay message="Folder not found." />;
  }

  const navigate = useNavigate();

  const handleFolderSelection = (folderId: string) => {
    navigate({ to: "/folders/$folderId", params: { folderId } });
  };

  return (
    <AuthenticatedLayout
      sidebarContent={
        <FolderTree
          selectedFolderId={folderId}
          onFolderSelect={handleFolderSelection}
        />
      }
    >
      <BookmarkList initialFolderId={folderId} />
    </AuthenticatedLayout>
  );
}
