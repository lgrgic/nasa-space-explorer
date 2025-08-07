import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  activeTab: "feed" | "lookup";
  onTabChange: (tab: "feed" | "lookup") => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navigate = useNavigate();
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
              <button
                onClick={() => navigate("/")}
                className="text-xl font-bold text-white font-mono tracking-wider hover:text-gray-300 transition-colors cursor-pointer"
              >
                NASA SPACE EXPLORER
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleTabClick("feed")}
                className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors border ${
                  activeTab === "feed"
                    ? "bg-gray-700/20 text-white border-gray-500/50 hover:bg-gray-600/30 hover:border-gray-400/70"
                    : "bg-gray-700/20 text-gray-300 hover:text-white hover:bg-gray-600/30 border-gray-500/50 hover:border-gray-400/70"
                }`}
              >
                ASTEROID FEED
              </button>
              <button
                onClick={() => handleTabClick("lookup")}
                className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors border ${
                  activeTab === "lookup"
                    ? "bg-gray-700/20 text-white border-gray-500/50 hover:bg-gray-600/30 hover:border-gray-400/70"
                    : "bg-gray-700/20 text-gray-300 hover:text-white hover:bg-gray-600/30 border-gray-500/50 hover:border-gray-400/70"
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
        <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-black/20 border-t border-gray-700">
          <button
            onClick={() => handleTabClick("feed")}
            className={`block w-full text-left px-4 py-3 rounded-lg text-base font-mono transition-colors border ${
              activeTab === "feed"
                ? "bg-gray-700/20 text-white border-gray-500/50 hover:bg-gray-600/30 hover:border-gray-400/70"
                : "bg-gray-700/20 text-gray-300 hover:text-white hover:bg-gray-600/30 border-gray-500/50 hover:border-gray-400/70"
            }`}
          >
            ASTEROID FEED
          </button>
          <button
            onClick={() => handleTabClick("lookup")}
            className={`block w-full text-left px-4 py-3 rounded-lg text-base font-mono transition-colors border ${
              activeTab === "lookup"
                ? "bg-gray-700/20 text-white border-gray-500/50 hover:bg-gray-600/30 hover:border-gray-400/70"
                : "bg-gray-700/20 text-gray-300 hover:text-white hover:bg-gray-600/30 border-gray-500/50 hover:border-gray-400/70"
            }`}
          >
            ASTEROID LOOKUP
          </button>
        </div>
      </div>
    </nav>
  );
};
