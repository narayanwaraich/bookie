// components/sort-dropdown.tsx

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronDown,
  ArrowUp,
  ArrowDownUp,
  ArrowDown,
  Calendar,
  FileText,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { SortOption, SortOrder } from "../types";

// Define your options
const sortOptions: {
  label: string;
  value: SortOption;
  icon: React.ReactNode;
}[] = [
  {
    label: "Date Added",
    value: "createdAt",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    label: "Date Updated",
    value: "updatedAt",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    label: "Last Visited",
    value: "lastVisited",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    label: "Visit Count",
    value: "visitCount",
    icon: <ArrowUp className="w-4 h-4" />,
  },
  { label: "Title", value: "title", icon: <FileText className="w-4 h-4" /> },
];

const sortOrders: { label: string; value: SortOrder; icon: React.ReactNode }[] =
  [
    { label: "Ascending", value: "asc", icon: <ArrowUp className="w-4 h-4" /> },
    {
      label: "Descending",
      value: "desc",
      icon: <ArrowDown className="w-4 h-4" />,
    },
  ];

export function SortDropdown({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  setCurrentPage,
}: {
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  sortOrder: SortOrder;
  setSortOrder: (val: SortOrder) => void;
  setCurrentPage: (page: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowDownUp className="w-4 h-4" />
          Sort
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 space-y-2">
        <div className="text-xs font-semibold text-muted-foreground px-2 pb-1">
          Sort by
        </div>
        <div className="space-y-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSortBy(option.value);
                setCurrentPage(1);
                setOpen(false);
              }}
              className={cn(
                "flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition",
                sortBy === option.value && "bg-muted",
              )}
            >
              <span className="mr-2">{option.icon}</span>
              {option.label}
              {sortBy === option.value && <Check className="ml-auto w-4 h-4" />}
            </button>
          ))}
        </div>

        <div className="border-t pt-2">
          <div className="text-xs font-semibold text-muted-foreground px-2 pb-1">
            Order
          </div>
          <div className="space-y-1">
            {sortOrders.map((order) => (
              <button
                key={order.value}
                onClick={() => {
                  setSortOrder(order.value);
                  setCurrentPage(1);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition",
                  sortOrder === order.value && "bg-muted",
                )}
              >
                <span className="mr-2">{order.icon}</span>
                {order.label}
                {sortOrder === order.value && (
                  <Check className="ml-auto w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
