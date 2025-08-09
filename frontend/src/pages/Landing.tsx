import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { initEarthScene } from "../utils/three";
import { isWebGLAvailable } from "../utils/three/webglDetection";
import { AsteroidsFeed } from "../components/asteroids/AsteroidsFeed";
import { AsteroidLookup } from "../components/asteroids/AsteroidLookup";
import { Navigation } from "../components/layout/Navigation";

export const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cleanupRef = useRef<(() => void) | null>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);

  const getActiveView = () => {
    if (location.pathname === "/asteroids") return "asteroids";
    if (location.pathname === "/lookup") return "lookup";
    return "landing";
  };

  const activeView = getActiveView();

  useEffect(() => {
    // Check WebGL support
    const hasWebGL = isWebGLAvailable();
    setWebGLSupported(hasWebGL);

    // Initialize Three.js scene
    const cleanup = initEarthScene("earth-container");
    if (cleanup) {
      cleanupRef.current = cleanup;
    }

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Three.js Earth will be rendered here */}
      <div id="earth-container" className="w-full h-screen"></div>

      {/* Sticky Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation
          activeTab={
            activeView === "asteroids"
              ? "feed"
              : activeView === "lookup"
              ? "lookup"
              : "feed"
          }
          onTabChange={(tab) => {
            if (tab === "feed") navigate("/asteroids");
            else if (tab === "lookup") navigate("/lookup");
          }}
        />
      </div>

      {/* Content positioning based on WebGL support */}
      {webGLSupported === true && (
        /* WebGL supported - content at bottom */
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 pointer-events-auto text-center">
            <p className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6 font-mono px-4">
              Explore the cosmos from Earth's perspective
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
              <button
                onClick={() => navigate("/asteroids")}
                className="px-6 sm:px-8 py-3 bg-gray-700/20 hover:bg-gray-600/30 text-white font-medium rounded-lg transition-colors font-mono border border-gray-500/50 hover:border-gray-400/70 text-sm sm:text-base"
              >
                ASTEROID FEED
              </button>
              <button
                onClick={() => navigate("/lookup")}
                className="px-6 sm:px-8 py-3 bg-gray-700/20 hover:bg-gray-600/30 text-white font-medium rounded-lg transition-colors font-mono border border-gray-500/50 hover:border-gray-400/70 text-sm sm:text-base"
              >
                LOOKUP ASTEROID
              </button>
            </div>
          </div>
        </div>
      )}

      {webGLSupported === false && (
        /* WebGL not supported - content centered with recommendation */
        <>
          {/* Centered content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none">
            <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 pointer-events-auto text-center">
              <p className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6 font-mono px-4">
                Explore the cosmos from Earth's perspective
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center mb-8">
                <button
                  onClick={() => navigate("/asteroids")}
                  className="px-6 sm:px-8 py-3 bg-gray-700/20 hover:bg-gray-600/30 text-white font-medium rounded-lg transition-colors font-mono border border-gray-500/50 hover:border-gray-400/70 text-sm sm:text-base"
                >
                  ASTEROID FEED
                </button>
                <button
                  onClick={() => navigate("/lookup")}
                  className="px-6 sm:px-8 py-3 bg-gray-700/20 hover:bg-gray-600/30 text-white font-medium rounded-lg transition-colors font-mono border border-gray-500/50 hover:border-gray-400/70 text-sm sm:text-base"
                >
                  LOOKUP ASTEROID
                </button>
              </div>
            </div>
          </div>

          {/* WebGL recommendation at bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
            <div className="flex justify-center items-center p-4 pointer-events-auto">
              <p className="text-xs text-gray-400 font-mono text-center px-4">
                For the best experience, use a browser that supports WebGL
              </p>
            </div>
          </div>
        </>
      )}

      {/* Asteroids Feed Overlay */}
      {activeView === "asteroids" && (
        <div className="absolute inset-0 z-20">
          {/* Blurry background overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          {/* Content */}
          <div className="relative z-30 h-full overflow-y-auto pt-16">
            <div className="p-4">
              <AsteroidsFeed />
            </div>
          </div>
        </div>
      )}

      {/* Asteroid Lookup Overlay */}
      {activeView === "lookup" && (
        <div className="absolute inset-0 z-20">
          {/* Blurry background overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          {/* Content */}
          <div className="relative z-30 h-full overflow-y-auto pt-16">
            <div className="p-4">
              <AsteroidLookup />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
