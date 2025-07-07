import type { SortOption, SortOrder, BookmarkFilters } from "./types";

// Pagination constants
export const ITEMS_PER_PAGE = 12;
export const SEARCH_DEBOUNCE_DELAY = 300;

// Default filter values
export const DEFAULT_FILTERS: BookmarkFilters = {
  searchQuery: "",
  sortBy: "createdAt" as SortOption,
  sortOrder: "desc" as SortOrder,
  selectedTags: [],
  selectedFolderId: undefined,
  currentPage: 1,
};

// Sort options for select dropdown
export const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Added" },
  { value: "updatedAt", label: "Date Updated" },
  { value: "lastVisited", label: "Last Visited" },
  { value: "visitCount", label: "Visit Count" },
  { value: "title", label: "Title" },
] as const;

// Sort order options
export const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
] as const;

// Bulk action labels and icons
export const BULK_ACTION_LABELS = {
  delete: "Delete",
  addTag: "Add Tag",
  addToFolder: "Move to Folder",
  removeTag: "Remove Tag",
  removeFromFolder: "Remove from Folder",
} as const;
