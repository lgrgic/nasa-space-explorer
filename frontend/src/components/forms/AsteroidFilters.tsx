import React from "react";

export interface AsteroidFilters {
  hazard: "all" | "hazardous" | "safe";
  distance: "all" | "close" | "medium" | "far";
  size: "all" | "small" | "medium" | "large";
  velocity: "all" | "slow" | "medium" | "fast";
}

interface AsteroidFiltersProps {
  filters: AsteroidFilters;
  onFiltersChange: (filters: AsteroidFilters) => void;
  disabled?: boolean;
}

export const AsteroidFilters: React.FC<AsteroidFiltersProps> = ({
  filters,
  onFiltersChange,
  disabled = false,
}) => {
  const handleFilterChange = (
    filterKey: keyof AsteroidFilters,
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [filterKey]: value as any,
    });
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto border border-gray-700 rounded-lg p-6 mb-8 bg-black/20 backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-3 font-mono">
          ADDITIONAL FILTERS
        </h3>
        <p className="text-sm text-gray-400 font-mono">
          Filter asteroids by specific characteristics. All filters are
          optional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hazard Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
            HAZARD LEVEL
          </label>
          <select
            value={filters.hazard}
            onChange={(e) => handleFilterChange("hazard", e.target.value)}
            disabled={disabled}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Asteroids</option>
            <option value="hazardous">Hazardous Only</option>
            <option value="safe">Safe Only</option>
          </select>
        </div>

        {/* Distance Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
            DISTANCE
          </label>
          <select
            value={filters.distance}
            onChange={(e) => handleFilterChange("distance", e.target.value)}
            disabled={disabled}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Any Distance</option>
            <option value="close">Very Close (&lt; 1 Lunar)</option>
            <option value="medium">Medium (1-5 Lunar)</option>
            <option value="far">Far (&gt; 5 Lunar)</option>
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
            SIZE
          </label>
          <select
            value={filters.size}
            onChange={(e) => handleFilterChange("size", e.target.value)}
            disabled={disabled}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Any Size</option>
            <option value="small">Small (&lt; 100m)</option>
            <option value="medium">Medium (100m-1km)</option>
            <option value="large">Large (&gt; 1km)</option>
          </select>
        </div>

        {/* Velocity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
            VELOCITY
          </label>
          <select
            value={filters.velocity}
            onChange={(e) => handleFilterChange("velocity", e.target.value)}
            disabled={disabled}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Any Speed</option>
            <option value="slow">Slow (&lt; 10 km/s)</option>
            <option value="medium">Medium (10-20 km/s)</option>
            <option value="fast">Fast (&gt; 20 km/s)</option>
          </select>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 font-mono">Quick actions</p>
          <button
            onClick={() =>
              onFiltersChange({
                hazard: "all",
                distance: "all",
                size: "all",
                velocity: "all",
              })
            }
            disabled={disabled}
            className="px-2 py-1 bg-red-800/50 text-red-200 hover:bg-red-700/50 text-xs rounded font-mono transition-colors border border-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset filters
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              onFiltersChange({
                ...filters,
                hazard: "hazardous",
                distance: "all",
                size: "all",
                velocity: "all",
              })
            }
            disabled={disabled}
            className="px-3 py-1 bg-transparent hover:bg-gray-700/30 text-gray-200 text-sm rounded font-mono transition-colors border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hazardous Only
          </button>
          <button
            onClick={() =>
              onFiltersChange({
                ...filters,
                hazard: "all",
                distance: "close",
                size: "all",
                velocity: "all",
              })
            }
            disabled={disabled}
            className="px-3 py-1 bg-transparent hover:bg-gray-700/30 text-gray-200 text-sm rounded font-mono transition-colors border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close Approaches
          </button>
          <button
            onClick={() =>
              onFiltersChange({
                ...filters,
                hazard: "all",
                distance: "all",
                size: "large",
                velocity: "all",
              })
            }
            disabled={disabled}
            className="px-3 py-1 bg-transparent hover:bg-gray-700/30 text-gray-200 text-sm rounded font-mono transition-colors border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Large Asteroids
          </button>
          <button
            onClick={() =>
              onFiltersChange({
                ...filters,
                hazard: "all",
                distance: "all",
                size: "all",
                velocity: "fast",
              })
            }
            disabled={disabled}
            className="px-3 py-1 bg-transparent hover:bg-gray-700/30 text-gray-200 text-sm rounded font-mono transition-colors border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fast Asteroids
          </button>
        </div>
      </div>
    </div>
  );
};
