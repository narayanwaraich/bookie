import { useState, useCallback, useEffect } from "react";
import { DEFAULT_FILTERS } from "../constants";
import type { BookmarkFilters } from "../types";

export const useBookmarkFilters = (initialFolderId?: string) => {
  const [filters, setFilters] = useState<BookmarkFilters>(() => ({
    ...DEFAULT_FILTERS,
    selectedFolderId: initialFolderId,
  }));

  // Update folder filter when initialFolderId prop changes
  useEffect(() => {
    if (initialFolderId !== undefined) {
      setFilters((prev) => ({
        ...prev,
        selectedFolderId: initialFolderId,
        currentPage: 1, // Reset to first page when folder context changes
      }));
    }
  }, [initialFolderId]);

  const updateFilters = useCallback((updates: Partial<BookmarkFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      // Reset to first page when filters change (except for currentPage updates)
      currentPage: updates.currentPage ?? 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      selectedFolderId: initialFolderId,
    });
  }, [initialFolderId]);

  const toggleTag = useCallback((tagId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter((id) => id !== tagId)
        : [...prev.selectedTags, tagId],
      currentPage: 1,
    }));
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
    toggleTag,
  };
};
