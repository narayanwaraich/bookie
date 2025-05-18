import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./authTypes";

// Local storage key for the access token
export const AUTH_TOKEN_KEY = "authToken";

// Get token from storage
export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Save token to storage
export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

// Remove token from storage
export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// Check if token is about to expire
export function isTokenExpiringSoon(
  token: string,
  bufferMs: number = 60000,
): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const expiryTime = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() + bufferMs > expiryTime;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true; // Assume token is invalid if we can't decode it
  }
}

// Decode and validate token
export function decodeToken(token: string | null): {
  valid: boolean;
  decoded: DecodedToken | null;
} {
  if (!token) return { valid: false, decoded: null };

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Date.now();
    const expiryTime = decoded.exp * 1000;

    return {
      valid: expiryTime > now,
      decoded,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return { valid: false, decoded: null };
  }
}
