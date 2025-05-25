import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // If using Avatar for favicon

interface BookmarkMetadataDisplayProps {
  title?: string | null;
  url: string;
  favicon?: string | null;
  previewImage?: string | null;
  siteName?: string | null; // Extracted from URL or metadata
}

export function BookmarkMetadataDisplay({
  title,
  url,
  favicon,
  previewImage,
  siteName,
}: BookmarkMetadataDisplayProps) {
  const displaySiteName = siteName || new URL(url).hostname;

  return (
    <div className="flex items-center space-x-3">
      {favicon ? (
        <Avatar className="h-6 w-6">
          <AvatarImage src={favicon} alt={`${displaySiteName} favicon`} />
          <AvatarFallback>
            {displaySiteName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-6 w-6 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
          {displaySiteName.charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline line-clamp-1"
          title={title || url}
        >
          {title || url}
        </a>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {displaySiteName}
        </p>
      </div>
      {/* Optional Preview Image Display (might be too large for some contexts)
      {previewImage && (
        <img src={previewImage} alt="Preview" className="ml-auto h-10 w-16 object-cover rounded-sm" />
      )}
      */}
    </div>
  );
}
