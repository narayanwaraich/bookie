import React from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { Loading } from "@/components/common/Loading";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { Folder as FolderIcon, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// Explicitly define the Folder Tree Node type based on backend service structure
interface FolderTreeNode {
  id: string;
  name: string;
  parentId: string | null;
  children: FolderTreeNode[];
  bookmarkCount: number;
  // Add other fields like icon, color if they are returned by getTree
}

interface FolderTreeProps {
  selectedFolderId?: string;
  onFolderSelect?: (folderId: string) => void;
}

interface FolderNodeProps {
  node: FolderTreeNode;
  level: number;
  selectedFolderId?: string;
  onFolderSelect?: (folderId: string) => void;
}

const FolderNode: React.FC<FolderNodeProps> = ({
  node,
  level,
  selectedFolderId,
  onFolderSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(true); // Default to open

  // Use the explicitly defined type
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    if (onFolderSelect) {
      onFolderSelect(node.id);
    }
  };

  return (
    <div style={{ paddingLeft: `${level * 1.5}rem` }}>
      <div
        className={cn(
          "flex items-center space-x-2 p-1 rounded-md hover:bg-accent cursor-pointer",
          selectedFolderId === node.id && "bg-accent font-semibold",
        )}
        onClick={handleSelect}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleToggle}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <span className="w-6"></span> // Placeholder for alignment
        )}
        <FolderIcon className="h-4 w-4 text-muted-foreground" />
        <Link
          to="/folders/$folderId"
          params={{ folderId: node.id }}
          className="flex-grow truncate"
          activeProps={{ className: "font-bold" }}
          onClick={(e) => e.stopPropagation()}
        >
          {node.name}
        </Link>
        {node.bookmarkCount !== undefined && (
          <span className="text-xs text-muted-foreground ml-auto pr-2">
            ({node.bookmarkCount})
          </span>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="mt-1">
          {/* Add explicit type for child */}
          {node.children.map((child: FolderTreeNode) => (
            <FolderNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              onFolderSelect={onFolderSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  selectedFolderId,
  onFolderSelect,
}) => {
  // The useQuery call pattern is correct for v5. The error might be misleading.
  // We assume the explicit FolderTreeNode type helps resolve potential inference issues.
  const {
    data: folderTree,
    isLoading,
    error,
  } = useQuery(trpc.folders.getTree.queryOptions());

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorDisplay message={error.message ?? "Failed to load folder tree"} />
    );
  }

  if (!folderTree || folderTree.length === 0) {
    return <p className="text-muted-foreground p-2">No folders created yet.</p>;
  }

  return (
    <div className="space-y-1">
      {folderTree.map((rootNode) => (
        <FolderNode
          key={rootNode.id}
          node={rootNode}
          level={0}
          selectedFolderId={selectedFolderId}
          onFolderSelect={onFolderSelect}
        />
      ))}
    </div>
  );
};
