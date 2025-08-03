interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  className = "",
}: PaginationProps) => {
  return (
    <div className={`flex justify-center items-center gap-4 ${className}`}>
      <button
        onClick={onPrevPage}
        disabled={!hasPrevPage}
        className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors font-mono border border-gray-600"
      >
        PREVIOUS
      </button>

      <span className="text-gray-300 font-medium font-mono">
        PAGE {currentPage} OF {totalPages}
      </span>

      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors font-mono border border-gray-600"
      >
        NEXT
      </button>
    </div>
  );
};
