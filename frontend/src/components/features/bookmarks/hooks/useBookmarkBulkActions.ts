import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { BulkActionType } from "../types";

export const useBookmarkBulkActions = (
  queryKey: unknown[],
  onSuccess?: () => void,
) => {
  const bulkActionMutation = useMutation(
    trpc.bookmarks.bulkAction.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message || "Bulk action successful!");
        queryClient.invalidateQueries({ queryKey });
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Bulk action failed: ${error.message}`);
      },
    }),
  );

  const performBulkAction = (
    action: BulkActionType,
    bookmarkIds: string[],
    options?: { tagId?: string; targetFolderId?: string },
  ) => {
    if (bookmarkIds.length === 0) return;

    const basePayload = {
      action,
      bookmarkIds,
    };

    let payload = basePayload;

    // Add action-specific parameters
    if (action === "addTag" && options?.tagId) {
      payload = { ...basePayload, tagId: options.tagId };
    } else if (action === "addToFolder" && options?.targetFolderId) {
      payload = { ...basePayload, targetFolderId: options.targetFolderId };
    }

    bulkActionMutation.mutate(payload);
  };

  return {
    performBulkAction,
    isLoading: bulkActionMutation.isPending,
  };
};
