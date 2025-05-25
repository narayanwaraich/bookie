// src/routes/_authenticated/folders.$folderId.tsx
import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { z } from "zod";
import { Loading } from "@/components/ui/Loading";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { FolderContentView } from "@/components/features/folders/ui/FolderContentView";

const folderParamsSchema = z.object({
  folderId: z.string().uuid("Invalid folder ID."),
});

export const Route = createFileRoute("/_authenticated/folders/$folderId")({
  parseParams: (params) => folderParamsSchema.parse(params),
  loaderDeps: ({ params: { folderId } }) => ({ folderId }),
  loader: async ({ deps: { folderId }, context }) => {
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

    // Pre-fetch folder tree to display subfolders correctly
    const folderTreeQueryOptions = trpc.folders.getTree.queryOptions();
    const allFoldersTree = await context.queryClient.ensureQueryData(
      folderTreeQueryOptions,
    );

    return { folder, allFoldersTree }; // Return both
  },
  component: FolderDetailPage,
  pendingComponent: Loading,
  errorComponent: ({ error }) => (
    <ErrorDisplay message={error.message || "Error loading folder."} />
  ),
});

function FolderDetailPage() {
  const { folder, allFoldersTree } = Route.useLoaderData(); // Get both folder and tree

  if (!folder) {
    // Should be handled by errorComponent if loader fails
    return <ErrorDisplay message="Folder not found." />;
  }

  return <FolderContentView folder={folder} allFoldersTree={allFoldersTree} />;
}
