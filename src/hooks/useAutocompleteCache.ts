
import { useRef, useState } from "react";

// Generic caching for dropdown/autosuggest (localStorage backed)
export function useAutocompleteCache(key: string, defaultList: string[] = []) {
  const cacheKey = "autocomplete:" + key;
  const [suggestions, setSuggestions] = useState<string[]>(() => {
    let cached = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
    return cached ? JSON.parse(cached) : defaultList;
  });
  const save = (val: string) => {
    if (!val) return;
    const updated = Array.from(new Set([val, ...suggestions])).slice(0, 20);
    setSuggestions(updated);
    localStorage.setItem(cacheKey, JSON.stringify(updated));
  };
  const suggest = (query: string) =>
    query ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase())) : suggestions;
  return { save, suggest, suggestions };
}
