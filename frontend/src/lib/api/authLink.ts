import { observable } from "@trpc/server/observable";
import { type TRPCLink } from "@trpc/client";
import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "./types";
import { getAuthToken, setAuthToken, removeAuthToken } from "../auth";
import { queryClient } from "../queryClient";
import { trpcClient } from "./trpcClient";
import { trpc } from "./index";

// Flag to prevent infinite refresh loops
let isRefreshing = false;

// Queue for requests that failed while token was refreshing
type QueueItem = {
  resolve: (value: void | PromiseLike<void>) => void;
  reject: (reason?: any) => void;
};

let failedRequestsQueue: QueueItem[] = [];

// Process all queued requests after refresh attempt
export const processQueue = (error: any, token: string | null = null) => {
  failedRequestsQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined); // Resolve to retry the request
    }
  });
  failedRequestsQueue = [];
};

// Function to handle token refresh
export async function refreshAccessToken(): Promise<string> {
  try {
    const { accessToken } = await trpcClient.auth.refreshToken.query();
    setAuthToken(accessToken);
    console.log("Token refreshed successfully");
    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    removeAuthToken();

    // Reset auth state
    queryClient.resetQueries({
      queryKey: trpc.auth.checkAuth.queryKey(),
    });

    throw error;
  }
}

// Custom link to handle token refresh
export const authLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      // Function to execute current operation
      const executeOperation = () =>
        next(op).subscribe({
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
          const isAuthError =
            error instanceof TRPCClientError &&
            error.data?.code === "UNAUTHORIZED";

          if (isAuthError && !isRefreshing && getAuthToken()) {
            // Prevent concurrent refresh attempts
            isRefreshing = true;

            // Create a promise for this request to wait
            const retryPromise = new Promise<void>((resolve, reject) => {
              failedRequestsQueue.push({ resolve, reject });
            });

            try {
              // Attempt to refresh the token
              console.log(
                "Attempting to refresh token due to unauthorized error",
              );

              const accessToken = await refreshAccessToken();

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
              // Process queue with error
              processQueue(refreshError);

              // Propagate the original error
              observer.error(error);
            } finally {
              isRefreshing = false;
            }
          } else if (isAuthError && isRefreshing) {
            // If already refreshing, queue this request
            console.log(
              "Auth error while token refresh in progress, queueing request",
            );

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
