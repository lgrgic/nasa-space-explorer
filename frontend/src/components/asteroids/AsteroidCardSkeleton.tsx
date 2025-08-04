import { Card } from "../layout/Card";

interface AsteroidCardSkeletonProps {
  className?: string;
  compact?: boolean;
}

export const AsteroidCardSkeleton = ({
  className = "",
  compact = false,
}: AsteroidCardSkeletonProps) => {
  return (
    <Card title="" className={className} compact={compact}>
      <div className="space-y-3">
        {/* Magnitude skeleton */}
        <div className="flex justify-between items-center py-1 lg:py-2 border-b border-gray-700">
          <div className="h-3 bg-gray-700 rounded w-20 animate-pulse"></div>
          <div className="h-3 bg-gray-700 rounded w-8 animate-pulse"></div>
        </div>

        {/* Diameter skeleton */}
        <div className="flex justify-between items-center py-1 lg:py-2 border-b border-gray-700">
          <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
          <div className="h-3 bg-gray-700 rounded w-24 animate-pulse"></div>
        </div>

        {/* Closest approach skeleton */}
        <div className="flex justify-between items-center py-1 lg:py-2 border-b border-gray-700">
          <div className="h-3 bg-gray-700 rounded w-28 animate-pulse"></div>
          <div className="h-3 bg-gray-700 rounded w-20 animate-pulse"></div>
        </div>

        {/* Hazardous warning skeleton */}
        {Math.random() > 0.7 && (
          <div
            className={`${
              compact ? "mt-2 p-2" : "mt-3 lg:mt-4 p-2 lg:p-3"
            } border border-gray-600/30 rounded-lg bg-gray-600/10`}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-600 rounded-full flex-shrink-0 animate-pulse"></div>
              <div className="h-3 bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
