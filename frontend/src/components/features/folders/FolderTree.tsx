import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { PlusCircle, Folder, ChevronRight, ChevronDown, MoreVertical, Pencil, Trash2, Move } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';
import { FolderForm } from './FolderForm';
import { FolderFilters } from './FolderFilters';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { inferOutput } from '@trpc/tanstack-react-query';
import { createFuzzySearcher } from '@/lib/fuzzySearch';

type Color = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'gray';

type FolderTreeData = inferOutput<typeof trpc.folders.getTree>;
type FolderNode = FolderTreeData[number];

interface FolderTreeProps {
  onSelectFolder?: (folderId: string) => void;
  selectedFolderId?: string;
}

export const FolderTree: React.FC<FolderTreeProps> = ({ onSelectFolder, selectedFolderId }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFolder, setEditingFolder] = useState<FolderNode | null>(null);
  const [isAddPopoverOpen, setIsAddPopoverOpen] = useState(false);
  const [isEditPopoverOpen, setIsEditPopoverOpen] = useState(false);
  const [parentFolderId, setParentFolderId] = useState<string | undefined>(undefined);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'bookmarkCount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data: folderTree, isLoading, error } = useQuery(trpc.folders.getTree.queryOptions());

  const deleteMutation = useMutation(trpc.folders.delete.mutationOptions({
    onSuccess: () => {
      toast.success('Folder deleted successfully');
      queryClient.invalidateQueries({ 
        queryKey: trpc.folders.getTree.queryKey() 
      });
      queryClient.invalidateQueries({ 
        queryKey: trpc.folders.list.queryKey({}) 
      });
    },
    onError: (error) => {
      toast.error(`Failed to delete folder: ${error.message}`);
    },
  }));

  const handleDelete = (folderId: string) => {
    deleteMutation.mutate({ id: folderId });
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleAddSubfolder = (folderId: string) => {
    setParentFolderId(folderId);
    setIsAddPopoverOpen(true);
  };

  // Filter and sort logic
  const filteredAndSortedFolders = useMemo(() => {
    if (!folderTree) return [];

    // Create a flat list of all folders for fuzzy search
    const flattenFolders = (folders: FolderNode[]): FolderNode[] => {
      return folders.reduce<FolderNode[]>((acc, folder) => {
        return [...acc, folder, ...(folder.children ? flattenFolders(folder.children) : [])];
      }, []);
    };

    const allFolders = flattenFolders(folderTree);
    const fuzzySearcher = createFuzzySearcher(allFolders);
    const searchResults = searchQuery ? fuzzySearcher.search(searchQuery) : allFolders;

    // Create a set of matching folder IDs
    const matchingFolderIds = new Set(searchResults.map(folder => folder.id));

    // Filter by color
    const colorFilteredFolders = selectedColor
      ? searchResults.filter(folder => folder.color === selectedColor)
      : searchResults;

    // Sort folders
    const sortFolders = (a: FolderNode, b: FolderNode): number => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'bookmarkCount':
          comparison = (a.bookmarkCount || 0) - (b.bookmarkCount || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    };

    // Rebuild the tree structure while maintaining the hierarchy
    const rebuildTree = (folders: FolderNode[]): FolderNode[] => {
      return folders
        .filter(folder => !folder.parentId) // Start with root folders
        .map(folder => ({
          ...folder,
          children: folder.children
            ? rebuildTree(folder.children.filter(child => matchingFolderIds.has(child.id)))
            : undefined,
        }))
        .sort(sortFolders);
    };

    return rebuildTree(folderTree);
  }, [folderTree, searchQuery, selectedColor, sortBy, sortOrder]);

  const renderFolder = (folder: FolderNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={folder.id} className="space-y-1">
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-accent',
            isSelected && 'bg-accent'
          )}
          onClick={() => onSelectFolder?.(folder.id)}
        >
          <div style={{ paddingLeft: `${level * 1.5}rem` }} className="flex items-center gap-1">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            <Folder className="h-4 w-4" style={{ color: folder.color as string | undefined }} />
            <span className="truncate">{folder.name}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                handleAddSubfolder(folder.id);
              }}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {
                  setEditingFolder(folder);
                  setIsEditPopoverOpen(true);
                }}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddSubfolder(folder.id)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Subfolder
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the folder and all its contents.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(folder.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className="space-y-1">
            {folder.children!.map((child: FolderNode) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading folders...</div>;
  }

  if (error) {
    return <div>Error loading folders: {error.message}</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="font-semibold">Folders</h3>
        <Popover open={isAddPopoverOpen} onOpenChange={setIsAddPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Create New Folder</h4>
              <FolderForm
                parentId={parentFolderId}
                onSuccess={() => {
                  setIsAddPopoverOpen(false);
                  setParentFolderId(undefined);
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <FolderFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onClearFilters={() => {
          setSearchQuery('');
          setSelectedColor(null);
          setSortBy('name');
          setSortOrder('asc');
        }}
      />

      <div className="space-y-1">
        {filteredAndSortedFolders.map((folder) => renderFolder(folder))}
      </div>

      {editingFolder && (
        <Popover open={isEditPopoverOpen} onOpenChange={setIsEditPopoverOpen}>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Edit Folder</h4>
              <FolderForm
                folder={editingFolder}
                onSuccess={() => {
                  setIsEditPopoverOpen(false);
                  setEditingFolder(null);
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
