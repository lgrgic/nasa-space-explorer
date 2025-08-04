import { useState } from "react";

interface NavigationProps {
  activeTab: "feed" | "lookup";
  onTabChange: (tab: "feed" | "lookup") => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabClick = (tab: "feed" | "lookup") => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black/20 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50 w-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white font-mono tracking-wider">
                NASA SPACE EXPLORER
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => handleTabClick("feed")}
                className={`px-3 py-2 rounded-md text-sm font-mono transition-colors ${
                  activeTab === "feed"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                ASTEROID FEED
              </button>
              <button
                onClick={() => handleTabClick("lookup")}
                className={`px-3 py-2 rounded-md text-sm font-mono transition-colors ${
                  activeTab === "lookup"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                ASTEROID LOOKUP
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/20 border-t border-gray-700">
          <button
            onClick={() => handleTabClick("feed")}
            className={`block w-full text-left px-3 py-2 rounded-md text-base font-mono transition-colors ${
              activeTab === "feed"
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            ASTEROID FEED
          </button>
          <button
            onClick={() => handleTabClick("lookup")}
            className={`block w-full text-left px-3 py-2 rounded-md text-base font-mono transition-colors ${
              activeTab === "lookup"
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            ASTEROID LOOKUP
          </button>
        </div>
      </div>
    </nav>
  );
};
