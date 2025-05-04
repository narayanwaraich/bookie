import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SavedSearches } from './SavedSearches';

type Color = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'gray';

interface FolderFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedColor?: Color | null;
  onColorChange: (color: Color | null) => void;
  sortBy: 'name' | 'date' | 'bookmarkCount';
  onSortChange: (sort: 'name' | 'date' | 'bookmarkCount') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

export const FolderFilters: React.FC<FolderFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedColor,
  onColorChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
}) => {
  const hasActiveFilters = searchQuery || selectedColor || sortBy !== 'name' || sortOrder !== 'asc';

  const handleApplySearch = (search: {
    searchQuery: string;
    selectedColor: string | null;
    sortBy: 'name' | 'date' | 'bookmarkCount';
    sortOrder: 'asc' | 'desc';
  }) => {
    onSearchChange(search.searchQuery);
    onColorChange(search.selectedColor as Color | null);
    onSortChange(search.sortBy);
    onSortOrderChange(search.sortOrder);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-b">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
        >
          <X className="h-4 w-4" />
        </Button>
        <SavedSearches
          currentSearch={{
            searchQuery,
            selectedColor: selectedColor || null,
            sortBy,
            sortOrder,
          }}
          onApplySearch={handleApplySearch}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={selectedColor || ''}
            onValueChange={(value) => onColorChange(value as Color | null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All colors</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="yellow">Yellow</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="pink">Pink</SelectItem>
              <SelectItem value="gray">Gray</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as 'name' | 'date' | 'bookmarkCount')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date created</SelectItem>
              <SelectItem value="bookmarkCount">Bookmark count</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 