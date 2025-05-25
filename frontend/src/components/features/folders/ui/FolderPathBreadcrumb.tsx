import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { trpc } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type FolderPathNode = {
  id: string;
  name: string;
};

interface FolderPathBreadcrumbProps {
  currentFolderId: string;
}

export function FolderPathBreadcrumb({
  currentFolderId,
}: FolderPathBreadcrumbProps) {
  // This query assumes your backend can provide the path/ancestors for a folder
  const { data: folderPath, isLoading } = useQuery(
    trpc.folders.getFolderPath.queryOptions({ folderId: currentFolderId }),
    // Ensure your trpc.folders.getFolderPath exists and returns an array of {id, name} for the path
  );

  if (isLoading) {
    return <div className="h-5 w-48 bg-muted rounded animate-pulse"></div>;
  }

  if (!folderPath || folderPath.length === 0) {
    // This might happen if currentFolderId is root or an error occurred.
    // Your PageHeader might already show the current folder's name.
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/folders">All Folders</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {folderPath.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <BreadcrumbItem>
              {index === folderPath.length - 1 ? (
                <BreadcrumbPage>{folder.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    to="/folders/$folderId"
                    params={{ folderId: folder.id }}
                  >
                    {folder.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < folderPath.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
