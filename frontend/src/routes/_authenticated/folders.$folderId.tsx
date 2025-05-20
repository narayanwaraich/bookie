import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/lib/api";
import { z } from "zod";
import { Loading } from "@/components/ui/Loading";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import FolderDetailComponent from "@/components/features/folders/ui/FolderContentView";

const folderParamsSchema = z.object({
  folderId: z.string().uuid("Invalid folder ID."),
});

export const Route = createFileRoute("/_authenticated/folders/$folderId")({
  parseParams: (params) => folderParamsSchema.parse(params), // This ensures params are validated
  loader: async ({ context, params }) => {
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

    return { folder, folderId };
  },
  component: FolderDetailComponent,
  pendingComponent: Loading,
  errorComponent: ({ error }) => (
    <ErrorDisplay message={error.message || "Error loading folder."} />
  ),
});
