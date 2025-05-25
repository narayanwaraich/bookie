// (Generic empty state component)
import React from "react";
import { Button } from "./button"; // Assuming Button is in ui
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4 text-center p-8 border-2 border-dashed border-muted rounded-lg bg-card",
        className,
      )}
    >
      {Icon && <Icon className="h-12 w-12 text-muted-foreground" />}
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} size="sm" className="mt-2">
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
