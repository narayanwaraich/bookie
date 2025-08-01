import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { trpc } from '../../lib/trpc';
import { useActiveTabInfo } from '../hooks/useActiveTabInfo';
import type { CreateBookmarkInput } from '@backend/src/api/models/schemas';

export function BookmarkForm() {
  const { url, setUrl, title, setTitle } = useActiveTabInfo();
  const [selectedFolderId, setSelectedFolderId] = useState<
    string | undefined
  >(undefined);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    new Set()
  );

  // Data from Backend
  const { data: folders, isLoading: isLoadingFolders } = useQuery(
    trpc.folders.list.queryOptions({})
  );
  const { data: tags, isLoading: isLoadingTags } = useQuery(
    trpc.tags.list.queryOptions({})
  );

  const createBookmarkMutation = useMutation({
    ...trpc.bookmarks.create.mutationOptions(),
    onSuccess: () => {
      setTimeout(() => window.close(), 1500);
    },
  });

  const handleSaveBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    const bookmarkData: CreateBookmarkInput = {
      url,
      title,
      folderId: selectedFolderId,
      tags: Array.from(selectedTagIds),
    };
    createBookmarkMutation.mutate(bookmarkData);
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

  const isSubmitting =
    createBookmarkMutation.isPending ||
    createBookmarkMutation.isSuccess;

  const getButtonText = () => {
    if (createBookmarkMutation.isPending) return 'Saving...';
    if (createBookmarkMutation.isSuccess) return 'Saved!';
    if (createBookmarkMutation.isError) return 'Retry Save';
    return 'Save Bookmark';
  };

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
          disabled={isSubmitting}
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="input-style"
          disabled={isSubmitting}
        />

        <div>
          <label className="label-style">Folder (Optional)</label>
          <select
            value={selectedFolderId || ''}
            onChange={(e) =>
              setSelectedFolderId(e.target.value || undefined)
            }
            className="input-style"
            disabled={isLoadingFolders || isSubmitting}
          >
            <option value="">No Folder</option>
            {folders?.data.map((folder) => (
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
              tags?.data.map((tag) => (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-2 py-1 text-xs rounded-full border ${
                    selectedTagIds.has(tag.id)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-100'
                  }`}
                  disabled={isSubmitting}
                >
                  {tag.name}
                </button>
              ))
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="button-style"
        >
          {getButtonText()}
        </button>
        {createBookmarkMutation.isError && (
          <p className="error-message">
            {createBookmarkMutation.error.message}
          </p>
        )}
      </form>
    </div>
  );
}
