import {
    QueryClient,
    QueryCache,
  } from '@tanstack/react-query';
import type { QueryClientConfig } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import {createDexiePersister} from './dexiePersister';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24 * 5,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Error happened: ', error);
    },
  }),
};

export const queryClient = new QueryClient(queryClientConfig);

const dexiePersister = createDexiePersister('reactQuery');

// Set up persistence
persistQueryClient({
  queryClient,
  persister: dexiePersister,
  maxAge: 1000 * 60 * 60 * 24 * 5,
});
