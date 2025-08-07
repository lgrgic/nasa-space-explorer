interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabNavigationProps) => {
  return (
    <div className={`border-b border-gray-700 mb-4 ${className}`}>
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 py-2 px-4 text-sm font-mono transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.count !== undefined
              ? `${tab.label} (${tab.count})`
              : tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
