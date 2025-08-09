import React, { useState } from "react";
import { asteroidsApi } from "../../services/asteroidsApi";
import { Card } from "../layout/Card";
import { TabNavigation } from "../common/TabNavigation";

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

const SummarySkeleton = () => (
  <Card title="Summary">
    <div className="space-y-3">
      <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-5/6"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-2/3"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-4/5"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
    </div>
  </Card>
);

const RiskAssessmentSkeleton = () => (
  <Card title="Risk Assessment">
    <div className="space-y-3">
      <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-4/5"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-5/6"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-2/3"></div>
    </div>
  </Card>
);

const InterestingFactsSkeleton = () => (
  <Card title="Interesting Facts">
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start">
          <span className="text-green-400 mr-2 mt-1">•</span>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const TechnicalDetailsSkeleton = () => (
  <Card title="Technical Details">
    <div className="space-y-3">
      <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-4/5"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-5/6"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-2/3"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-4/5"></div>
    </div>
  </Card>
);

const RecommendationsSkeleton = () => (
  <Card title="Recommendations">
    <div className="space-y-3">
      <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-4/5"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-5/6"></div>
      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-2/3"></div>
    </div>
  </Card>
);

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ asteroidId }) => {
  const [analysis, setAnalysis] = useState<AsteroidAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRequestedAnalysis, setHasRequestedAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "summary" | "risk" | "facts" | "technical" | "recommendations"
  >("summary");

  const handleAnalyze = async () => {
    setHasRequestedAnalysis(true);
    setLoading(true);
    setError(null);

    try {
      const response = await asteroidsApi.analyzeAsteroid(asteroidId);
      if (response && response.analysis) {
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

  const tabs = [
    { id: "summary", label: "SUMMARY" },
    { id: "risk", label: "RISK ASSESSMENT" },
    { id: "facts", label: "INTERESTING FACTS" },
    { id: "technical", label: "TECHNICAL DETAILS" },
    { id: "recommendations", label: "RECOMMENDATIONS" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Are you ready for the truth?
        </h3>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            "Get Honest Take"
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Only show tabs after analysis */}
      {hasRequestedAnalysis && (
        <div className="space-y-4">
          <TabNavigation
            tabs={tabs}
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

          {activeTab === "summary" &&
            (loading || !analysis ? (
              <SummarySkeleton />
            ) : (
              <Card title="Summary">
                <div className="text-gray-300 leading-relaxed">
                  {analysis.summary}
                </div>
              </Card>
            ))}

          {activeTab === "risk" &&
            (loading || !analysis ? (
              <RiskAssessmentSkeleton />
            ) : (
              <Card title="Risk Assessment">
                <div className="text-gray-300 leading-relaxed">
                  {analysis.riskAssessment}
                </div>
              </Card>
            ))}

          {activeTab === "facts" &&
            (loading || !analysis ? (
              <InterestingFactsSkeleton />
            ) : (
              <Card title="Interesting Facts">
                <ul className="space-y-3">
                  {analysis.interestingFacts.map((fact, index) => (
                    <li key={index} className="text-gray-300 flex items-start">
                      <span className="text-green-400 mr-2 mt-1">•</span>
                      <div className="flex-1 leading-relaxed">{fact}</div>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}

          {activeTab === "technical" &&
            (loading || !analysis ? (
              <TechnicalDetailsSkeleton />
            ) : (
              <Card title="Technical Details">
                <div className="text-gray-300 leading-relaxed">
                  {analysis.technicalDetails}
                </div>
              </Card>
            ))}

          {activeTab === "recommendations" &&
            (loading || !analysis ? (
              <RecommendationsSkeleton />
            ) : (
              <Card title="Recommendations">
                <div className="text-gray-300">
                  {analysis.recommendations.split("\n").map((line, index) => {
                    // Check if line contains a YouTube link
                    const youtubeMatch = line.match(
                      /(https:\/\/(www\.)?youtube\.com\/watch\?v=[^\s]+|https:\/\/youtu\.be\/[^\s]+)/
                    );
                    if (youtubeMatch) {
                      const url = youtubeMatch[1];
                      const text = line.replace(url, "").trim();
                      return (
                        <p key={index} className="mb-2">
                          <span className="inline">{text}</span>{" "}
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
                        <span className="inline">{line}</span>
                      </p>
                    );
                  })}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};
