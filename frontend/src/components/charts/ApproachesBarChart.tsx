import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { YearlyData } from "./types";

interface ApproachesBarChartProps {
  data: YearlyData[];
}

const ApproachesBarChart: React.FC<ApproachesBarChartProps> = ({ data }) => {
  const formatYear = (year: number) => {
    return year.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as YearlyData;
      return (
        <div className="bg-black/90 border border-gray-600 rounded-lg p-3 text-white">
          <p className="font-semibold text-blue-400">{label}</p>
          <p className="text-sm">Approaches: {data.approaches}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h4 className="text-md font-semibold text-white mb-4 text-center">
        Number of Approaches by Year
      </h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="year"
            tickFormatter={formatYear}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="approaches" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApproachesBarChart;
