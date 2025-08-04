import type { Asteroid } from "../types/asteroids";
import { Card } from "../layout/Card";

interface AsteroidCardProps {
  asteroid: Asteroid;
  className?: string;
  compact?: boolean;
  onClick?: () => void;
}

export const AsteroidCard = ({
  asteroid,
  className = "",
  compact = false,
  onClick,
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
      className={`${className} ${
        onClick ? "cursor-pointer hover:bg-gray-800/50 transition-colors" : ""
      }`}
      compact={compact}
      onClick={onClick}
    >
      <div className="flex justify-between items-center py-1 lg:py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-xs lg:text-sm font-mono">
          MAGNITUDE
        </span>
        <span className="text-gray-200 font-semibold text-xs lg:text-sm font-mono">
          {asteroid.absolute_magnitude_h}
        </span>
      </div>

      <div className="flex justify-between items-center py-1 lg:py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-xs lg:text-sm font-mono">
          DIAMETER
        </span>
        <span className="text-gray-200 font-semibold text-xs lg:text-sm text-right font-mono">
          {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
            2
          )}{" "}
          -{" "}
          {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
            2
          )}{" "}
          KM
        </span>
      </div>

      {asteroid.close_approach_data[0] && (
        <div className="flex justify-between items-center py-1 lg:py-2 border-b border-gray-700">
          <span className="text-gray-400 font-medium text-xs lg:text-sm font-mono">
            CLOSEST APPROACH
          </span>
          <span className="text-gray-200 font-semibold text-xs lg:text-sm text-right font-mono">
            {asteroid.close_approach_data[0].close_approach_date}
          </span>
        </div>
      )}

      {asteroid.is_potentially_hazardous_asteroid && (
        <div
          className={`${
            compact ? "mt-2 p-2" : "mt-3 lg:mt-4 p-2 lg:p-3"
          } border border-red-500/30 rounded-lg bg-red-500/10`}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full flex-shrink-0"></div>
            <span className="text-red-400 font-semibold text-xs lg:text-sm font-mono">
              POTENTIALLY HAZARDOUS
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
