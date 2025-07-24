import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LayoutList, LayoutGrid, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "../types";

const viewModes: {
  label: string;
  value: ViewMode;
  icon: React.ReactNode;
}[] = [
  {
    label: "Grid View",
    value: "grid",
    icon: <LayoutGrid className="w-4 h-4" />,
  },
  {
    label: "List View",
    value: "list",
    icon: <LayoutList className="w-4 h-4" />,
  },
];

export function ViewModeDropdown({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (val: ViewMode) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" title="Change View">
          {viewMode === "grid" ? (
            <LayoutGrid className="w-4 h-4" />
          ) : (
            <LayoutList className="w-4 h-4" />
          )}
          Layout
          <ChevronDown className="ml-1 w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2">
        {viewModes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => setViewMode(mode.value)}
            className={cn(
              "flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition",
              viewMode === mode.value && "bg-muted",
            )}
          >
            <span className="mr-2">{mode.icon}</span>
            {mode.label}
            {viewMode === mode.value && <Check className="ml-auto w-4 h-4" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
