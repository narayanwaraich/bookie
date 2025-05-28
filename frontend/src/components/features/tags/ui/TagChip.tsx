import React from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react"; // For removable tags

interface TagChipProps {
  id: string;
  name: string;
  color?: string | null;
  count?: number; // Optional: show bookmark count
  onClick?: (tagId: string) => void;
  onRemove?: (tagId: string) => void; // For removable tags in an editor
  className?: string;
  linkToTagPage?: boolean;
}

export function TagChip({
  id,
  name,
  color,
  count,
  onClick,
  onRemove,
  className,
  linkToTagPage = false,
}: TagChipProps) {
  const chipContent = (
    <>
      {name}
      {typeof count === "number" && (
        <span className="ml-1.5 opacity-75">({count})</span>
      )}
      {onRemove && (
        <button
          type="button"
          className="ml-1.5 rounded-full hover:bg-background/30 p-0.5"
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent click if any
            e.preventDefault(); // Prevent navigation if inside a Link
            onRemove(id);
          }}
          aria-label={`Remove tag ${name}`}
        >
          <XIcon className="h-3 w-3" />
        </button>
      )}
    </>
  );

  const badgeStyle = color ? { backgroundColor: color, color: "white" } : {}; // Simple contrast, improve if needed

  if (linkToTagPage && !onRemove) {
    // Link only if not in "edit/remove" mode for this chip
    return (
      <Link to="/tags/$tagId" params={{ tagId: id }}>
        <Badge
          variant="secondary"
          className={cn("cursor-pointer hover:opacity-80", className)}
          style={badgeStyle}
        >
          {chipContent}
        </Badge>
      </Link>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn(onClick && "cursor-pointer hover:opacity-80", className)}
      style={badgeStyle}
      onClick={() => onClick?.(id)}
    >
      {chipContent}
    </Badge>
  );
}
