import { useState } from "react";
import { AsteroidsFeed } from "./components/asteroids/AsteroidsFeed";
import { AsteroidLookup } from "./components/asteroids/AsteroidLookup";
import { Navigation } from "./components/layout/Navigation";
import { Toaster } from "./components/ui/toaster";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"feed" | "lookup">("feed");

  return (
    <ErrorBoundary>
      {/* Navigation - Full width */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="relative z-10 pt-8">
          {/* Content */}
          {activeTab === "feed" ? <AsteroidsFeed /> : <AsteroidLookup />}
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
