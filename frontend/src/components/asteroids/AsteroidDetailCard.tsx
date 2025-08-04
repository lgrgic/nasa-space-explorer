import { useState } from "react";
import type { Asteroid } from "../types/asteroids";
import { Card } from "../layout/Card";
import { TabNavigation } from "../common/TabNavigation";
import { AsteroidOverview } from "./AsteroidOverview";
import { AsteroidApproaches } from "./AsteroidApproaches";
import { AsteroidOrbitalData } from "./AsteroidOrbitalData";
import { AIAnalysis } from "../features/AIAnalysis";

interface AsteroidDetailCardProps {
  asteroid: Asteroid;
  className?: string;
}

export const AsteroidDetailCard = ({
  asteroid,
  className = "",
}: AsteroidDetailCardProps) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "approaches" | "orbital" | "ai"
  >("overview");

  console.log("AsteroidDetailCard asteroid:", asteroid);

  const status = {
    type: (asteroid.is_potentially_hazardous_asteroid ? "error" : "success") as
      | "error"
      | "success",
    label: asteroid.is_potentially_hazardous_asteroid
      ? "Potentially Hazardous"
      : "Safe",
  };

  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    {
      id: "approaches",
      label: "CLOSE APPROACHES",
      count: asteroid.close_approach_data.length,
    },
    { id: "orbital", label: "ORBITAL DATA" },
    { id: "ai", label: "HONEST ANALYSIS" },
  ];

  return (
    <Card title={asteroid.name} status={status} className={className}>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) =>
          setActiveTab(tabId as "overview" | "approaches" | "orbital" | "ai")
        }
      />

      {activeTab === "overview" && <AsteroidOverview asteroid={asteroid} />}

      {activeTab === "approaches" && (
        <AsteroidApproaches
          closeApproachData={asteroid.close_approach_data}
          asteroidName={asteroid.name || asteroid.designation}
        />
      )}

      {activeTab === "orbital" && asteroid.orbital_data && (
        <AsteroidOrbitalData orbitalData={asteroid.orbital_data} />
      )}

      {activeTab === "ai" && (
        <AIAnalysis asteroidId={asteroid.id} asteroidName={asteroid.name} />
      )}

      {asteroid.is_potentially_hazardous_asteroid && (
        <div className="mt-4 p-3 border border-red-500/30 rounded-lg bg-red-500/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
            <span className="text-red-400 font-semibold text-sm font-mono">
              POTENTIALLY HAZARDOUS ASTEROID
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
