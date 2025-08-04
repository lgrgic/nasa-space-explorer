interface DateFilterFormProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export const DateFilterForm = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  loading = false,
}: DateFilterFormProps) => {
  return (
    <div className="max-w-4xl mx-auto border border-gray-700 rounded-lg p-6 mb-8 bg-black/20 backdrop-blur-sm">
      <div className="mb-4 p-3 border border-gray-600 rounded-lg bg-black/40">
        <p className="text-sm text-gray-300 font-mono">
          <span className="text-blue-400">NOTE:</span> NASA API allows a maximum
          date range of 7 days. Please select dates within this limit for best
          results.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="w-full lg:flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2 font-mono text-center lg:text-left">
            START DATE
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full max-w-xs mx-auto lg:mx-0 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/40 text-gray-200 font-mono"
          />
        </div>
        <div className="w-full lg:flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2 font-mono text-center lg:text-left">
            END DATE
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full max-w-xs mx-auto lg:mx-0 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/40 text-gray-200 font-mono"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={loading}
          className="w-full lg:w-auto px-6 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors font-mono border border-gray-600 disabled:bg-gray-900 disabled:text-gray-500"
        >
          {loading ? "SCANNING..." : "SCAN"}
        </button>
      </div>
    </div>
  );
};
