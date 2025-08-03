import type { OrbitalData } from "../types/asteroids";

interface AsteroidOrbitalDataProps {
  orbitalData: OrbitalData;
}

export const AsteroidOrbitalData = ({
  orbitalData,
}: AsteroidOrbitalDataProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          ORBIT CLASS
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {orbitalData.orbit_class.orbit_class_type}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          ECCENTRICITY
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {parseFloat(orbitalData.eccentricity).toFixed(6)}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          SEMI-MAJOR AXIS (AU)
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {parseFloat(orbitalData.semi_major_axis).toFixed(6)}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          INCLINATION (°)
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {parseFloat(orbitalData.inclination).toFixed(3)}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          ORBITAL PERIOD (DAYS)
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {parseFloat(orbitalData.orbital_period).toFixed(1)}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          PERIHELION DISTANCE (AU)
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {parseFloat(orbitalData.perihelion_distance).toFixed(6)}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          APHELION DISTANCE (AU)
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {parseFloat(orbitalData.aphelion_distance).toFixed(6)}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          OBSERVATIONS
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {orbitalData.observations_used}
        </span>
      </div>

      <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-400 font-medium text-sm font-mono">
          DATA ARC (DAYS)
        </span>
        <span className="text-gray-200 font-semibold text-sm font-mono">
          {orbitalData.data_arc_in_days}
        </span>
      </div>

      <div className="pt-3">
        <div className="text-xs text-gray-400 font-mono mb-2">
          ORBIT CLASS DESCRIPTION:
        </div>
        <div className="text-xs text-gray-300 font-mono p-3 bg-gray-800/50 rounded border border-gray-700">
          {orbitalData.orbit_class.orbit_class_description}
        </div>
      </div>
    </div>
  );
};
