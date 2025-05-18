import type { inferOutput } from "@trpc/tanstack-react-query";
import { trpc } from "../api";

// User type from API
export type User = inferOutput<typeof trpc.auth.checkAuth>["user"];

// JWT payload structure
export interface DecodedToken {
  exp: number;
  iat: number;
  id: string;
  email?: string;
  username?: string;
}

// Auth context interface
export interface AuthContext {
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

// Token refresh configuration
export interface RefreshConfig {
  // Percentage of token lifetime after which to refresh (0.75 = 75%)
  refreshRatio: number;
  // Minimum time before expiry to trigger refresh (in ms)
  minimumRefreshBuffer: number;
  // Maximum time before expiry to trigger refresh (in ms)
  maximumRefreshBuffer: number;
}

export const DEFAULT_REFRESH_CONFIG: RefreshConfig = {
  refreshRatio: 0.75,
  minimumRefreshBuffer: 30 * 1000, // 30 seconds minimum
  maximumRefreshBuffer: 15 * 60 * 1000, // 15 minutes maximum
};
