import { useState, useEffect } from "react";
import { asteroidsApi } from "../../services/asteroidsApi";
import type { AsteroidsResponse, Asteroid } from "../../types/asteroids";
import { DateFilterForm } from "../forms/DateFilterForm";
import { AsteroidsGrid } from "./AsteroidsGrid";
import { ResultsSummary } from "../common/ResultsSummary";
import { Pagination } from "../common/Pagination";
import { Modal } from "../layout/Modal";
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
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
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

      {data && (
        <ResultsSummary
          currentPageNumber={currentPageNumber}
          totalPages={totalPages}
          cumulativeCount={cumulativeCount}
          totalAsteroids={totalAsteroids}
        />
      )}

      <AsteroidsGrid
        asteroids={allAsteroids}
        loading={loading}
        onAsteroidClick={handleAsteroidClick}
      />

      {/* Modal for asteroid details */}
      <Modal
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
      </Modal>

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
