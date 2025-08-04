import { useState } from "react";
import { AsteroidsFeed } from "./components/AsteroidsFeed";
import { AsteroidLookup } from "./components/AsteroidLookup";
import { Navigation } from "./components/Navigation";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"feed" | "lookup">("feed");

  return (
    <>
      {/* Navigation - Full width */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="relative z-10 pt-8">
          {/* Content */}
          {activeTab === "feed" ? <AsteroidsFeed /> : <AsteroidLookup />}
        </div>
      </div>
    </>
  );
}

export default App;
