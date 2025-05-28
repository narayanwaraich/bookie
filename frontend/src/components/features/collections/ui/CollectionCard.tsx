// src/components/features/collections/ui/CollectionCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import type { inferOutput } from "@trpc/tanstack-react-query";
import { FolderKanban, Users, Lock } from "lucide-react"; // For icons
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/api";

// Assuming the list item from backend looks like this
type CollectionItem = inferOutput<typeof trpc.collections.list>["data"][number];

interface CollectionCardProps {
  collection: CollectionItem;
  className?: string;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const bookmarkCount = collection._count?.bookmarks ?? 0;

  return (
    <Link
      to="/collections/$collectionId"
      params={{ collectionId: collection.id }}
      className={cn("block group", className)}
    >
      <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
        {collection.thumbnail && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={collection.thumbnail}
              alt={collection.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader className={collection.thumbnail ? "pt-4" : ""}>
          <div className="flex items-center justify-between mb-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {collection.name}
            </CardTitle>
            {collection.isPublic ? (
              <Users className="h-4 w-4 text-muted-foreground" title="Public" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" title="Private" />
            )}
          </div>
          {collection.description && (
            <CardDescription className="text-xs line-clamp-2 h-8">
              {collection.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground mt-auto pt-0">
          <div className="flex items-center">
            <FolderKanban className="h-3 w-3 mr-1.5" />
            <span>
              {bookmarkCount} bookmark{bookmarkCount !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
