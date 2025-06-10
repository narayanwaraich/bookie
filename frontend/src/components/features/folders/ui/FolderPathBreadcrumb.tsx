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
import { trpc } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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
  const {
    data: folderPath,
    isLoading,
    isError,
  } = useQuery(
    trpc.folders.getFolderPath.queryOptions({ folderId: currentFolderId }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 h-5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" /> {/* Separator placeholder */}
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" /> {/* Separator placeholder */}
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  if (isError || !folderPath || folderPath.length === 0) {
    return null;
  }

  // Determine if the full path is just the current folder (i.e., it's a root folder)
  const isRootFolderOrSingle =
    folderPath.length === 1 && folderPath[0].id === currentFolderId;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/bookmarks">Bookmarks</Link>
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
