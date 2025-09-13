
import { GoogleGenAI } from "@google/genai";

// Lazily initialize the AI client to prevent app crash on load if API key is not set.
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
};


export const generateLogosApi = async (prompt: string): Promise<string[]> => {
  try {
    const client = getAiClient();
    const response = await client.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 4,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("The API did not return any images.");
    }
    
    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
  } catch (error) {
    console.error("Error generating images with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate logos: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating logos.");
  }
};
