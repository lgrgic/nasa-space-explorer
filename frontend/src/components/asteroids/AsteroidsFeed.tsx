import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { asteroidsApi } from "../../services/asteroidsApi";
import type { AsteroidsResponse, Asteroid } from "../../types/asteroids";
import { DateFilterForm } from "../forms/DateFilterForm";
import {
  AsteroidFilters,
  type AsteroidFilters as AsteroidFiltersType,
} from "../forms/AsteroidFilters";
import { AsteroidsGrid } from "./AsteroidsGrid";
import { ResultsSummary } from "../common/ResultsSummary";
import { Pagination } from "../common/Pagination";
import { CenteredDialog } from "../layout/CenteredDialog";
import { AsteroidDetailCard } from "./AsteroidDetailCard";
import { ApiErrorBoundary } from "../common/ApiErrorBoundary";

export const AsteroidsFeed = () => {
  const getTodayLocalString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(getTodayLocalString());
  const [endDate, setEndDate] = useState(getTodayLocalString());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [limit] = useState(9);
  const [uiFilters, setUiFilters] = useState<AsteroidFiltersType>({
    hazard: "all",
    distance: "all",
    size: "all",
    velocity: "all",
  });
  const [appliedFilters, setAppliedFilters] = useState<AsteroidFiltersType>({
    hazard: "all",
    distance: "all",
    size: "all",
    velocity: "all",
  });

  type FetchParams = {
    startDate: string;
    endDate: string;
    page: number;
    limit: number;
    filters: AsteroidFiltersType;
  };

  const [fetchParams, setFetchParams] = useState<FetchParams>({
    startDate,
    endDate,
    page: 1,
    limit,
    filters: appliedFilters,
  });

  const queryKey = ["asteroids-feed", fetchParams];

  const {
    data,
    isLoading: loading,
    isFetching,
    isError,
    error: queryError,
  } = useQuery<AsteroidsResponse>({
    queryKey,
    queryFn: () =>
      asteroidsApi.getFeed(
        fetchParams.startDate,
        fetchParams.endDate,
        fetchParams.page,
        fetchParams.limit,
        fetchParams.filters
      ),
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = () => {
    setCurrentPage(1);
    setShowSkeleton(true);
    setFetchParams({
      startDate,
      endDate,
      page: 1,
      limit,
      filters: appliedFilters,
    });
  };

  const handleNextPage = () => {
    if (data?.pagination?.hasNextPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setFetchParams({ ...fetchParams, page: nextPage });
    }
  };

  const handlePrevPage = () => {
    if (data?.pagination?.hasPrevPage) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setFetchParams({ ...fetchParams, page: prevPage });
    }
  };

  const handleAsteroidClick = async (asteroid: Asteroid) => {
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

  // initial load handled by useQuery

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters(uiFilters);
    setShowSkeleton(true);
    setFetchParams({
      startDate,
      endDate,
      page: 1,
      limit,
      filters: uiFilters,
    });
  };

  const [showSkeleton, setShowSkeleton] = useState(false);
  useEffect(() => {
    if (!isFetching && showSkeleton) {
      setShowSkeleton(false);
    }
  }, [isFetching, showSkeleton]);

  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white font-mono tracking-wider">
          NEAR EARTH ASTEROIDS
        </h1>

        <ApiErrorBoundary onRetry={() => setFetchParams({ ...fetchParams })}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4 font-mono">
              SYSTEM ERROR
            </h2>
            <p className="text-gray-400 font-mono">
              {(queryError as Error)?.message || "An unexpected error occurred"}
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

      <AsteroidFilters
        filters={uiFilters}
        onFiltersChange={setUiFilters}
        disabled={loading}
      />

      <div className="flex justify-end max-w-4xl mx-auto mt-2 mb-6">
        <button
          onClick={handleApplyFilters}
          disabled={loading}
          className={`px-6 py-2 rounded-lg transition-colors font-mono border ${
            loading
              ? "bg-gray-900 text-gray-500 border-gray-600 cursor-not-allowed"
              : "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600"
          }`}
        >
          APPLY FILTERS
        </button>
      </div>

      {data && allAsteroids.length > 0 && (
        <ResultsSummary
          currentPageNumber={currentPageNumber}
          totalPages={totalPages}
          cumulativeCount={cumulativeCount}
          totalAsteroids={totalAsteroids}
          totalCount={allAsteroids.length}
        />
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-mono">
                NO ASTEROIDS FOUND
              </h3>
              <p className="text-gray-400 font-mono text-sm">
                No near-Earth asteroids were detected for the selected date
                range and filters.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-mono">
                Try adjusting your date range or filter criteria.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // shows skeleton only during user-triggered fetches
        <div className="mt-4">
          <AsteroidsGrid
            asteroids={allAsteroids}
            loading={isFetching && showSkeleton}
            onAsteroidClick={handleAsteroidClick}
          />
        </div>
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

      {data?.pagination && (data.pagination.totalAsteroids ?? 0) > 0 && (
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
