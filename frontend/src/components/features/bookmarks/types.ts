import type { inferOutput } from "@trpc/tanstack-react-query";
import type { trpc } from "@/lib/api";

// Core bookmark types inferred from tRPC
export type BookmarkSearchResult = inferOutput<typeof trpc.bookmarks.search>;
export type Bookmark = BookmarkSearchResult["bookmarks"][number];
export type TagListResult = inferOutput<typeof trpc.tags.list>;
export type Tag = TagListResult["data"][number];
export type FolderListResult = inferOutput<typeof trpc.folders.list>;
export type Folder = FolderListResult["data"][number];

// UI and filter types
export type ViewMode = "grid" | "list";
export type SortOption =
  | "createdAt"
  | "updatedAt"
  | "lastVisited"
  | "visitCount"
  | "title";
export type SortOrder = "asc" | "desc";

// Bulk action types
export type BulkActionType =
  | "delete"
  | "addTag"
  | "addToFolder"
  | "removeTag"
  | "removeFromFolder";

// Filter state interface
export interface BookmarkFilters {
  searchQuery: string;
  sortBy: SortOption;
  sortOrder: SortOrder;
  selectedTags: string[];
  selectedFolderId?: string;
  currentPage: number;
}

// Selection state interface
export interface BookmarkSelection {
  selectedBookmarkIds: Set<string>;
  isSelectAllMode: boolean;
}

// Component props interfaces
export interface BookmarkListProps {
  initialFolderId?: string;
  showFolderFilter?: boolean;
}

export interface BookmarkContextValue {
  filters: BookmarkFilters;
  selection: BookmarkSelection;
  viewMode: ViewMode;
  updateFilters: (updates: Partial<BookmarkFilters>) => void;
  updateSelection: (updates: Partial<BookmarkSelection>) => void;
  setViewMode: (mode: ViewMode) => void;
  resetFilters: () => void;
  clearSelection: () => void;
}
