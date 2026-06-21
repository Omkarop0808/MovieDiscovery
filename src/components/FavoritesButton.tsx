"use client";

import { Heart } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoritesButtonProps {
  movie: Movie;
  className?: string;
}

export function FavoritesButton({ movie, className }: FavoritesButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

  if (!isLoaded) return null;

  const favorited = isFavorite(movie.id);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(movie);
      }}
      className={cn(
        "flex items-center justify-center p-2 bg-background border-2 border-border hover:border-primary transition-all group",
        favorited ? "text-primary" : "text-foreground",
        className
      )}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("w-5 h-5 transition-transform group-hover:scale-110", favorited && "fill-primary")} />
    </button>
  );
}
