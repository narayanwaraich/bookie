// Shadcn utils + general helpers
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility to check if token is valid and not expired
 * @param token JWT token to validate
 * @returns boolean indicating if token is valid
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  
  try {
    // Parse token without library dependency
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    const { exp } = JSON.parse(jsonPayload);
    
    // Check if token is expired
    if (!exp) return false;
    return Date.now() < exp * 1000;
  } catch (e) {
    console.error('Failed to validate token:', e);
    return false;
  }
}

/**
 * Helper function to extract user ID from a token
 */
export function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  
  try {
    // Parse token without library dependency
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    const { id, sub } = JSON.parse(jsonPayload);
    
    // Return id or sub, whichever is present
    return id || sub || null;
  } catch (e) {
    console.error('Failed to extract user ID from token:', e);
    return null;
  }
}