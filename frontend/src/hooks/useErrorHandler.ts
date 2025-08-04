import { useState, useCallback } from "react";

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

interface UseErrorHandlerOptions {
  maxRetries?: number;
  onError?: (error: Error) => void;
  onRetry?: () => void;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { maxRetries = 3, onError, onRetry } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    retryCount: 0,
  });

  const handleError = useCallback(
    (error: Error) => {
      console.error("Error caught by useErrorHandler:", error);

      setErrorState((prev) => ({
        hasError: true,
        error,
        retryCount: prev.retryCount,
      }));

      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  const retry = useCallback(() => {
    if (errorState.retryCount < maxRetries) {
      setErrorState((prev) => ({
        hasError: false,
        error: null,
        retryCount: prev.retryCount + 1,
      }));

      if (onRetry) {
        onRetry();
      }
    }
  }, [errorState.retryCount, maxRetries, onRetry]);

  const reset = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  return {
    error: errorState.error,
    hasError: errorState.hasError,
    retryCount: errorState.retryCount,
    canRetry: errorState.retryCount < maxRetries,
    handleError,
    clearError,
    retry,
    reset,
  };
};
