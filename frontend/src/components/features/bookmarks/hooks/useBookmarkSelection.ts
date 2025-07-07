import { useState, useCallback, useEffect } from "react";
import type { BookmarkSelection } from "../types";

export const useBookmarkSelection = () => {
  const [selection, setSelection] = useState<BookmarkSelection>({
    selectedBookmarkIds: new Set(),
    isSelectAllMode: false,
  });

  const updateSelection = useCallback((updates: Partial<BookmarkSelection>) => {
    setSelection((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setSelection({
      selectedBookmarkIds: new Set(),
      isSelectAllMode: false,
    });
  }, []);

  const toggleBookmarkSelection = useCallback((bookmarkId: string) => {
    setSelection((prev) => {
      const newSet = new Set(prev.selectedBookmarkIds);
      if (newSet.has(bookmarkId)) {
        newSet.delete(bookmarkId);
      } else {
        newSet.add(bookmarkId);
      }
      return {
        ...prev,
        selectedBookmarkIds: newSet,
      };
    });
  }, []);

  const selectAllOnPage = useCallback(
    (bookmarkIds: string[], shouldSelect: boolean) => {
      setSelection((prev) => {
        const newSet = new Set(prev.selectedBookmarkIds);
        bookmarkIds.forEach((id) => {
          if (shouldSelect) {
            newSet.add(id);
          } else {
            newSet.delete(id);
          }
        });
        return {
          ...prev,
          selectedBookmarkIds: newSet,
        };
      });
    },
    [],
  );

  const isBookmarkSelected = useCallback(
    (bookmarkId: string) => {
      return selection.selectedBookmarkIds.has(bookmarkId);
    },
    [selection.selectedBookmarkIds],
  );

  const areAllOnPageSelected = useCallback(
    (bookmarkIds: string[]) => {
      return (
        bookmarkIds.length > 0 &&
        bookmarkIds.every((id) => selection.selectedBookmarkIds.has(id))
      );
    },
    [selection.selectedBookmarkIds],
  );

  return {
    selection,
    updateSelection,
    clearSelection,
    toggleBookmarkSelection,
    selectAllOnPage,
    isBookmarkSelected,
    areAllOnPageSelected,
  };
};
