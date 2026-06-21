"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/lib/tmdb";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("movie_favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      let nextFavorites;
      if (exists) {
        nextFavorites = prev.filter((m) => m.id !== movie.id);
      } else {
        nextFavorites = [...prev, movie];
      }
      localStorage.setItem("movie_favorites", JSON.stringify(nextFavorites));
      return nextFavorites;
    });
  };

  const isFavorite = (id: number) => {
    return favorites.some((m) => m.id === id);
  };

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
