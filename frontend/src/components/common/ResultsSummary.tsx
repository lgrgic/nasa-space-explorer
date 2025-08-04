interface ResultsSummaryProps {
  currentPageNumber: number;
  totalPages: number;
  cumulativeCount: number;
  totalAsteroids: number;
}

export const ResultsSummary = ({
  currentPageNumber,
  totalPages,
  cumulativeCount,
  totalAsteroids,
}: ResultsSummaryProps) => {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-2 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg bg-black/20 font-mono">
        <span className="font-medium">
          PAGE {currentPageNumber} OF {totalPages} - {cumulativeCount} OF{" "}
          {totalAsteroids} ASTEROIDS DETECTED
        </span>
      </div>
    </div>
  );
};
