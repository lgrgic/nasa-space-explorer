import React, { useEffect, useRef } from "react";
import { initEarthScene } from "../../utils/three";

interface EarthBackgroundProps {
  children: React.ReactNode;
}

export const EarthBackground: React.FC<EarthBackgroundProps> = ({
  children,
}) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
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
      <div
        id="earth-container"
        className="w-full h-screen fixed inset-0 -z-10"
      ></div>

      {/* Content overlay */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
