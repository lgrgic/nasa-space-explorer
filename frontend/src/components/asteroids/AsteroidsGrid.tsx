import type { Asteroid } from "../../types/asteroids";
import { AsteroidCard } from "./AsteroidCard";
import { AsteroidCardSkeleton } from "./AsteroidCardSkeleton";

interface AsteroidsGridProps {
  asteroids: Asteroid[];
  loading: boolean;
  onAsteroidClick: (asteroid: Asteroid) => void;
}

export const AsteroidsGrid = ({
  asteroids,
  loading,
  onAsteroidClick,
}: AsteroidsGridProps) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
        {loading
          ? // Show skeletons
            Array.from({ length: 9 }).map((_, index) => (
              <AsteroidCardSkeleton key={`skeleton-${index}`} />
            ))
          : asteroids.map((asteroid) => (
              <AsteroidCard
                key={asteroid.id}
                asteroid={asteroid}
                onClick={() => onAsteroidClick(asteroid)}
              />
            ))}
      </div>
    </div>
  );
};
