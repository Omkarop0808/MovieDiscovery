"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If external URL changes, update local state
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        router.push(`/?q=${encodeURIComponent(value.trim())}&page=1`);
      } else {
        router.push(`/`);
      }
    }, 300);
  };

  const clearSearch = () => {
    setQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.push(`/`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10">
      <div className="relative flex items-center group">
        <Search className="absolute left-5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search movies by title..."
          className="w-full h-14 pl-14 pr-14 bg-background border-2 border-muted hover:border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all shadow-sm text-lg"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-5 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
