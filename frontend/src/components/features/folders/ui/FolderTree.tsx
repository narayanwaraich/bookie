import React from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { ChevronRight } from "lucide-react";
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import type { inferOutput } from "@trpc/tanstack-react-query";

type FolderTreeData = inferOutput<typeof trpc.folders.getTree>;
type FolderTreeNode = FolderTreeData[number];

interface FolderNodeProps {
  node: FolderTreeNode;
  level?: number;
  selectedFolderId?: string;
  onFolderSelect?: (folderId: string) => void;
}

const TreeNode: React.FC<FolderNodeProps> = ({
  node,
  onFolderSelect,
  selectedFolderId,
  level = 0,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedFolderId === node.id;

  if (!hasChildren) {
    return (
      <SidebarMenuButton
        isActive={isSelected}
        className="data-[active=true]:bg-accent" // Example active style
        onClick={() => onFolderSelect?.(node.id)}
      >
        <span className="truncate">{node.name}</span>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={isSelected}
            className="data-[active=true]:bg-accent"
            onClick={() => onFolderSelect?.(node.id)}
          >
            <ChevronRight className="transition-transform" />
            <span className="truncate">{node.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
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
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <SidebarGroupContent>
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
