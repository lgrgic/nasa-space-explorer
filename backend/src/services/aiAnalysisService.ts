import OpenAI from "openai";
import dotenv from "dotenv";
import { z } from "zod";

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

//response validation
const AIResponseSchema = z.object({
  summary: z.string(),
  riskAssessment: z.string(),
  interestingFacts: z.array(z.string()),
  technicalDetails: z.string(),
  recommendations: z.string(),
});

type AIResponse = z.infer<typeof AIResponseSchema>;

export const aiAnalysisService = {
  async analyzeAsteroid(asteroidData: any): Promise<AsteroidAnalysis> {
    try {
      if (!openai) {
        throw new Error("OpenAI client not initialized");
      }

      // OpenAI token limit
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
Analyze this asteroid data and provide a comprehensive, detailed, darkly humorous explanation.

ASTEROID DATA:
${JSON.stringify(essentialData, null, 2)}

Return your response as a JSON object with this exact structure:

  {
    "summary": "Write a comprehensive, multi-paragraph summary of the asteroid and its significance. Use long, detailed sentences that flow naturally and tell a complete story. Include what makes this asteroid unique, its discovery story, historical context, and why it matters (or doesn't matter) to humanity. Write in a narrative style with dark humor throughout. Make each sentence substantial and informative. Write at least 3-4 long paragraphs with flowing, engaging prose.",
    "riskAssessment": "Write a detailed, multi-paragraph risk assessment with dark humor about potential impact scenarios. Use long, flowing sentences that build upon each other and create a compelling narrative. Include specific details about the asteroid's threat level, what would happen if it hit Earth, historical comparisons to other impacts, and why we should or shouldn't be worried. Be thorough and informative while maintaining the dark humor throughout. Write in a conversational, engaging style. Write at least 3-4 long paragraphs with substantial content.",
  "interestingFacts": [
    "Write a detailed, multi-sentence fact with dark humor about this asteroid. Use long, flowing sentences
     that tell a complete story or provide comprehensive information about one aspect of the asteroid.",
    "Write another detailed, multi-sentence fact with dark humor about this asteroid. Use long, flowing 
    sentences that explore a different aspect or characteristic of the asteroid in depth.", 
    "Write a third detailed, multi-sentence fact with dark humor about this asteroid. Use long, flowing 
    sentences that provide comprehensive information about another unique aspect of this space rock.",
    "Write a fourth detailed, multi-sentence fact with dark humor about this asteroid. Use long, flowing 
    sentences that explore yet another fascinating aspect of this cosmic object.",
    "Write a fifth detailed, multi-sentence fact with dark humor about this asteroid. Use long, flowing 
    sentences that provide the final piece of comprehensive information about this asteroid."
  ],
      "technicalDetails": "Write comprehensive technical details explained in layman's terms with dark humor. Use long, detailed sentences that flow naturally and create a compelling narrative. Include orbital characteristics, size comparisons, speed, composition, and other relevant scientific information. Write in a narrative style that makes complex concepts accessible while maintaining the dark humor. Make each sentence substantial and educational. Write at least 2-3 long paragraphs with substantial technical content.",
    "recommendations": "Write detailed recommendations with dark humor about what humanity should do about this asteroid. Use long, flowing sentences that build upon each other and create a compelling narrative. Include both serious and humorous suggestions, discuss various scenarios, and provide comprehensive advice. Write at least 2-3 long paragraphs with substantial recommendations. Then add: 'If this asteroid hits us, the best last song to play before the world ends would be: [Song Name] by [Artist] - [YouTube link to the song]'"
}

IMPORTANT: 
- Return ONLY valid JSON, no additional text or markdown
- Be creative and diverse with song choices! Don't always pick obvious "end of the world" songs
- Consider different genres, moods, and themes
- Use dark humor throughout but keep it educational and accurate
- Make it engaging for non-scientists
- Be witty and sarcastic in your explanations
- Write LONG, DETAILED sentences and paragraphs
- Use narrative, flowing writing style
- Make each sentence substantial and informative
- Write in a conversational, engaging tone
- Use multi-paragraph responses where appropriate
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert astronomer with a dark sense of humor. 
              Explain complex asteroid data in simple, engaging terms with witty 
              sarcasm and dark humor. Be accurate, educational, and entertaining. 
              Provide detailed, comprehensive responses that are engaging and informative.
              Always respond with valid JSON only.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 6000,
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
    try {
      const parsed = JSON.parse(response);

      const validated = AIResponseSchema.parse(parsed);

      return {
        summary: validated.summary,
        riskAssessment: validated.riskAssessment,
        interestingFacts: validated.interestingFacts,
        technicalDetails: validated.technicalDetails,
        recommendations: validated.recommendations,
      };
    } catch (error) {
      console.error("AI response parsing failed:", error);
      return this.getDefaultAnalysis();
    }
  },

  getDefaultAnalysis(): AsteroidAnalysis {
    return {
      summary: "AI analysis temporarily unavailable",
      riskAssessment: "Risk assessment unavailable",
      interestingFacts: [],
      technicalDetails: "Technical details unavailable",
      recommendations: "No specific recommendations",
    };
  },
};
