// Global search input in sidebar
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
// import { useDebounce } from '@/hooks/useDebounce'; // If you want to debounce

export function AppSidebarSearchForm({
  ...props
}: React.ComponentProps<"form">) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  // const debouncedQuery = useDebounce(query, 300);

  // useEffect(() => {
  //   if (debouncedQuery) {
  //     navigate({ to: '/search', search: { q: debouncedQuery } });
  //   }
  // }, [debouncedQuery, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({ to: "/search", search: { q: query.trim() } });
    }
  };

  return (
    <form onSubmit={handleSubmit} {...props}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="sidebar-search"
          placeholder="Search all content..."
          className="pl-8 h-9" // Adjusted height
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
}
