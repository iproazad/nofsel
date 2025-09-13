import { GoogleGenAI } from "@google/genai";

export const generateLogosApi = async (prompt: string, apiKey: string): Promise<string[]> => {
  if (!apiKey) {
    throw new Error("Gemini API Key is required.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateImages({
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
        // Provide a more specific error message for authentication failures.
        if (error.message.includes('API key not valid')) {
             throw new Error('Failed to generate logos: The provided API Key is not valid. Please check and try again.');
        }
        throw new Error(`Failed to generate logos: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating logos.");
  }
};
