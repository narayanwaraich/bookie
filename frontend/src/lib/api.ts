import type { AppRouter } from '../../../backend/src/trpc/router';
import { queryClient } from './queryClient';
import { createTRPCClient, httpBatchLink, loggerLink, TRPCClientError } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { getAuthToken, setAuthToken, removeAuthToken } from './auth'; // Import token helpers
import { observable } from '@trpc/server/observable';
import { type TRPCLink } from '@trpc/client';

const trpcBaseUrl = import.meta.env.VITE_API_URL + '/api/trpc';

// Flag to prevent infinite refresh loops
let isRefreshing = false;
// Queue for requests that failed while token was refreshing
type QueueItem = { 
  resolve: (value: void | PromiseLike<void>) => void; 
  reject: (reason?: any) => void 
};
let failedRequestsQueue: QueueItem[] = [];

// Process all queued requests after refresh attempt
const processQueue = (error: any, token: string | null = null) => {
  failedRequestsQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined); // Resolve to retry the request
    }
  });
  failedRequestsQueue = [];
};

// Custom link to handle token refresh
const authLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      // Function to execute current operation
      const executeOperation = () => next(op).subscribe({
        next: observer.next,
        error: observer.error,
        complete: observer.complete,
      });
      
      const subscription = next(op).subscribe({
        next: (result) => {
          observer.next(result);
        },
        error: async (error) => {
          // Check if it's an UNAUTHORIZED error and not already refreshing
          const isAuthError = error instanceof TRPCClientError && 
                              error.data?.code === 'UNAUTHORIZED';
          
          if (isAuthError && !isRefreshing && getAuthToken()) {
            // Prevent concurrent refresh attempts
            isRefreshing = true;
            
            // Create a promise for this request to wait
            const retryPromise = new Promise<void>((resolve, reject) => {
              failedRequestsQueue.push({ resolve, reject });
            });
            
            try {
              // Attempt to refresh the token
              console.log('Attempting to refresh token due to unauthorized error');
              const { accessToken } = await trpcClient.auth.refreshToken.query();
              
              // Store the new token
              setAuthToken(accessToken);
              console.log('Token refreshed successfully');
              
              // Process all queued requests
              processQueue(null, accessToken);
              
              // Wait for the promise to resolve before retrying
              await retryPromise;
              
              // Retry the original request with new token
              const retrySubscription = executeOperation();
              return () => {
                subscription.unsubscribe();
                retrySubscription.unsubscribe();
              };
              
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              
              // Clear invalid token
              removeAuthToken();
              
              // Reset auth state
              queryClient.resetQueries({ queryKey: trpc.auth.checkAuth.queryKey() });
              
              // Process queue with error
              processQueue(refreshError);
              
              // Propagate the original error
              observer.error(error);
              
            } finally {
              isRefreshing = false;
            }
            
          } else if (isAuthError && isRefreshing) {
            // If already refreshing, queue this request
            console.log('Auth error while token refresh in progress, queueing request');
            
            try {
              // Add current request to queue
              const retryPromise = new Promise<void>((resolve, reject) => {
                failedRequestsQueue.push({ resolve, reject });
              });
              
              // Wait for token refresh to complete
              await retryPromise;
              
              // Retry with new token
              const retrySubscription = executeOperation();
              return () => {
                subscription.unsubscribe();
                retrySubscription.unsubscribe();
              };
              
            } catch (queueError) {
              // If queue processing fails, propagate original error
              observer.error(error);
            }
            
          } else {
            // Not an auth error or already handled, pass through
            observer.error(error);
          }
        },
        complete: () => {
          observer.complete();
        },
      });
      
      return subscription;
    });
  };
};

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (import.meta.env.DEV) || // Use Vite's env variable
        (opts.direction === 'down' && opts.result instanceof Error),
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

// Export the raw client for direct usage
export { trpcClient };

// Create the proxy using the client instance directly
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient, // Pass the queryClient here
});