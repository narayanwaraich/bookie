import Fuse from "fuse.js";

interface SearchableItem {
  id: string;
  name: string;
  children?: SearchableItem[];
}

export const createFuzzySearcher = <T extends SearchableItem>(items: T[]) => {
  const options = {
    keys: ["name"],
    threshold: 0.3, // Lower threshold means more strict matching
    distance: 100, // Maximum edit distance
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
  };

  const fuse = new Fuse(items, options);

  return {
    search: (query: string): T[] => {
      if (!query.trim()) return items;

      const results = fuse.search(query);
      return results.map((result) => result.item);
    },
  };
};
