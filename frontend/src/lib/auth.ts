// Auth token helpers (localStorage)
const AUTH_TOKEN_KEY = 'authToken';

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// Optional: Decode JWT (install jwt-decode if needed: pnpm add jwt-decode)
// import { jwtDecode } from "jwt-decode";
// interface DecodedToken {
//   userId: string;
//   // other claims...
//   exp: number;
// }
// export function decodeToken(token: string): DecodedToken | null {
//   try {
//     return jwtDecode<DecodedToken>(token);
//   } catch (error) {
//     console.error("Failed to decode token:", error);
//     return null;
//   }
// }
