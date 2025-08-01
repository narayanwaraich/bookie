import { useState, useEffect } from 'react';

export type AuthState =
  | 'loading'
  | 'authenticated'
  | 'unauthenticated';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    chrome.storage.local.get('authToken', (result) => {
      if (result.authToken) {
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
      }
    });
  }, []);

  return { authState, setAuthState };
}
