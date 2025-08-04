import React from "react";
import type { YearlyData } from "./types";

interface SummaryStatsProps {
  data: YearlyData[];
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ data }) => {
  const formatDistance = (distance: number) => {
    return `${distance.toFixed(3)} AU`;
  };

  const totalApproaches = data.reduce((sum, year) => sum + year.approaches, 0);
  const closestApproach = Math.min(...data.map((y) => y.minDistance));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/5 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-blue-400">{data.length}</div>
        <div className="text-sm text-gray-300">Years with Data</div>
      </div>
      <div className="bg-white/5 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-green-400">
          {totalApproaches}
        </div>
        <div className="text-sm text-gray-300">Total Approaches</div>
      </div>
      <div className="bg-white/5 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-yellow-400">
          {formatDistance(closestApproach)}
        </div>
        <div className="text-sm text-gray-300">Closest Approach</div>
      </div>
    </div>
  );
};

export default SummaryStats;
