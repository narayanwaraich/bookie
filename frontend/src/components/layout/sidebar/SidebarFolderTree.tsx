import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/api';
import { Folder, ChevronRight, File } from 'lucide-react'; // Assuming File icon is needed for non-folders if applicable
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from '@/components/ui/sidebar'; // Assuming these are exported from the sidebar index
import { cn } from '@/lib/utils';
import type { inferOutput } from '@trpc/tanstack-react-query';

// Reuse the FolderNode type definition (or import if shared)
type FolderTreeData = inferOutput<typeof trpc.folders.getTree>;
type FolderNode = FolderTreeData[number];

interface SidebarFolderTreeProps {
  onSelectFolder?: (folderId: string) => void;
  selectedFolderId?: string;
}

// Recursive component to render each node
const TreeNode: React.FC<{
  node: FolderNode;
  onSelectFolder?: (folderId: string) => void;
  selectedFolderId?: string;
  level?: number; // Optional: for indentation or styling
}> = ({ node, onSelectFolder, selectedFolderId, level = 0 }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedFolderId === node.id;

  // If it's a leaf node (no children) - Render as a simple button
  // Adapt this if you have actual files vs folders distinction
  if (!hasChildren) {
    return (
      <SidebarMenuButton
        isActive={isSelected}
        className="data-[active=true]:bg-accent" // Example active style
        onClick={() => onSelectFolder?.(node.id)}
        style={{ paddingLeft: `${1 + level * 1.5}rem` }} // Indentation
      >
        {/* Use File icon if it's not a folder, otherwise Folder */}
        <Folder className="h-4 w-4 mr-1 shrink-0" style={{ color: node.color as string | undefined }}/>
        <span className="truncate">{node.name}</span>
      </SidebarMenuButton>
    );
  }

  // If it has children - Render as a collapsible item
  return (
    <SidebarMenuItem className="p-0"> {/* Remove padding from item */}
      <Collapsible
        className="group/collapsible w-full [&[data-state=open]>button>svg:first-child]:rotate-90"
        // defaultOpen={node.name === "components" || node.name === "ui"} // Example default open
      >
        <CollapsibleTrigger asChild>
          {/* Button covers the full width */}
          <SidebarMenuButton
            isActive={isSelected}
            className="w-full justify-start data-[active=true]:bg-accent"
            onClick={() => onSelectFolder?.(node.id)}
            style={{ paddingLeft: `${1 + level * 1.5}rem` }} // Indentation
          >
            <ChevronRight className="h-4 w-4 transition-transform shrink-0" />
            <Folder className="h-4 w-4 ml-1 shrink-0" style={{ color: node.color as string | undefined }}/>
            <span className="ml-1 truncate">{node.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {/* Submenu container */}
          <SidebarMenuSub className="py-1">
            {node.children.map((childNode: FolderNode) => (
              <TreeNode
                key={childNode.id}
                node={childNode}
                onSelectFolder={onSelectFolder}
                selectedFolderId={selectedFolderId}
                level={level + 1}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};


export const SidebarFolderTree: React.FC<SidebarFolderTreeProps> = ({
  onSelectFolder,
  selectedFolderId,
}) => {
  const { data: folderTree, isLoading, error } = useQuery(trpc.folders.getTree.queryOptions());

  if (isLoading) {
    return <div className="p-4 text-sm">Loading folders...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-destructive">Error: {error.message}</div>;
  }

  if (!folderTree || folderTree.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground">No folders found.</div>;
  }

  return (
    <SidebarMenu>
      {folderTree.map((rootNode) => (
        <TreeNode
          key={rootNode.id}
          node={rootNode}
          onSelectFolder={onSelectFolder}
          selectedFolderId={selectedFolderId}
        />
      ))}
    </SidebarMenu>
  );
};
