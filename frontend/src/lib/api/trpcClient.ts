import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "./types";
import { authLink } from "./authLink";
import { getAuthToken } from "../auth";

// API base URL from environment
const trpcBaseUrl = import.meta.env.VITE_API_URL + "/api/trpc";

// Create the TRPC client with all links configured
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        import.meta.env.DEV || // Use Vite's env variable
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    authLink, // Add the custom auth link BEFORE the httpBatchLink
    httpBatchLink({
      url: trpcBaseUrl,
      async headers() {
        const token = getAuthToken();
        return {
          authorization: token ? `Bearer ${token}` : undefined,
        };
      },
    }),
  ],
});
