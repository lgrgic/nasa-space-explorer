interface ResultsSummaryProps {
  currentPageNumber: number;
  totalPages: number;
  cumulativeCount: number;
  totalAsteroids: number;
  filteredCount?: number;
  totalCount?: number;
}

export const ResultsSummary = ({
  currentPageNumber,
  totalPages,
  cumulativeCount,
  totalAsteroids,
  filteredCount,
  totalCount,
}: ResultsSummaryProps) => {
  const hasFilters =
    filteredCount !== undefined &&
    totalCount !== undefined &&
    filteredCount !== totalCount;

  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-2 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg bg-black/20 font-mono">
        <span className="font-medium">
          PAGE {currentPageNumber} OF {totalPages} - {cumulativeCount} OF{" "}
          {totalAsteroids} ASTEROIDS DETECTED
          {hasFilters && (
            <span className="text-blue-400 ml-2">
              ({filteredCount} MATCHING FILTERS)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
