import { useState, useEffect } from "react";
import { asteroidsApi } from "../services/asteroidsApi";
import type { AsteroidsResponse, Asteroid } from "../types/asteroids";
import { AsteroidCard } from "./AsteroidCard";
import { Pagination } from "./Pagination";

export const AsteroidsFeed = () => {
  const [data, setData] = useState<AsteroidsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9);

  const fetchAsteroids = async (
    start: string,
    end: string,
    page: number = 1
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await asteroidsApi.getFeed(start, end, page, limit);
      setData(response);
    } catch (err) {
      setError("Failed to load asteroids data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAsteroids(startDate, endDate, 1);
  };

  const handleNextPage = () => {
    if (data?.pagination?.hasNextPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchAsteroids(startDate, endDate, nextPage);
    }
  };

  const handlePrevPage = () => {
    if (data?.pagination?.hasPrevPage) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchAsteroids(startDate, endDate, prevPage);
    }
  };

  useEffect(() => {
    fetchAsteroids(startDate, endDate, 1);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400 mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4 font-mono">
            SYSTEM ERROR
          </h2>
          <p className="text-gray-400 font-mono">{error}</p>
        </div>
      </div>
    );
  }

  const allAsteroids: Asteroid[] = data
    ? Object.values(data.near_earth_objects).flat()
    : [];

  const currentPageCount = allAsteroids.length;
  const totalAsteroids = data?.pagination?.totalAsteroids || 0;
  const currentPageNumber = data?.pagination?.currentPage || 1;
  const totalPages = data?.pagination?.totalPages || 0;

  const cumulativeCount = Math.min(
    (currentPageNumber - 1) * limit + currentPageCount,
    totalAsteroids
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-white font-mono tracking-wider">
        NEAR EARTH ASTEROIDS
      </h1>

      <div className="max-w-4xl mx-auto border border-gray-700 rounded-lg p-6 mb-8 bg-black/20 backdrop-blur-sm">
        <div className="mb-4 p-3 border border-gray-600 rounded-lg bg-black/40">
          <p className="text-sm text-gray-300 font-mono">
            <span className="text-blue-400">NOTE:</span> NASA API allows a
            maximum date range of 7 days. Please select dates within this limit
            for best results.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
              START DATE
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/40 text-gray-200 font-mono"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
              END DATE
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/40 text-gray-200 font-mono"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors font-mono border border-gray-600"
          >
            SCAN
          </button>
        </div>
      </div>

      {data && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg bg-black/20 font-mono">
            <span className="font-medium">
              PAGE {currentPageNumber} OF {totalPages} - {cumulativeCount} OF{" "}
              {totalAsteroids} ASTEROIDS DETECTED
            </span>
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {allAsteroids.map((asteroid) => (
            <AsteroidCard key={asteroid.id} asteroid={asteroid} />
          ))}
        </div>
      </div>

      {data?.pagination && (
        <Pagination
          currentPage={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          hasNextPage={data.pagination.hasNextPage}
          hasPrevPage={data.pagination.hasPrevPage}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          className="mt-8"
        />
      )}
    </div>
  );
};
