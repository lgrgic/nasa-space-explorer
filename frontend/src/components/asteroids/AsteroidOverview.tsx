import type { Asteroid } from "../../types/asteroids";

interface AsteroidOverviewProps {
  asteroid: Asteroid;
}

export const AsteroidOverview = ({ asteroid }: AsteroidOverviewProps) => {
  const futureApproaches = asteroid.close_approach_data
    .filter((approach) => new Date(approach.close_approach_date) > new Date())
    .sort(
      (a, b) =>
        new Date(a.close_approach_date).getTime() -
        new Date(b.close_approach_date).getTime()
    );

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          MAGNITUDE
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {asteroid.absolute_magnitude_h}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          DIAMETER (KM)
        </span>
        <span className="text-gray-200 font-semibold text-sm text-right font-mono">
          {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
            3
          )}{" "}
          -{" "}
          {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
            3
          )}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          DIAMETER (M)
        </span>
        <span className="text-gray-200 font-semibold text-sm text-right font-mono">
          {asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(1)}{" "}
          -{" "}
          {asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          TOTAL APPROACHES
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {asteroid.close_approach_data.length}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          NEXT APPROACH
        </span>
        <span className="text-gray-200 font-semibold text-sm text-right font-mono">
          {futureApproaches.length > 0
            ? new Date(
                futureApproaches[0].close_approach_date
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "No future approaches"}
        </span>
      </div>

      {asteroid.nasa_jpl_url && (
        <div className="pt-3">
          <a
            href={asteroid.nasa_jpl_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-mono transition-colors"
          >
            <span>VIEW ON JPL</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};
