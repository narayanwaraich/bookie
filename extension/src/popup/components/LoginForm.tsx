import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '../../lib/trpc';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    ...trpc.auth.login.mutationOptions(),
    onSuccess: (data) => {
      chrome.storage.local.set(
        { authToken: data.accessToken },
        () => {
          onLoginSuccess();
        }
      );
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="p-4 w-80">
      <h1 className="text-lg font-bold mb-4 text-center">
        Login to Bookie
      </h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="input-style"
          disabled={loginMutation.isPending}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="input-style"
          disabled={loginMutation.isPending}
        />
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="button-style"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
        {loginMutation.isError && (
          <p className="error-message">
            {loginMutation.error.message}
          </p>
        )}
      </form>
    </div>
  );
}
