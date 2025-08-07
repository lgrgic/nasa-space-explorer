import { useState, useEffect } from "react";
import { asteroidsApi } from "../../services/asteroidsApi";
import type { AsteroidsResponse, Asteroid } from "../../types/asteroids";
import { DateFilterForm } from "../forms/DateFilterForm";
import { AsteroidsGrid } from "./AsteroidsGrid";
import { ResultsSummary } from "../common/ResultsSummary";
import { Pagination } from "../common/Pagination";
import { CenteredDialog } from "../layout/CenteredDialog";
import { AsteroidDetailCard } from "./AsteroidDetailCard";
import { ApiErrorBoundary } from "../common/ApiErrorBoundary";
import { useErrorHandler } from "../../hooks/useErrorHandler";

export const AsteroidsFeed = () => {
  const [data, setData] = useState<AsteroidsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [limit] = useState(9);

  const { hasError, error, retry, handleError } = useErrorHandler({
    onRetry: () => fetchAsteroids(startDate, endDate, currentPage),
  });

  const fetchAsteroids = async (
    start: string,
    end: string,
    page: number = 1
  ) => {
    try {
      setLoading(true);
      const response = await asteroidsApi.getFeed(start, end, page, limit);
      setData(response);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to load asteroids data");
      handleError(error);
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

  const handleAsteroidClick = async (asteroid: Asteroid) => {
    // Open modal immediately
    setSelectedAsteroid(asteroid);
    setIsModalOpen(true);
    setModalError(null);

    try {
      setModalLoading(true);
      // Fetch asteroid data using the same API as lookup
      const detailedAsteroid = await asteroidsApi.getAsteroidById(asteroid.id);
      setSelectedAsteroid(detailedAsteroid);
    } catch (err) {
      setModalError("Failed to load detailed asteroid information");
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsteroid(null);
    setModalError(null);
  };

  useEffect(() => {
    fetchAsteroids(startDate, endDate, 1);
  }, []);

  // Show skeleton
  if (loading && !data) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white font-mono tracking-wider">
          NEAR EARTH ASTEROIDS
        </h1>

        <DateFilterForm
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearch={handleSearch}
          loading={loading}
        />

        <AsteroidsGrid
          asteroids={[]}
          loading={true}
          onAsteroidClick={() => {}}
        />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white font-mono tracking-wider">
          NEAR EARTH ASTEROIDS
        </h1>

        <ApiErrorBoundary onRetry={retry}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4 font-mono">
              SYSTEM ERROR
            </h2>
            <p className="text-gray-400 font-mono">
              {error?.message || "An unexpected error occurred"}
            </p>
          </div>
        </ApiErrorBoundary>
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
      <h1 className="text-3xl font-bold text-center mb-8 text-white font-mono tracking-wider">
        NEAR EARTH ASTEROIDS
      </h1>

      <DateFilterForm
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearch={handleSearch}
        loading={loading}
      />

      {loading ? (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg bg-black/20 font-mono">
            <div className="h-4 bg-gray-700/50 rounded animate-pulse w-48"></div>
          </div>
        </div>
      ) : (
        data &&
        allAsteroids.length > 0 && (
          <ResultsSummary
            currentPageNumber={currentPageNumber}
            totalPages={totalPages}
            cumulativeCount={cumulativeCount}
            totalAsteroids={totalAsteroids}
          />
        )
      )}

      {allAsteroids.length === 0 && !loading && data ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-mono">
                NO ASTEROIDS FOUND
              </h3>
              <p className="text-gray-400 font-mono text-sm">
                No near-Earth asteroids were detected for the selected date
                range.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-mono">
                Try selecting a different date range or check back later for new
                data.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <AsteroidsGrid
          asteroids={allAsteroids}
          loading={loading}
          onAsteroidClick={handleAsteroidClick}
        />
      )}

      <CenteredDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="ASTEROID DETAILS"
      >
        {modalLoading && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold text-white font-mono mb-2">
                {selectedAsteroid?.name}
              </h3>
              <p className="text-gray-400 font-mono text-sm">
                Loading detailed information...
              </p>
            </div>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mb-4"></div>
          </div>
        )}

        {modalError && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-white font-mono mb-2">
                {selectedAsteroid?.name}
              </h3>
            </div>

            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-red-400 mb-4 font-mono">
                LOADING ERROR
              </h3>
              <p className="text-gray-400 font-mono">{modalError}</p>
            </div>
          </div>
        )}

        {selectedAsteroid && !modalLoading && !modalError && (
          <AsteroidDetailCard asteroid={selectedAsteroid} />
        )}
      </CenteredDialog>

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
