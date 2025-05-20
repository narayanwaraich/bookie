import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Save, History, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SearchConfig {
  id: string;
  name: string;
  searchQuery: string;
  selectedColor: string | null;
  sortBy: "name" | "date" | "bookmarkCount";
  sortOrder: "asc" | "desc";
  timestamp: number;
}

interface SavedSearchesProps {
  currentSearch: {
    searchQuery: string;
    selectedColor: string | null;
    sortBy: "name" | "date" | "bookmarkCount";
    sortOrder: "asc" | "desc";
  };
  onApplySearch: (
    search: Omit<SearchConfig, "id" | "name" | "timestamp">,
  ) => void;
}

export const SavedSearches: React.FC<SavedSearchesProps> = ({
  currentSearch,
  onApplySearch,
}) => {
  const [savedSearches, setSavedSearches] = useLocalStorage<SearchConfig[]>(
    "savedFolderSearches",
    [],
  );

  const handleSaveSearch = () => {
    const name = window.prompt("Enter a name for this search:");
    if (!name) return;

    const newSearch: SearchConfig = {
      id: crypto.randomUUID(),
      name,
      ...currentSearch,
      timestamp: Date.now(),
    };

    setSavedSearches((prev) => [...prev, newSearch]);
  };

  const handleDeleteSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((search) => search.id !== id));
  };

  const handleApplySearch = (search: SearchConfig) => {
    const { id, name, timestamp, ...searchConfig } = search;
    onApplySearch(searchConfig);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <History className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleSaveSearch}>
          <Save className="mr-2 h-4 w-4" />
          Save Current Search
        </DropdownMenuItem>
        {savedSearches.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {savedSearches.map((search) => (
              <DropdownMenuItem
                key={search.id}
                className="flex items-center justify-between"
                onClick={() => handleApplySearch(search)}
              >
                <div className="flex-1">
                  <div className="font-medium">{search.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(search.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSearch(search.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
