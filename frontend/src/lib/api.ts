//  tRPC client setup
import type { AppRouter } from '../../../backend/src/trpc/router';
import { queryClient } from './queryClient';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
// import { getAuthToken } from './auth'; // Helper to get JWT token

const trpcBaseUrl = import.meta.env.VITE_API_URL + '/api/trpc';

const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: trpcBaseUrl })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});