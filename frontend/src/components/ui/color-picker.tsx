import React from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { Check, Palette } from "lucide-react";

const colors = [
  "#64748b", // slate-500
  "#6b7280", // gray-500
  "#71717a", // zinc-500
  "#737373", // neutral-500
  "#78716c", // stone-500
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#22c55e", // green-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#d946ef", // fuchsia-500
  "#ec4899", // pink-500
  "#f43f5e", // rose-500
];

interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = "#64748b",
  onChange,
  className,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: value }}
            />
            <span className="truncate">{value}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <Button
              key={color}
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => onChange?.(color)}
            >
              <div
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: color }}
              >
                {value === color && <Check className="h-4 w-4 text-white" />}
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
