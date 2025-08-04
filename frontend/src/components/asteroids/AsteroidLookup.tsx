import { useState } from "react";
import { asteroidsApi } from "../../services/asteroidsApi";
import { AsteroidDetailCard } from "./AsteroidDetailCard";
import { SearchInput } from "../forms/SearchInput";
import { ApiErrorBoundary } from "../common/ApiErrorBoundary";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import type { Asteroid } from "../../types/asteroids";

export const AsteroidLookup = () => {
  const [asteroidId, setAsteroidId] = useState("");
  const [asteroid, setAsteroid] = useState<Asteroid | null>(null);
  const [loading, setLoading] = useState(false);

  const { hasError, error, retry, handleError } = useErrorHandler({
    onRetry: () => handleSearch(),
  });

  const handleSearch = async () => {
    if (!asteroidId.trim()) {
      handleError(new Error("Please enter an asteroid ID or name"));
      return;
    }

    try {
      setLoading(true);

      // Convert to uppercase
      const searchTerm = asteroidId.trim();
      const processedSearchTerm = /[a-zA-Z]/.test(searchTerm)
        ? searchTerm.toUpperCase()
        : searchTerm;

      const data = await asteroidsApi.getAsteroidById(processedSearchTerm);
      setAsteroid(data);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error(
              "Failed to find asteroid. Please check the ID or name and try again."
            );
      handleError(error);
      setAsteroid(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setAsteroidId("");
    setAsteroid(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-white font-mono tracking-wider">
        ASTEROID LOOKUP
      </h2>

      <div className="max-w-2xl mx-auto border border-gray-700 rounded-lg p-6 mb-8 bg-black/20 backdrop-blur-sm">
        <div className="mb-4 p-3 border border-gray-600 rounded-lg bg-black/40">
          <p className="text-sm text-gray-300 font-mono">
            <span className="text-blue-400">NOTE:</span> Enter asteroid ID or
            name to find a specific asteroid.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <SearchInput
            value={asteroidId}
            onChange={setAsteroidId}
            onSearch={handleSearch}
            onClear={handleClear}
            placeholder="e.g., 3542519 or 2010 RF42"
            label="ASTEROID ID OR NAME"
            loading={loading}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-colors font-mono border border-gray-600"
          >
            {loading ? "SEARCHING..." : "SEARCH"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400 mb-4"></div>
          </div>
        </div>
      )}

      {hasError && (
        <ApiErrorBoundary onRetry={retry}>
          <div className="text-center">
            <h3 className="text-xl font-bold text-red-400 mb-4 font-mono">
              SEARCH ERROR
            </h3>
            <p className="text-gray-400 font-mono">
              {error?.message || "An unexpected error occurred"}
            </p>
          </div>
        </ApiErrorBoundary>
      )}

      {asteroid && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg bg-black/20 font-mono">
              <span className="font-medium">ASTEROID FOUND</span>
            </div>
          </div>
          <AsteroidDetailCard asteroid={asteroid} />
        </div>
      )}
    </div>
  );
};
