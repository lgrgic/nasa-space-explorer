import React, { useState } from "react";
import { asteroidsApi } from "../services/asteroidsApi";
import { Card } from "./Card";
import { TabNavigation } from "./TabNavigation";

interface AsteroidAnalysis {
  summary: string;
  riskAssessment: string;
  interestingFacts: string[];
  technicalDetails: string;
  recommendations: string;
}

interface AIAnalysisProps {
  asteroidId: string;
  asteroidName: string;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({
  asteroidId,
  asteroidName,
}) => {
  const [analysis, setAnalysis] = useState<AsteroidAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "summary" | "risk" | "facts" | "technical" | "recommendations"
  >("summary");

  console.log("AIAnalysis props:", { asteroidId, asteroidName });

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    console.log("Starting AI analysis for asteroid ID:", asteroidId);

    try {
      const response = await asteroidsApi.analyzeAsteroid(asteroidId);
      console.log("AI Analysis response:", response);
      if (response && response.analysis) {
        console.log("Setting analysis:", response.analysis);
        setAnalysis(response.analysis);
      } else {
        console.error("Invalid response structure:", response);
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      }
      setError("Failed to analyze asteroid. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Are you ready for the truth?
        </h3>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {loading ? "Analyzing..." : "Get Honest Take"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          <TabNavigation
            tabs={[
              { id: "summary", label: "SUMMARY" },
              { id: "risk", label: "RISK ASSESSMENT" },
              { id: "facts", label: "INTERESTING FACTS" },
              { id: "technical", label: "TECHNICAL DETAILS" },
              { id: "recommendations", label: "RECOMMENDATIONS" },
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) =>
              setActiveTab(
                tabId as
                  | "summary"
                  | "risk"
                  | "facts"
                  | "technical"
                  | "recommendations"
              )
            }
          />

          {activeTab === "summary" && (
            <Card title="Summary">
              <p className="text-gray-300">{analysis.summary}</p>
            </Card>
          )}

          {activeTab === "risk" && (
            <Card title="Risk Assessment">
              <p className="text-gray-300">{analysis.riskAssessment}</p>
            </Card>
          )}

          {activeTab === "facts" && (
            <Card title="Interesting Facts">
              <ul className="space-y-1">
                {analysis.interestingFacts.map((fact, index) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {activeTab === "technical" && (
            <Card title="Technical Details">
              <p className="text-gray-300">{analysis.technicalDetails}</p>
            </Card>
          )}

          {activeTab === "recommendations" && (
            <Card title="Recommendations">
              <div className="text-gray-300">
                {analysis.recommendations.split("\n").map((line, index) => {
                  // Check if line contains a YouTube link (both formats)
                  const youtubeMatch = line.match(
                    /(https:\/\/(www\.)?youtube\.com\/watch\?v=[^\s]+|https:\/\/youtu\.be\/[^\s]+)/
                  );
                  if (youtubeMatch) {
                    const url = youtubeMatch[1];
                    const text = line.replace(url, "").trim();
                    return (
                      <p key={index} className="mb-2">
                        {text}{" "}
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors font-medium"
                        >
                          🎵 Listen on YouTube
                        </a>
                      </p>
                    );
                  }
                  return (
                    <p key={index} className="mb-2">
                      {line}
                    </p>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
