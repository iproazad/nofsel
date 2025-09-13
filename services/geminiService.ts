import { GoogleGenAI } from "@google/genai";

// This is a placeholder for a rate-limited, demo-purpose API key.
// In a real-world scenario, this would be managed and secured on a backend proxy.
const DEMO_API_KEY = "YOUR_DEMO_API_KEY_HERE"; // This key would be provisioned for the demo experience.

export const generateLogosApi = async (prompt: string, apiKey?: string): Promise<string[]> => {
  const effectiveApiKey = apiKey || DEMO_API_KEY;
  
  // Basic validation to guide the user in a real scenario.
  if (!effectiveApiKey || effectiveApiKey === "YOUR_DEMO_API_KEY_HERE") {
     throw new Error("The demo API key is not configured. Please provide your own API key to proceed.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
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
        if (error.message.includes('API key not valid')) {
             throw new Error('The provided API Key is not valid. Please check it and try again.');
        }
        if (error.message.includes('only accessible to billed users')) {
            throw new Error('This feature requires a Google Cloud project with billing enabled. Please set up a billing account for the project associated with your API key.');
        }
        if (error.message.includes('quota')) {
            throw new Error('The daily free limit for the demo has been reached. Please try again tomorrow or enter your own API key to continue.');
        }
        throw new Error(`Failed to generate logos: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating logos.");
  }
};