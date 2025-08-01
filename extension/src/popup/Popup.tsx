import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { BookmarkForm } from './components/BookmarkForm';

export function Popup() {
  const { authState, setAuthState } = useAuth();

  if (authState === 'loading') {
    return <div className="p-4 w-80 text-center">Loading...</div>;
  }

  if (authState === 'unauthenticated') {
    return (
      <LoginForm
        onLoginSuccess={() => setAuthState('authenticated')}
      />
    );
  }

  return <BookmarkForm />;
}
