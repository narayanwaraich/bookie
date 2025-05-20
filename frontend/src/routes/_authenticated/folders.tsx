import { createFileRoute } from "@tanstack/react-router";
import FoldersPageLayout from "@/components/features/folders/ui/FoldersPage";

export const Route = createFileRoute("/_authenticated/folders")({
  component: FoldersPageLayout,
  // loader: async ({ context }) => {
  //   // Example: prefetch folder tree if not already handled by FolderTree component itself
  //   // await context.queryClient.prefetchQuery(context.trpc.folders.getTree.queryOptions());
  //   return {};
  // }
});
