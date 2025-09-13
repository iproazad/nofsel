
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a logo image using the Gemini API.
 * @param prompt The text prompt describing the desired logo.
 * @param apiKey The Gemini API key.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export const generateLogoImage = async (prompt: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please enter it in the application.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png', // Use PNG for better quality and potential transparency
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const image = response.generatedImages[0];
      if (image.image?.imageBytes) {
        return image.image.imageBytes;
      }
    }
    
    throw new Error('No image was generated. The response might have been blocked.');

  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error('The provided API key is not valid. Please double-check it.');
    }
    throw new Error('Failed to generate logo. This could be due to an invalid API key, safety policies, or an invalid prompt.');
  }
};
