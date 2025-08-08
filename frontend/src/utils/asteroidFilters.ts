import type { Asteroid } from "../types/asteroids";
import type { AsteroidFilters } from "../components/forms/AsteroidFilters";

export const filterAsteroids = (
  asteroids: Asteroid[],
  filters: AsteroidFilters
): Asteroid[] => {
  return asteroids.filter((asteroid) => {
    const closestApproach = asteroid.close_approach_data?.[0];
    if (!closestApproach) return false;

    // hazard filter
    if (
      filters.hazard === "hazardous" &&
      !asteroid.is_potentially_hazardous_asteroid
    ) {
      return false;
    }
    if (
      filters.hazard === "safe" &&
      asteroid.is_potentially_hazardous_asteroid
    ) {
      return false;
    }

    // distance filter
    const lunarDistance = parseFloat(closestApproach.miss_distance.lunar);
    if (filters.distance === "close" && lunarDistance >= 1) {
      return false;
    }
    if (
      filters.distance === "medium" &&
      (lunarDistance < 1 || lunarDistance > 5)
    ) {
      return false;
    }
    if (filters.distance === "far" && lunarDistance <= 5) {
      return false;
    }

    // size filter
    const maxDiameter =
      asteroid.estimated_diameter.kilometers.estimated_diameter_max;
    if (filters.size === "small" && maxDiameter >= 0.1) {
      return false;
    }
    if (filters.size === "medium" && (maxDiameter < 0.1 || maxDiameter > 1)) {
      return false;
    }
    if (filters.size === "large" && maxDiameter <= 1) {
      return false;
    }

    // velocity filter
    const velocity = parseFloat(
      closestApproach.relative_velocity.kilometers_per_second
    );
    if (filters.velocity === "slow" && velocity >= 10) {
      return false;
    }
    if (filters.velocity === "medium" && (velocity < 10 || velocity > 20)) {
      return false;
    }
    if (filters.velocity === "fast" && velocity <= 20) {
      return false;
    }

    return true;
  });
};
