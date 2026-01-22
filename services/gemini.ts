
import { GoogleGenAI, Type } from "@google/genai";

// Use environment variable injected via Vite build
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getDiscoverTopics = async (): Promise<string[]> => {
  try {
    if (!API_KEY) {
        console.warn("Gemini API Key is missing.");
        return [];
    }
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'List 12 trending and popular video categories for a modern social video platform (e.g. Music, Tech, Gaming, Vlog, Comedy, etc). Return concise one or two word titles.',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    // safe parsing
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to fetch AI topics:", error);
    return [];
  }
};

export const getVideoTopics = async (videoTitle: string): Promise<string[]> => {
  try {
    if (!API_KEY) return [];
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 8 short, engaging, and relevant tags or topic keywords for a video titled "${videoTitle}".`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to fetch AI video topics:", error);
    return [];
  }
};
