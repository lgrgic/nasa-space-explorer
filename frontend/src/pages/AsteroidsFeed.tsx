import { useNavigate } from "react-router-dom";
import { AsteroidsFeed } from "../components/asteroids/AsteroidsFeed";
import { Navigation } from "../components/layout/Navigation";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { EarthBackground } from "../components/layout/EarthBackground";

export const AsteroidsFeedPage = () => {
  const navigate = useNavigate();

  const handleTabChange = (tab: "feed" | "lookup") => {
    if (tab === "feed") {
      navigate("/asteroids");
    } else if (tab === "lookup") {
      navigate("/lookup");
    }
  };

  return (
    <ErrorBoundary>
      <EarthBackground>
        <Navigation activeTab="feed" onTabChange={handleTabChange} />
        <div className="relative z-10 pt-8 bg-black/20 backdrop-blur-sm min-h-screen">
          <AsteroidsFeed />
        </div>
      </EarthBackground>
    </ErrorBoundary>
  );
};
