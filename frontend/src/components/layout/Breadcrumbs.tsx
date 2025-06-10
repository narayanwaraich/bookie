import React from "react";
import { Link, useMatches, useMatchRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FolderPathBreadcrumb } from "../features/folders/ui/FolderPathBreadcrumb";

export default function Breadcrumbs() {
  const matchRoute = useMatchRoute();
  const folderParams = matchRoute({ to: "/folders/$folderId" });
  if (folderParams)
    return <FolderPathBreadcrumb currentFolderId={folderParams.folderId} />;

  const matches = useMatches();
  // Create breadcrumbs from route matches
  // This is a simplified example; you might need more sophisticated logic for titles/paths
  const breadcrumbItems = matches
    .filter((match: any) => match.pathname && match.pathname !== "/") // Filter out root or non-path matches
    .map((match: any, index, arr) => {
      const pathSegments = match.pathname.split("/").filter(Boolean);
      const lastSegment = pathSegments.pop() || "home"; // Default to 'home' if empty
      const title =
        match.staticData?.title ||
        lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

      return {
        title,
        href: match.pathname,
        isCurrent: index === arr.length - 1,
      };
    });

  // Simple fallback if no specific breadcrumbs generated
  if (breadcrumbItems.length === 0) {
    breadcrumbItems.push({
      title: "Bookmarks",
      href: "/bookmarks",
      isCurrent: true,
    });
  }

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href + index}>
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
