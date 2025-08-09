import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ApiErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState(
      (prevState) => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1,
      }),
      () => {
        if (this.props.onRetry) {
          this.props.onRetry();
        }
      }
    );
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError =
        this.state.error?.message?.includes("Network Error") ||
        this.state.error?.message?.includes("timeout") ||
        this.state.error?.message?.includes("fetch");

      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {isNetworkError ? "Connection Error" : "Something went wrong"}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {isNetworkError
                ? "Unable to connect to the server. Please check your internet connection."
                : "We encountered an error while loading the data."}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={this.handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {this.state.retryCount > 0
                ? `Try Again (${this.state.retryCount})`
                : "Try Again"}
            </button>

            {this.state.retryCount >= 3 && (
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
