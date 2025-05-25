// (for lists like bookmarks)
// This is a generic toolbar. Your BookmarkList.tsx already has similar logic. You can decide whether to adopt this generic one or keep the logic within BookmarkList.tsx. If you plan to have bulk actions on other lists (e.g., tags, collections), a generic component is better.

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Folder as FolderIcon,
  Tag as TagIcon,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define types for available actions and their handlers
type BulkAction =
  | { type: "moveToFolder"; handler: (folderId: string) => void }
  | { type: "addTag"; handler: (tagId: string) => void }
  // | { type: 'removeTag'; handler: (tagId: string) => void; } // Example
  | { type: "delete"; handler: () => void }
  | {
      type: "custom";
      label: string;
      icon?: React.ElementType;
      handler: () => void;
      variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link"
        | null
        | undefined;
    };

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  availableActions: BulkAction[];
  // Optional: Data for populating dropdowns, e.g., folders, tags
  folders?: Array<{ id: string; name: string }>;
  tags?: Array<{ id: string; name: string }>;
  isLoading?: boolean; // To disable actions while processing
  className?: string;
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  availableActions,
  folders = [],
  tags = [],
  isLoading = false,
  className,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) {
    return null;
  }

  const renderAction = (action: BulkAction) => {
    switch (action.type) {
      case "moveToFolder":
        return (
          <DropdownMenu key="move-to-folder">
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || folders.length === 0}
              >
                <FolderIcon className="mr-2 h-4 w-4" /> Move to Folder
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Folder</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onSelect={() => action.handler(folder.id)}
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No folders available
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "addTag":
        return (
          <DropdownMenu key="add-tag">
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || tags.length === 0}
              >
                <TagIcon className="mr-2 h-4 w-4" /> Add Tag
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Tag</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <DropdownMenuItem
                    key={tag.id}
                    onSelect={() => action.handler(tag.id)}
                  >
                    {tag.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No tags available</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "delete":
        return (
          <Button
            key="delete"
            variant="destructive"
            size="sm"
            onClick={action.handler}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
          </Button>
        );
      case "custom":
        const Icon = action.icon;
        return (
          <Button
            key={action.label}
            variant={action.variant || "outline"}
            size="sm"
            onClick={action.handler}
            disabled={isLoading}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />} {action.label}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 px-4 border rounded-md bg-background shadow-sm mb-4",
        className,
      )}
    >
      <div className="text-sm font-medium">
        {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
      </div>
      <div className="flex items-center space-x-2">
        {availableActions.map(renderAction)}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isLoading}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
