import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI with the key from environment
// The skill says to use process.env.GEMINI_API_KEY for React (Vite)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ClassificationResult {
  isSpam: boolean;
  confidence: number;
  reasoning: string;
  importantFeatures: string[];
  metrics: {
    length: number;
    linksCount: number;
    specialCharsCount: number;
  };
  probabilityDistribution: {
    spam: number;
    ham: number;
  };
}

export async function classifyEmail(text: string): Promise<ClassificationResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Classify the following email text as Spam or Ham. 
Analyze factors like:
1. Presence of urgency/threats
2. Suspicious links or attachments
3. Grammar and formatting issues
4. Common spam keywords
5. Sender patterns

Return the analysis in a structured JSON format.

Email Text:
"""
${text}
"""`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSpam: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER, description: "Range 0.0 to 1.0" },
            reasoning: { type: Type.STRING, description: "Detailed explanation of why it was classified this way" },
            importantFeatures: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Specific phrases or markers that triggered the classification" 
            },
            metrics: {
              type: Type.OBJECT,
              properties: {
                length: { type: Type.INTEGER },
                linksCount: { type: Type.INTEGER },
                specialCharsCount: { type: Type.INTEGER }
              },
              required: ["length", "linksCount", "specialCharsCount"]
            },
            probabilityDistribution: {
               type: Type.OBJECT,
               properties: {
                 spam: { type: Type.NUMBER },
                 ham: { type: Type.NUMBER }
               },
               required: ["spam", "ham"]
            }
          },
          required: ["isSpam", "confidence", "reasoning", "importantFeatures", "metrics", "probabilityDistribution"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as ClassificationResult;
  } catch (error) {
    console.error("Classification Error:", error);
    throw error;
  }
}
