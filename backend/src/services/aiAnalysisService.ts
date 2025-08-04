import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_KEY;

let openai: OpenAI;

try {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_KEY environment variable is not configured");
  }

  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
} catch (error) {
  console.error("OpenAI initialization error:", error);
  openai = null as any;
}

export interface AsteroidAnalysis {
  summary: string;
  riskAssessment: string;
  interestingFacts: string[];
  technicalDetails: string;
  recommendations: string;
}

export const aiAnalysisService = {
  async analyzeAsteroid(asteroidData: any): Promise<AsteroidAnalysis> {
    try {
      if (!openai) {
        throw new Error("OpenAI client not initialized");
      }

      // Use only essential data to reduce token count (OpenAI token limit)
      const essentialData = {
        id: asteroidData.id,
        name: asteroidData.name,
        designation: asteroidData.designation,
        absolute_magnitude_h: asteroidData.absolute_magnitude_h,
        estimated_diameter: asteroidData.estimated_diameter,
        is_potentially_hazardous_asteroid:
          asteroidData.is_potentially_hazardous_asteroid,
        is_sentry_object: asteroidData.is_sentry_object,
        // Only include last 5)
        close_approach_data: asteroidData.close_approach_data?.slice(-5) || [],
        orbital_data: asteroidData.orbital_data
          ? {
              orbit_class: asteroidData.orbital_data.orbit_class,
              orbital_period: asteroidData.orbital_data.orbital_period,
              eccentricity: asteroidData.orbital_data.eccentricity,
              semi_major_axis: asteroidData.orbital_data.semi_major_axis,
              inclination: asteroidData.orbital_data.inclination,
            }
          : null,
      };

      const prompt = `
Analyze this asteroid data and provide a comprehensive, darkly humorous explanation:

ASTEROID DATA:
${JSON.stringify(essentialData, null, 2)}

Please provide your response in this exact format:

**Summary**
[Write a darkly humorous summary of what this asteroid is and its significance - 
be witty and sarcastic]

**Risk Assessment**
[Write risk assessment with dark humor - make jokes about the end of the world
 but keep it informative]

**Interesting Facts**
- [Fact 1 with dark humor]
- [Fact 2 with dark humor]
- [Fact 3 with dark humor]
- [Fact 4 with dark humor]
- [Fact 5 with dark humor]

**Technical Details**
[Write technical details explained in layman's terms with dark humor]

**Recommendations**
[Write recommendations with dark humor, then add: "If this asteroid hits us,
the best last song to play before the world ends would be: [Song Name] by [Artist] 
- [YouTube link to the song]"

IMPORTANT: Be creative and diverse with song choices! Don't always pick obvious 
"end of the world" songs like "It's The End Of The World As We Know It" by R.E.M. 
Consider different genres, moods, and themes. Pick songs that are:
- Unexpected but fitting (like "Bohemian Rhapsody" for dramatic irony)
- Genre-diverse (rock, pop, classical, electronic, etc.)
- Thematically interesting (songs about space, time, life, death, but not obvious
 apocalypse songs)
- Sometimes humorous or ironic choices
- Occasionally peaceful or beautiful songs for contrast
- Mix of old and new songs across different decades

Make it engaging, educational, darkly humorous, and easy to understand for
non-scientists. Use sarcasm and wit throughout.
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert astronomer with a dark sense of humor. 
              Explain complex asteroid data in simple, engaging terms with witty 
              sarcasm and dark humor. Be accurate, educational, and entertaining. 
              Use dark comedy to make space science more engaging.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.8,
      });

      const response = completion.choices[0]?.message?.content || "";

      return this.parseAIResponse(response);
    } catch (error) {
      console.error("AI Analysis error:", error);
      throw new Error("Failed to analyze asteroid data");
    }
  },

  parseAIResponse(response: string): AsteroidAnalysis {
    // Handle the case where AI response might not be properly formatted
    if (!response || response.trim() === "") {
      return {
        summary: "Analysis unavailable",
        riskAssessment: "Risk assessment unavailable",
        interestingFacts: [],
        technicalDetails: "Technical details unavailable",
        recommendations: "No specific recommendations",
      };
    }

    // Try to extract sections from the response
    const lines = response.split("\n");
    let currentSection = "";
    let sections: string[] = [];

    for (const line of lines) {
      if (line.includes("**Summary**") || line.includes("Summary:")) {
        currentSection = "summary";
        sections[0] = line
          .replace("**Summary**", "")
          .replace("Summary:", "")
          .trim();
      } else if (
        line.includes("**Risk Assessment**") ||
        line.includes("Risk Assessment:")
      ) {
        currentSection = "risk";
        sections[1] = line
          .replace("**Risk Assessment**", "")
          .replace("Risk Assessment:", "")
          .trim();
      } else if (
        line.includes("**Interesting Facts**") ||
        line.includes("Interesting Facts:")
      ) {
        currentSection = "facts";
        sections[2] = "";
      } else if (
        line.includes("**Technical Details**") ||
        line.includes("Technical Details:")
      ) {
        currentSection = "technical";
        sections[3] = line
          .replace("**Technical Details**", "")
          .replace("Technical Details:", "")
          .trim();
      } else if (
        line.includes("**Recommendations**") ||
        line.includes("Recommendations:")
      ) {
        currentSection = "recommendations";
        sections[4] = line
          .replace("**Recommendations**", "")
          .replace("Recommendations:", "")
          .trim();
      } else if (line.trim() && currentSection === "facts") {
        sections[2] = sections[2]
          ? sections[2] + "\n" + line.trim()
          : line.trim();
      } else if (line.trim() && currentSection) {
        const sectionIndex =
          currentSection === "summary"
            ? 0
            : currentSection === "risk"
            ? 1
            : currentSection === "technical"
            ? 3
            : currentSection === "recommendations"
            ? 4
            : -1;
        if (sectionIndex >= 0) {
          sections[sectionIndex] = sections[sectionIndex]
            ? sections[sectionIndex] + " " + line.trim()
            : line.trim();
        }
      }
    }

    // Split facts into array
    const facts = sections[2]
      ? sections[2].split("\n").filter((fact) => fact.trim())
      : [];

    return {
      summary: sections[0] || "Analysis unavailable",
      riskAssessment: sections[1] || "Risk assessment unavailable",
      interestingFacts: facts,
      technicalDetails: sections[3] || "Technical details unavailable",
      recommendations: sections[4] || "No specific recommendations",
    };
  },
};
