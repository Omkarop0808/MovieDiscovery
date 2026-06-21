"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import { FavoritesButton } from "./FavoritesButton";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  onClick: (movie: Movie) => void;
}

export function MovieCard({ movie, index = 0, onClick }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const, delay: index * 0.05 }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="group relative flex flex-col h-full rounded-xl overflow-hidden cursor-pointer"
      onClick={() => onClick(movie)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-lg shadow-black/20 group-hover:shadow-primary/20 transition-all duration-300">
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          unoptimized={true}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {movie.vote_average > 0 && (
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-sm font-medium text-white shadow-sm border border-white/10">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Favorites Button (Absolute Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <FavoritesButton movie={movie} />
        </div>
      </div>

      {/* Typography / Metadata underneath */}
      <div className="flex flex-col flex-1 mt-4 px-1">
        <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
          {movie.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 font-light">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"}
        </p>
      </div>
    </motion.div>
  );
}
