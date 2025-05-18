import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "./types";
import { trpcClient } from "./trpcClient";
import { queryClient } from "../queryClient";

// Export TRPC types
export type { AppRouter } from "./types";

// Export the client
export { trpcClient };

// Export auth helper functions
export { refreshAccessToken, processQueue } from "./authLink";

// Create and export the proxy using the client instance
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
