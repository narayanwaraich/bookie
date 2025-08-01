import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@backend/src/api/trpc/router'; // Adjust path to your backend's AppRouter type

export const queryClient = new QueryClient();

// Helper to get token from extension storage
async function getToken() {
  return new Promise<string | null>((resolve) => {
    chrome.storage.local.get('authToken', (result) => {
      resolve(result.authToken || null);
    });
  });
}

// 1. Create a tRPC client for use outside of React components (e.g., in background.ts)
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc', // Your backend's tRPC endpoint
      async headers() {
        const token = await getToken();
        return {
          authorization: token ? `Bearer ${token}` : undefined,
        };
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
