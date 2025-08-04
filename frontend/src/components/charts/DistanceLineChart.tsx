import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { YearlyData } from "./types";

interface DistanceLineChartProps {
  data: YearlyData[];
}

const DistanceLineChart: React.FC<DistanceLineChartProps> = ({ data }) => {
  const formatYear = (year: number) => {
    return year.toString();
  };

  const formatDistance = (distance: number) => {
    return `${distance.toFixed(3)} AU`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as YearlyData;
      return (
        <div className="bg-black/90 border border-gray-600 rounded-lg p-3 text-white">
          <p className="font-semibold text-blue-400">{label}</p>
          <p className="text-sm">Approaches: {data.approaches}</p>
          <p className="text-sm">
            Min Distance: {formatDistance(data.minDistance)}
          </p>
          <p className="text-sm">
            Max Distance: {formatDistance(data.maxDistance)}
          </p>
          <p className="text-sm">
            Avg Distance: {formatDistance(data.avgDistance)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h4 className="text-md font-semibold text-white mb-4 text-center">
        Distance from Earth by Year
      </h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="year"
            tickFormatter={formatYear}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `${value.toFixed(2)} AU`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="avgDistance"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="minDistance"
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#F59E0B", strokeWidth: 1, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="maxDistance"
            stroke="#EF4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#EF4444", strokeWidth: 1, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Average Distance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Minimum Distance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Maximum Distance</span>
        </div>
      </div>
    </div>
  );
};

export default DistanceLineChart;
