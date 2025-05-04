import React, { createContext, useContext, useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { trpc, trpcClient } from './api'; // Import your tRPC proxy AND the raw client
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from './queryClient'; // Import queryClient for invalidation
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import type { inferOutput } from '@trpc/tanstack-react-query';

type User = inferOutput<typeof trpc.auth.checkAuth>["user"];

// Define the shape of the JWT payload
interface DecodedToken {
  exp: number
  iat: number
  id: string
  email?: string
  username?: string
}

// Define the shape of the Auth Context
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isRefreshing: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Local storage key for the access token
const AUTH_TOKEN_KEY = 'authToken';

// Configuration for token refresh timing
interface RefreshConfig {
  // Percentage of token lifetime after which to refresh (0.75 = 75%)
  refreshRatio: number;
  // Minimum time before expiry to trigger refresh (in ms)
  minimumRefreshBuffer: number;
  // Maximum time before expiry to trigger refresh (in ms)
  maximumRefreshBuffer: number;
}

const DEFAULT_REFRESH_CONFIG: RefreshConfig = {
  refreshRatio: 0.75,
  minimumRefreshBuffer: 30 * 1000, // 30 seconds minimum
  maximumRefreshBuffer: 15 * 60 * 1000, // 15 minutes maximum
};

// Simple auth event system
export const authEvents = {
  listeners: new Set<() => void>(),
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  notify() {
    this.listeners.forEach(listener => listener());
  }
};

// --- Token Helper Functions ---
export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// Helper to check if a token is about to expire
export function isTokenExpiringSoon(token: string, bufferMs: number = 60000): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const expiryTime = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() + bufferMs > expiryTime;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return true; // Assume token is invalid if we can't decode it
  }
}

// --- AuthProvider Component ---
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const refreshTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const authQueryKey = trpc.auth.checkAuth.queryKey();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to clear any existing refresh timeout
  const clearRefreshTimeout = useCallback(() => {
    if (refreshTimeoutId.current) {
      clearTimeout(refreshTimeoutId.current);
      refreshTimeoutId.current = null;
    }
  }, []);

  // Function to attempt token refresh
  const refreshToken = useCallback(async (): Promise<boolean> => {
    setIsRefreshing(true);
    console.log('Attempting token refresh...');
    
    try {
      // Use the raw trpcClient directly, not hooks or the proxy
      const { accessToken } = await trpcClient.auth.refreshToken.query();
      setAuthToken(accessToken);
      console.log('Token refresh successful.');
      
      // Invalidate auth query to refetch user data with new token
      queryClient.invalidateQueries({ queryKey: authQueryKey });
      
      // Schedule the next refresh based on the new token's expiry
      scheduleRefresh(accessToken);
      
      // Notify listeners that auth state has changed
      authEvents.notify(); 
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, clean up
      removeAuthToken();
      queryClient.resetQueries({ queryKey: authQueryKey });
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [authQueryKey]); 

  // Function to schedule the refresh
  const scheduleRefresh = useCallback((token: string | null, config: RefreshConfig = DEFAULT_REFRESH_CONFIG) => {
    clearRefreshTimeout(); // Clear any previous timeout
    
    if (!token) return;
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const now = Date.now();
      const expiryTime = decoded.exp * 1000;
      const timeUntilExpiry = expiryTime - now;
      
      if (timeUntilExpiry <= 0) {
        console.log('Token already expired, removing...');
        removeAuthToken();
        queryClient.resetQueries({ queryKey: authQueryKey });
        return;
      }
      
      // Calculate refresh time based on configuration
      // We want to refresh after X% of the token's lifetime, but not too close to expiry
      const idealRefreshTime = timeUntilExpiry * (1 - config.refreshRatio);
      
      // Ensure refresh happens within reasonable bounds
      const boundedRefreshTime = Math.max(
        Math.min(idealRefreshTime, timeUntilExpiry - config.minimumRefreshBuffer),
        timeUntilExpiry - config.maximumRefreshBuffer
      );
      
      if (boundedRefreshTime > 0) {
        console.log(`Scheduling token refresh in ${Math.round(boundedRefreshTime / 1000)} seconds.`);
        refreshTimeoutId.current = setTimeout(refreshToken, boundedRefreshTime);
      } else {
        // Token very close to expiry, refresh immediately
        console.log('Token too close to expiry, refreshing immediately');
        refreshToken();
      }
    } catch (error) {
      console.error('Failed to decode token for scheduling refresh:', error);
      removeAuthToken();
      queryClient.resetQueries({ queryKey: authQueryKey });
    }
  }, [clearRefreshTimeout, refreshToken, authQueryKey]);

  // Query to fetch the current user
  const { data, isLoading, isError, error } = useQuery(trpc.auth.checkAuth.queryOptions(
    undefined,
    {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
      refetchOnWindowFocus: true,
      // Don't attempt to fetch if no token exists
      enabled: !!getAuthToken(),
    }
  ));

  if (isError){
    console.error('Auth check failed:', error);
    // If the error is UNAUTHORIZED and we have a token, try to refresh once
    if (getAuthToken() && error?.message?.includes('UNAUTHORIZED')) {
      refreshToken().catch(() => {
        // If refresh fails, we'll clear the token
        removeAuthToken();
      });
    }
  }

  // Effect to schedule refresh on initial load if token exists
  useEffect(() => {
    const attemptSilentAuth = async () => {
      const initialToken = getAuthToken();
      if (initialToken) {
        // Validate token structure/expiry roughly before scheduling
        try {
          const decoded = jwtDecode<DecodedToken>(initialToken);
          if (decoded.exp * 1000 > Date.now()) {
            // If token is valid but expiring soon, refresh immediately
            if (isTokenExpiringSoon(initialToken, 2 * 60 * 1000)) { // 2 minutes
              console.log('Token expiring soon, refreshing immediately');
              await refreshToken();
            } else {
              scheduleRefresh(initialToken);
            }
          } else {
            console.log("Initial token already expired, attempting refresh");
            // Try refresh once with expired token (server might still accept it)
            const refreshed = await refreshToken();
            if (!refreshed) {
              removeAuthToken();
            }
          }
        } catch (e) {
          console.error("Invalid initial token found:", e);
          removeAuthToken();
        }
      }
    };
    
    attemptSilentAuth();
    
    // Cleanup timeout on unmount
    return clearRefreshTimeout;
  }, [scheduleRefresh, refreshToken, clearRefreshTimeout]);

  // Login Mutation
  const loginMutation = useMutation(trpc.auth.login.mutationOptions({
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: authQueryKey });
      scheduleRefresh(data.accessToken); // Schedule refresh after login
      authEvents.notify(); // Notify listeners that auth state has changed
    },
    onError: (error) => {
      console.error("Login failed:", error);
      removeAuthToken();
      clearRefreshTimeout(); // Clear timeout on failed login
    },
  }));

  // Logout Mutation
  const logoutMutation = useMutation(trpc.auth.logout.mutationOptions({
    onSettled: () => { // Use onSettled to ensure cleanup happens regardless of success/error
      removeAuthToken();
      clearRefreshTimeout(); // Clear timeout on logout
      queryClient.resetQueries({ queryKey: authQueryKey });
      authEvents.notify(); // Notify listeners that auth state has changed
    },
    onError: (error) => {
      console.error("Backend logout failed, local state cleared:", error);
      // Cleanup is handled in onSettled
    },
  }));

  // Memoized login function
  const login = useCallback(async (credentials: { email: string; password: string }) => {
    await loginMutation.mutateAsync(credentials);
  }, [loginMutation]);

  // Memoized logout function
  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const isAuthenticated = !!data?.user && !isError;
  const user = data?.user ?? null;

  // Memoized auth context value
  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading: isLoading && !data, // Only show loading on initial load
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing,
    login,
    logout,
    refreshToken,
  }), [
    user,
    isAuthenticated,
    isLoading,
    data,
    loginMutation.isPending,
    logoutMutation.isPending,
    isRefreshing,
    login,
    logout,
    refreshToken
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- useAuth Hook ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}