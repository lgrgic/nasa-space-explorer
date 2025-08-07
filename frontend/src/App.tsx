import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { AsteroidsFeedPage } from "./pages/AsteroidsFeed";
import { AsteroidLookupPage } from "./pages/AsteroidLookup";
import { Toaster } from "./components/ui/toaster";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen relative overflow-hidden">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/asteroids" element={<AsteroidsFeedPage />} />
            <Route path="/lookup" element={<AsteroidLookupPage />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
