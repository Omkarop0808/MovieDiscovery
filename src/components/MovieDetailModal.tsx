"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Clock, Calendar, Film } from "lucide-react";
import { Movie, getMovieDetails } from "@/lib/tmdb";
import { FavoritesButton } from "./FavoritesButton";

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailModal({ movie, isOpen, onClose }: MovieDetailModalProps) {
  const [details, setDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      setDetails(movie); // Initial basic details
      setLoading(true);
      getMovieDetails(movie.id.toString())
        .then((fullDetails) => setDetails(fullDetails))
        .catch((e) => console.error("Failed to load full details", e))
        .finally(() => setLoading(false));
    } else {
      setDetails(null);
    }
  }, [isOpen, movie]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const displayMovie = details || movie;
  const posterUrl = displayMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${displayMovie.poster_path}`
    : "/placeholder.png";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl border border-border/50 pointer-events-auto flex flex-col md:flex-row"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full md:w-2/5 aspect-[2/3] md:aspect-auto md:min-h-full bg-muted flex-shrink-0">
                {displayMovie.poster_path ? (
                  <Image
                    src={posterUrl}
                    alt={displayMovie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    No Poster Available
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:bg-gradient-to-r md:from-transparent md:to-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-card-foreground">
                    {displayMovie.title}
                  </h2>
                  <FavoritesButton movie={displayMovie} className="flex-shrink-0 relative z-10" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-md text-foreground">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="font-medium">{displayMovie.vote_average.toFixed(1)}/10</span>
                  </div>
                  {displayMovie.release_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{displayMovie.release_date.split("-")[0]}</span>
                    </div>
                  )}
                  {displayMovie.runtime ? (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(displayMovie.runtime / 60)}h {displayMovie.runtime % 60}m</span>
                    </div>
                  ) : loading ? (
                    <div className="w-16 h-5 bg-muted animate-pulse rounded" />
                  ) : null}
                </div>

                {displayMovie.genres && displayMovie.genres.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {displayMovie.genres.map((g) => (
                      <span key={g.id} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        {g.name}
                      </span>
                    ))}
                  </div>
                ) : loading ? (
                  <div className="flex gap-2 mb-6">
                    <div className="w-20 h-6 bg-muted animate-pulse rounded-full" />
                    <div className="w-16 h-6 bg-muted animate-pulse rounded-full" />
                  </div>
                ) : null}

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {displayMovie.overview || "No overview available."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
