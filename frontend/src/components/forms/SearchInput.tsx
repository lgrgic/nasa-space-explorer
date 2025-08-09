import { useState, useEffect } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  placeholder?: string;
  label?: string;
  className?: string;
  loading?: boolean;
}

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Search...",
  label = "SEARCH",
  className = "",
}: SearchInputProps) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const addToHistory = (searchTerm: string) => {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    setSearchHistory((prev) => {
      const newHistory = [
        trimmedTerm,
        ...prev.filter((item) => item !== trimmedTerm),
      ].slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleHistorySelect = (historyItem: string) => {
    onChange(historyItem);
    setShowHistory(false);
  };

  const removeFromHistory = (index: number) => {
    setSearchHistory((prev) => {
      const newHistory = prev.filter((_, i) => i !== index);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
      addToHistory(value);
    }
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to load search history:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".search-container")) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex-1 relative search-container ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowHistory(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-20 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/40 text-gray-200 font-mono"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            title="Clear search"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {showHistory && searchHistory.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-black/90 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-600">
            <span className="text-xs text-gray-400 font-mono">
              SEARCH HISTORY
            </span>
          </div>
          {searchHistory.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-700/50 cursor-pointer"
            >
              <button
                onClick={() => handleHistorySelect(item)}
                className="flex-1 text-left text-sm text-gray-200 hover:text-white font-mono"
              >
                {item}
              </button>
              <button
                onClick={() => removeFromHistory(index)}
                className="text-gray-400 hover:text-red-400 transition-colors ml-2"
                title="Remove from history"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
