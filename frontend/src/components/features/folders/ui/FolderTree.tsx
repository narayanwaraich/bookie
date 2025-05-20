import React from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { Folder, ChevronRight } from "lucide-react"; // Assuming File icon is needed for non-folders if applicable
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar"; // Assuming these are exported from the sidebar index
// import { cn } from "@/lib/utils";
import type { inferOutput } from "@trpc/tanstack-react-query";

// Reuse the FolderNode type definition (or import if shared)
type FolderTreeData = inferOutput<typeof trpc.folders.getTree>;
type FolderTreeNode = FolderTreeData[number];

interface FolderNodeProps {
  node: FolderTreeNode;
  level?: number;
  selectedFolderId?: string;
  onFolderSelect?: (folderId: string) => void;
}

// Recursive component to render each node
const TreeNode: React.FC<FolderNodeProps> = ({
  node,
  onFolderSelect,
  selectedFolderId,
  level = 0,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedFolderId === node.id;

  // If it's a leaf node (no children) - Render as a simple button
  // Adapt this if you have actual files vs folders distinction
  if (!hasChildren) {
    return (
      <SidebarMenuButton
        isActive={isSelected}
        className="data-[active=true]:bg-accent" // Example active style
        onClick={() => onFolderSelect?.(node.id)}
        style={{ paddingLeft: `${1 + level * 1.5}rem` }} // Indentation
      >
        {/* Use File icon if it's not a folder, otherwise Folder */}
        <Folder
          className="h-4 w-4 mr-1 shrink-0"
          style={{ color: node.color as string | undefined }}
        />
        <span className="truncate">{node.name}</span>
      </SidebarMenuButton>
    );
  }

  // If it has children - Render as a collapsible item
  return (
    <SidebarMenuItem className="p-0">
      {" "}
      {/* Remove padding from item */}
      <Collapsible
        className="group/collapsible w-full [&[data-state=open]>button>svg:first-child]:rotate-90"
        // defaultOpen={node.name === "components" || node.name === "ui"} // Example default open
      >
        <CollapsibleTrigger asChild>
          {/* Button covers the full width */}
          <SidebarMenuButton
            isActive={isSelected}
            className="w-full justify-start data-[active=true]:bg-accent"
            onClick={() => onFolderSelect?.(node.id)}
            style={{ paddingLeft: `${1 + level * 1.5}rem` }} // Indentation
          >
            <ChevronRight className="h-4 w-4 transition-transform shrink-0" />
            <Folder
              className="h-4 w-4 ml-1 shrink-0"
              style={{ color: node.color as string | undefined }}
            />
            <span className="ml-1 truncate">{node.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {/* Submenu container */}
          <SidebarMenuSub className="py-1">
            {node.children.map((childNode: FolderTreeNode) => (
              <TreeNode
                key={childNode.id}
                node={childNode}
                onFolderSelect={onFolderSelect}
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

interface FolderTreeProps {
  onFolderSelect?: (folderId: string) => void;
  selectedFolderId?: string;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  onFolderSelect,
  selectedFolderId,
}) => {
  const {
    data: folderTree,
    isLoading,
    error,
  } = useQuery(trpc.folders.getTree.queryOptions());

  if (isLoading) {
    return <div className="p-4 text-sm">Loading folders...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-destructive">Error: {error.message}</div>
    );
  }

  if (!folderTree || folderTree.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No folders created yet.
      </div>
    );
  }

  return (
    <SidebarMenu>
      {folderTree.map((rootNode) => (
        <TreeNode
          key={rootNode.id}
          node={rootNode}
          onFolderSelect={onFolderSelect}
          selectedFolderId={selectedFolderId}
        />
      ))}
    </SidebarMenu>
  );
};
