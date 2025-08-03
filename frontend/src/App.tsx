import { useState } from "react";
import { AsteroidsFeed } from "./components/AsteroidsFeed";
import { AsteroidLookup } from "./components/AsteroidLookup";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"feed" | "lookup">("feed");

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 pt-8">
          <div className="flex border border-gray-700 rounded-lg bg-black/20 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-6 py-3 font-mono transition-colors ${
                activeTab === "feed"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              ASTEROID FEED
            </button>
            <button
              onClick={() => setActiveTab("lookup")}
              className={`px-6 py-3 font-mono transition-colors ${
                activeTab === "lookup"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              ASTEROID LOOKUP
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "feed" ? <AsteroidsFeed /> : <AsteroidLookup />}
      </div>
    </div>
  );
}

export default App;
