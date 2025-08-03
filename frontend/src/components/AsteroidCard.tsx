import type { Asteroid } from "../types/asteroids";
import { Card } from "./Card";

interface AsteroidCardProps {
  asteroid: Asteroid;
  className?: string;
  compact?: boolean;
}

export const AsteroidCard = ({
  asteroid,
  className = "",
  compact = false,
}: AsteroidCardProps) => {
  const status = {
    type: (asteroid.is_potentially_hazardous_asteroid ? "error" : "success") as
      | "error"
      | "success",
    label: asteroid.is_potentially_hazardous_asteroid
      ? "Potentially Hazardous"
      : "Safe",
  };

  return (
    <Card
      title={asteroid.name}
      status={status}
      className={className}
      compact={compact}
    >
      <div className="flex justify-between items-center py-1 lg:py-2 border-b border-gray-100">
        <span className="text-gray-600 font-medium text-xs lg:text-sm">
          Magnitude
        </span>
        <span className="text-gray-900 font-semibold text-xs lg:text-sm">
          {asteroid.absolute_magnitude_h}
        </span>
      </div>

      <div className="flex justify-between items-center py-1 lg:py-2 border-b border-gray-100">
        <span className="text-gray-600 font-medium text-xs lg:text-sm">
          Diameter
        </span>
        <span className="text-gray-900 font-semibold text-xs lg:text-sm text-right">
          {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
            2
          )}{" "}
          -{" "}
          {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
            2
          )}{" "}
          km
        </span>
      </div>

      {asteroid.close_approach_data[0] && (
        <div className="flex justify-between items-center py-1 lg:py-2 border-b border-gray-100">
          <span className="text-gray-600 font-medium text-xs lg:text-sm">
            Closest Approach
          </span>
          <span className="text-gray-900 font-semibold text-xs lg:text-sm text-right">
            {asteroid.close_approach_data[0].close_approach_date}
          </span>
        </div>
      )}

      {asteroid.is_potentially_hazardous_asteroid && (
        <div
          className={`${
            compact ? "mt-2 p-2" : "mt-3 lg:mt-4 p-2 lg:p-3"
          } bg-red-50 border border-red-200 rounded-lg`}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full flex-shrink-0"></div>
            <span className="text-red-700 font-semibold text-xs lg:text-sm">
              Potentially Hazardous
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
