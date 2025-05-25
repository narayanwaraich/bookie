import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder as FolderIcon, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// Assuming a Folder type - adjust based on your actual data structure
interface Folder {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null; // You might use this to display custom icons
  color?: string | null; // You might use this for folder color accents
  bookmarkCount?: number; // Number of bookmarks directly in this folder
  // _count?: { bookmarks?: number; children?: number }; // Or using Prisma's _count
}

interface FolderCardProps {
  folder: Folder;
  className?: string;
}

export function FolderCard({ folder, className }: FolderCardProps) {
  return (
    <Link
      to="/folders/$folderId"
      params={{ folderId: folder.id }}
      className={cn("block", className)}
    >
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <FolderIcon
              className="h-5 w-5 text-muted-foreground"
              style={{ color: folder.color || undefined }}
            />
            <CardTitle className="text-md font-medium truncate">
              {folder.name}
            </CardTitle>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {folder.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {folder.description}
            </p>
          )}
          <div className="text-xs text-muted-foreground">
            {folder.bookmarkCount ?? 0} bookmarks
            {/* You could also display subfolder count here if available */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
