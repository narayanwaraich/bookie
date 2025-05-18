import type { AppRouter } from "@server/trpc/router";

// Queue item for failed requests during token refresh
export type QueueItem = {
  resolve: (value: void | PromiseLike<void>) => void;
  reject: (reason?: any) => void;
};

export type { AppRouter };
