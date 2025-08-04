import React from "react";
import type { CloseApproachData } from "../types/asteroids";
import { useYearlyData } from "./charts/useYearlyData";
import ApproachesBarChart from "./charts/ApproachesBarChart";
import DistanceLineChart from "./charts/DistanceLineChart";
import SummaryStats from "./charts/SummaryStats";

interface CloseApproachTimelineProps {
  closeApproachData: CloseApproachData[];
  asteroidName: string;
}

const CloseApproachTimeline: React.FC<CloseApproachTimelineProps> = ({
  closeApproachData,
  asteroidName,
}) => {
  const yearlyData = useYearlyData(closeApproachData);

  if (yearlyData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No close approach data available for timeline visualization.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Close Approach Timeline
        </h3>
        <p className="text-sm text-gray-300">
          Historical and future close approaches by year
        </p>
      </div>

      <ApproachesBarChart data={yearlyData} />
      <DistanceLineChart data={yearlyData} />
      <SummaryStats data={yearlyData} />
    </div>
  );
};

export default CloseApproachTimeline;
