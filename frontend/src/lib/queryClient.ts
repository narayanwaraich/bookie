import {
    QueryClient,
    QueryCache,
    // UseMutationOptions,
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
      gcTime: 1000 * 60 * 60 * 24 * 5, //  5 Days
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Error happened: ', error);
    },
  }),
};

// 
export const queryClient = new QueryClient(queryClientConfig);

const dexiePersister = createDexiePersister('reactQuery');

// Set up persistence
persistQueryClient({
  queryClient,
  persister: dexiePersister,
  maxAge: 1000 * 60 * 60 * 24 * 5, // Match your gcTime (5 days)
});

// export type ApiFnReturnType<
//   FnType extends (...args: unknown[]) => Promise<unknown>,
// > = Awaited<ReturnType<FnType>>;

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export type QueryConfig<T extends (...args: any[]) => unknown> = Omit<
//   ReturnType<T>,
//   'queryKey' | 'queryFn'
// >;

// export type MutationConfig<
//   MutationFnType extends (...args: unknown[]) => Promise<unknown>,
// > = UseMutationOptions<
//   ApiFnReturnType<MutationFnType>,
//   Error,
//   Parameters<MutationFnType>[0]
// >;
  
