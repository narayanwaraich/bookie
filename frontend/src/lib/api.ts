import type { AppRouter } from '../../../backend/src/trpc/router';
import { queryClient } from './queryClient';
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { getAuthToken } from './auth'; 

const trpcBaseUrl = import.meta.env.VITE_API_URL + '/api/trpc';

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({ 
      url: trpcBaseUrl,
      async headers() {
        const token = getAuthToken();
        return {
          authorization: token ? `Bearer ${token}` : undefined,
        };
      },
    })
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});