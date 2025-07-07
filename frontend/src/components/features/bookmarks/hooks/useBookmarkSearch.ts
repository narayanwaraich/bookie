import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { trpc } from "@/lib/api";
import { ITEMS_PER_PAGE, SEARCH_DEBOUNCE_DELAY } from "../constants";
import type { BookmarkFilters } from "../types";

export const useBookmarkSearch = (filters: BookmarkFilters) => {
  const debouncedSearchQuery = useDebounce(
    filters.searchQuery,
    SEARCH_DEBOUNCE_DELAY,
  );

  const queryOptions = trpc.bookmarks.search.queryOptions({
    query: debouncedSearchQuery,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    tagIds: filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
    folderId: filters.selectedFolderId,
    limit: ITEMS_PER_PAGE,
    offset: (filters.currentPage - 1) * ITEMS_PER_PAGE,
  });

  const {
    data: searchResult,
    isLoading,
    error,
    isFetching,
  } = useQuery(queryOptions);

  const totalBookmarks = searchResult?.totalCount ?? 0;
  const totalPages = Math.ceil(totalBookmarks / ITEMS_PER_PAGE);
  const bookmarks = searchResult?.bookmarks ?? [];

  return {
    bookmarks,
    searchResult,
    totalBookmarks,
    totalPages,
    isLoading,
    error,
    isFetching,
    queryOptions,
  };
};
