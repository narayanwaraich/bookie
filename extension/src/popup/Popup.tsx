import React, { useEffect, useState } from 'react';
import { trpc } from '../lib/trpc';
import { useQuery, useMutation } from '@tanstack/react-query';

// Re-using types from your backend Zod schemas is a huge win!
import type { CreateBookmarkInput } from '@backend/src/api/models/schemas';
type Folder = { id: string; name: string };
type Tag = { id: string; name: string };

export function Popup() {
  // UI State
  const [authState, setAuthState] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading');
  const [status, setStatus] = useState<
    'idle' | 'saving' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Form Data State
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<
    string | undefined
  >(undefined);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    new Set()
  );
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Data from Backend
  const { data: folders, isLoading: isLoadingFolders } = useQuery(
    trpc.folders.list.queryOptions(
      {},
      {
        enabled: authState === 'authenticated',
      }
    )
  );
  const { data: tags, isLoading: isLoadingTags } = useQuery(
    trpc.tags.list.queryOptions(
      {},
      {
        enabled: authState === 'authenticated',
      }
    )
  );

  // tRPC Mutations
  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions()
  );
  const createBookmarkMutation = useMutation(
    trpc.bookmarks.create.mutationOptions()
  );

  // Initial load effect
  useEffect(() => {
    chrome.storage.local.get('authToken', (result) => {
      if (result.authToken) {
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
      }
    });

    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs) => {
        if (tabs[0]) {
          setUrl(tabs[0].url || '');
          setTitle(tabs[0].title || '');
        }
      }
    );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    loginMutation.mutate(
      { email: loginEmail, password: loginPassword },
      {
        onSuccess: (data) => {
          chrome.storage.local.set(
            { authToken: data.accessToken },
            () => {
              setAuthState('authenticated');
              setStatus('idle');
            }
          );
        },
        onError: (error) => {
          setStatus('error');
          setErrorMessage(error.message);
        },
      }
    );
  };

  const handleSaveBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');

    const bookmarkData: CreateBookmarkInput = {
      url,
      title,
      folderId: selectedFolderId,
      tags: Array.from(selectedTagIds),
    };

    createBookmarkMutation.mutate(bookmarkData, {
      onSuccess: () => {
        setStatus('success');
        setTimeout(() => window.close(), 1500);
      },
      onError: (error) => {
        setStatus('error');
        setErrorMessage(error.message);
      },
    });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tagId)) {
        newSet.delete(tagId);
      } else {
        newSet.add(tagId);
      }
      return newSet;
    });
  };

  // Render loading state
  if (authState === 'loading') {
    return <div className="p-4 w-80 text-center">Loading...</div>;
  }

  // Render login form if unauthenticated
  if (authState === 'unauthenticated') {
    return (
      <div className="p-4 w-80">
        <h1 className="text-lg font-bold mb-4 text-center">
          Login to Bookie
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="Email"
            required
            className="input-style"
          />
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Password"
            required
            className="input-style"
          />
          <button
            type="submit"
            disabled={status === 'saving'}
            className="button-style"
          >
            {status === 'saving' ? 'Logging in...' : 'Login'}
          </button>
          {status === 'error' && (
            <p className="error-message">{errorMessage}</p>
          )}
        </form>
      </div>
    );
  }

  // Render bookmark form if authenticated
  return (
    <div className="p-4 w-96">
      <h1 className="text-lg font-bold mb-4 text-center">
        Save to Bookie
      </h1>
      <form onSubmit={handleSaveBookmark} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="input-style"
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="input-style"
        />

        <div>
          <label className="label-style">Folder (Optional)</label>
          <select
            value={selectedFolderId || ''}
            onChange={(e) =>
              setSelectedFolderId(e.target.value || undefined)
            }
            className="input-style"
            disabled={isLoadingFolders}
          >
            <option value="">No Folder</option>
            {folders?.data.map((folder: Folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-style">Tags (Optional)</label>
          <div className="flex flex-wrap gap-2 mt-2 p-2 border rounded-md min-h-[40px]">
            {isLoadingTags ? (
              <p className="text-xs text-gray-500">Loading tags...</p>
            ) : (
              tags?.data.map((tag: Tag) => (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-2 py-1 text-xs rounded-full border ${
                    selectedTagIds.has(tag.id)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-100'
                  }`}
                >
                  {tag.name}
                </button>
              ))
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'saving' || status === 'success'}
          className="button-style"
        >
          {status === 'saving' && 'Saving...'}
          {status === 'success' && 'Saved!'}
          {status === 'idle' && 'Save Bookmark'}
          {status === 'error' && 'Retry Save'}
        </button>
        {status === 'error' && (
          <p className="error-message">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
