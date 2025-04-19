// Auth token helpers (localStorage)
import * as React from 'react'

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

export interface AuthContext {
  isAuthenticated: boolean
  login: (username: string) => Promise<void>
  logout: () => Promise<void>
  user: string | null
}

const AuthContext = React.createContext<AuthContext | null>(null)

const key = 'tanstack.auth.user'

function getStoredUser() {
  return localStorage.getItem(key)
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key, user)
  } else {
    localStorage.removeItem(key)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(getStoredUser())
  const isAuthenticated = !!user

  const logout = React.useCallback(async () => {
    setStoredUser(null)
    setUser(null)
  }, [])

  const login = React.useCallback(async (username: string) => {
    setStoredUser(username)
    setUser(username)
  }, [])

  React.useEffect(() => {
    setUser(getStoredUser())
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

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

