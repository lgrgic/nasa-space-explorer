import { useMemo } from "react";
import type { CloseApproachData } from "../../types/asteroids";

export const useYearlyData = (closeApproachData: CloseApproachData[]) => {
  return useMemo(() => {
    const yearMap = new Map<
      number,
      {
        approaches: number;
        distances: number[];
        hazardous: boolean;
      }
    >();

    closeApproachData.forEach((approach) => {
      const year = new Date(approach.close_approach_date).getFullYear();
      const distance = parseFloat(approach.miss_distance.astronomical);

      if (!yearMap.has(year)) {
        yearMap.set(year, {
          approaches: 0,
          distances: [],
          hazardous: false,
        });
      }

      const yearData = yearMap.get(year)!;
      yearData.approaches += 1;
      yearData.distances.push(distance);
    });

    return Array.from(yearMap.entries())
      .map(([year, data]) => ({
        year,
        approaches: data.approaches,
        minDistance: Math.min(...data.distances),
        maxDistance: Math.max(...data.distances),
        avgDistance:
          data.distances.reduce((a, b) => a + b, 0) / data.distances.length,
        hazardous: data.hazardous,
      }))
      .sort((a, b) => a.year - b.year);
  }, [closeApproachData]);
};
