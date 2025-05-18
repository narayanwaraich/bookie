import { trpcClient } from "../api"; // Adjust path as needed
import { queryClient } from "../queryClient"; // Adjust path as needed
import { setAuthToken, removeAuthToken, decodeToken } from "./authTokens";
import { RefreshConfig, DEFAULT_REFRESH_CONFIG } from "./authTypes";
import { authEvents } from "./authEvents";
import { trpc } from "../api"; // Adjust path as needed

// Function to attempt token refresh
export async function refreshToken(
  setIsRefreshing?: (refreshing: boolean) => void,
): Promise<boolean> {
  setIsRefreshing?.(true);
  console.log("Attempting token refresh...");

  try {
    // Use the raw trpcClient directly, not hooks or the proxy
    const { accessToken } = await trpcClient.auth.refreshToken.query();
    setAuthToken(accessToken);
    console.log("Token refresh successful.");

    // Invalidate auth query to refetch user data with new token
    const authQueryKey = trpc.auth.checkAuth.queryKey();
    queryClient.invalidateQueries({ queryKey: authQueryKey });

    // Notify listeners that auth state has changed
    authEvents.notify();

    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // If refresh fails, clean up
    removeAuthToken();
    const authQueryKey = trpc.auth.checkAuth.queryKey();
    queryClient.resetQueries({ queryKey: authQueryKey });
    return false;
  } finally {
    setIsRefreshing?.(false);
  }
}

// Function to schedule the refresh
export function scheduleRefresh(
  token: string | null,
  refreshCallback: () => Promise<boolean>,
  clearExistingTimeout: () => void,
  config: RefreshConfig = DEFAULT_REFRESH_CONFIG,
): NodeJS.Timeout | null {
  clearExistingTimeout(); // Clear any previous timeout

  if (!token) return null;

  const { valid, decoded } = decodeToken(token);
  if (!valid || !decoded) {
    console.log("Invalid token for refresh scheduling, removing...");
    removeAuthToken();
    const authQueryKey = trpc.auth.checkAuth.queryKey();
    queryClient.resetQueries({ queryKey: authQueryKey });
    return null;
  }

  const now = Date.now();
  const expiryTime = decoded.exp * 1000;
  const timeUntilExpiry = expiryTime - now;

  // Calculate refresh time based on configuration
  // We want to refresh after X% of the token's lifetime, but not too close to expiry
  const idealRefreshTime = timeUntilExpiry * (1 - config.refreshRatio);

  // Ensure refresh happens within reasonable bounds
  const boundedRefreshTime = Math.max(
    Math.min(idealRefreshTime, timeUntilExpiry - config.minimumRefreshBuffer),
    timeUntilExpiry - config.maximumRefreshBuffer,
  );

  if (boundedRefreshTime > 0) {
    // console.log(`Scheduling token refresh in ${Math.round(boundedRefreshTime / 1000)} seconds.`);
    return setTimeout(refreshCallback, boundedRefreshTime);
  } else {
    // Token very close to expiry, refresh immediately
    console.log("Token too close to expiry, refreshing immediately");
    refreshCallback();
    return null;
  }
}
