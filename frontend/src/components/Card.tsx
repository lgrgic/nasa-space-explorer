interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  status?: {
    type: "success" | "warning" | "error" | "info";
    label: string;
  };
  compact?: boolean;
}

export const Card = ({
  title,
  subtitle,
  children,
  className = "",
  status,
  compact = false,
}: CardProps) => {
  const getStatusColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={`border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-300 overflow-hidden h-full bg-black/20 backdrop-blur-sm ${className}`}
    >
      <div className={`${compact ? "p-3" : "p-4 sm:p-5 lg:p-6"}`}>
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <div className="flex-1 mr-2">
            <h3 className="font-bold text-base lg:text-lg text-gray-200 truncate font-mono">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1 font-mono">{subtitle}</p>
            )}
          </div>
          {status && (
            <div
              className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full flex-shrink-0 ${getStatusColor(
                status.type
              )}`}
              title={status.label}
            ></div>
          )}
        </div>

        <div
          className={`${compact ? "space-y-1.5" : "space-y-2 lg:space-y-3"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
