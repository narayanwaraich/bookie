// React Query client instance
import {
    DefaultOptions,
    QueryClient,
    UseMutationOptions,
  } from '@tanstack/react-query';
  import { get, set, del } from 'idb-keyval';
  import {
    PersistedClient,
    Persister,
  } from '@tanstack/react-query-persist-client';
  
  export const queryConfig = {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24 * 5, //  5 Days
    },
  } satisfies DefaultOptions;
  
  export const queryClient = new QueryClient({
    defaultOptions: queryConfig,
  });
  
  export type ApiFnReturnType<
    FnType extends (...args: unknown[]) => Promise<unknown>,
  > = Awaited<ReturnType<FnType>>;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type QueryConfig<T extends (...args: any[]) => unknown> = Omit<
    ReturnType<T>,
    'queryKey' | 'queryFn'
  >;
  
  export type MutationConfig<
    MutationFnType extends (...args: unknown[]) => Promise<unknown>,
  > = UseMutationOptions<
    ApiFnReturnType<MutationFnType>,
    Error,
    Parameters<MutationFnType>[0]
  >;
  
  /**
   * Creates an Indexed DB persister
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
   */
  export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
    return {
      persistClient: async (client: PersistedClient) => {
        await set(idbValidKey, client);
      },
      restoreClient: async () => {
        return await get<PersistedClient>(idbValidKey);
      },
      removeClient: async () => {
        await del(idbValidKey);
      },
    } as Persister;
  }

  export const queryClient = new QueryClient();
