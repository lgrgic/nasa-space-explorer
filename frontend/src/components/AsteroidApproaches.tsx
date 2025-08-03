import type { CloseApproachData } from "../types/asteroids";

interface AsteroidApproachesProps {
  closeApproachData: CloseApproachData[];
}

export const AsteroidApproaches = ({
  closeApproachData,
}: AsteroidApproachesProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDistance = (distance: string) => {
    const num = parseFloat(distance);
    if (num >= 1) {
      return `${num.toFixed(2)} AU`;
    }
    return `${(num * 149597870.7).toLocaleString()} km`;
  };

  const formatVelocity = (velocity: string) => {
    const num = parseFloat(velocity);
    return `${num.toFixed(1)} km/s`;
  };

  const sortedApproaches = [...closeApproachData].sort(
    (a, b) =>
      new Date(a.close_approach_date).getTime() -
      new Date(b.close_approach_date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <span className="text-xs text-gray-400 font-mono">
          Showing {closeApproachData.length} close approaches
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-2">
        {sortedApproaches.map((approach, index) => {
          const isFuture = new Date(approach.close_approach_date) > new Date();
          const isEarth = approach.orbiting_body === "Earth";

          return (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                isFuture
                  ? "border-blue-500/30 bg-blue-500/10"
                  : "border-gray-600/30 bg-gray-600/10"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-200 font-mono">
                    {formatDate(approach.close_approach_date)}
                  </span>
                  {isFuture && (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-mono">
                      FUTURE
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-mono ${
                    isEarth
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {approach.orbiting_body}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-gray-400">Distance: </span>
                  <span className="text-gray-200">
                    {formatDistance(approach.miss_distance.astronomical)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Velocity: </span>
                  <span className="text-gray-200">
                    {formatVelocity(
                      approach.relative_velocity.kilometers_per_second
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
