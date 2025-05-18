import React, {
  createContext,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { trpc } from "../api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isTokenExpiringSoon,
} from "./authTokens";
import { refreshToken, scheduleRefresh } from "./authRefresh";
import { authEvents } from "./authEvents";
import { AuthContext as AuthContextType } from "./authTypes";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const refreshTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const authQueryKey = trpc.auth.checkAuth.queryKey();

  // Function to clear any existing refresh timeout
  const clearRefreshTimeout = useCallback(() => {
    if (refreshTimeoutId.current) {
      clearTimeout(refreshTimeoutId.current);
      refreshTimeoutId.current = null;
    }
  }, []);

  // Refresh token wrapper that manages state
  const handleRefreshToken = useCallback(async (): Promise<boolean> => {
    return refreshToken(setIsRefreshing);
  }, []);

  // Schedule refresh with timeout management
  const handleScheduleRefresh = useCallback(
    (token: string | null) => {
      refreshTimeoutId.current = scheduleRefresh(
        token,
        handleRefreshToken,
        clearRefreshTimeout,
      );
    },
    [handleRefreshToken, clearRefreshTimeout],
  );

  // Query to fetch the current user
  const { data, isLoading, isError, error } = useQuery(
    trpc.auth.checkAuth.queryOptions(undefined, {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
      refetchOnWindowFocus: true,
      // Don't attempt to fetch if no token exists
      enabled: !!getAuthToken(),
    }),
  );

  if (isError) {
    console.error("Auth check failed:", error);
    // If the error is UNAUTHORIZED and we have a token, try to refresh once
    if (getAuthToken() && error?.message?.includes("UNAUTHORIZED")) {
      handleRefreshToken().catch(() => {
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
        // If token is valid but expiring soon, refresh immediately
        if (isTokenExpiringSoon(initialToken, 2 * 60 * 1000)) {
          // 2 minutes
          console.log("Token expiring soon, refreshing immediately");
          await handleRefreshToken();
        } else {
          handleScheduleRefresh(initialToken);
        }
      }
    };

    attemptSilentAuth();

    // Cleanup timeout on unmount
    return clearRefreshTimeout;
  }, [handleScheduleRefresh, handleRefreshToken, clearRefreshTimeout]);

  // Login Mutation
  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: (data) => {
        setAuthToken(data.accessToken);
        queryClient.invalidateQueries({ queryKey: authQueryKey });
        handleScheduleRefresh(data.accessToken); // Schedule refresh after login
        authEvents.notify(); // Notify listeners that auth state has changed
      },
      onError: (error) => {
        console.error("Login failed:", error);
        removeAuthToken();
        clearRefreshTimeout(); // Clear timeout on failed login
      },
    }),
  );

  // Logout Mutation
  const logoutMutation = useMutation(
    trpc.auth.logout.mutationOptions({
      onSettled: () => {
        // Use onSettled to ensure cleanup happens regardless of success/error
        removeAuthToken();
        clearRefreshTimeout(); // Clear timeout on logout
        queryClient.resetQueries({ queryKey: authQueryKey });
        authEvents.notify(); // Notify listeners that auth state has changed
      },
      onError: (error) => {
        console.error("Backend logout failed, local state cleared:", error);
        // Cleanup is handled in onSettled
      },
    }),
  );

  // Memoized login function
  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      await loginMutation.mutateAsync(credentials);
    },
    [loginMutation],
  );

  // Memoized logout function
  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const isAuthenticated = !!data?.user && !isError;
  const user = data?.user ?? null;

  // Memoized auth context value
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading: isLoading && !data, // Only show loading on initial load
      isLoggingIn: loginMutation.isPending,
      isLoggingOut: logoutMutation.isPending,
      isRefreshing,
      login,
      logout,
      refreshToken: handleRefreshToken,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      data,
      loginMutation.isPending,
      logoutMutation.isPending,
      isRefreshing,
      login,
      logout,
      handleRefreshToken,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// useAuth Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
