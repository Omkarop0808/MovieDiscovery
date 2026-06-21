"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  query: string;
}

export function Pagination({ currentPage, totalPages, query }: PaginationProps) {
  const getPageUrl = (page: number) => {
    if (query) {
      return `/?q=${encodeURIComponent(query)}&page=${page}`;
    }
    return `/?page=${page}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-6 mt-12">
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-lg text-sm font-medium text-muted-foreground cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
      )}

      <span className="text-sm font-medium text-muted-foreground">
        Page <span className="text-foreground">{currentPage}</span> of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted hover:text-foreground transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-lg text-sm font-medium text-muted-foreground cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
