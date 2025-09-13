
import { GoogleGenAI } from "@google/genai";

// WARNING: Storing your API key directly in the frontend code is insecure and can expose your key to anyone visiting your website.
// This can lead to unauthorized use and potential charges to your account.
// It is strongly recommended to use a backend proxy or serverless function to protect your API key.
const API_KEY = 'AIzaSyBqqErQiQ6SN55T4FBssvQTRws_p5bp_lI';

/**
 * Generates a logo image using the Gemini API with a hardcoded API key.
 * @param prompt The text prompt describing the desired logo.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export const generateLogoImage = async (prompt: string): Promise<string> => {
  if (API_KEY === 'AIzaSyBqqErQiQ6SN55T4FBssvQTRws_p5bp_lI' || !API_KEY) {
    throw new Error("Please replace 'GEMINI_API_KEY' with your actual API key in services/geminiService.ts");
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

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
    
    throw new Error('No image was generated. The response might have been blocked due to safety policies.');

  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error('The API key is not valid. Please check it in services/geminiService.ts.');
    }
    throw new Error('Failed to generate logo. This could be due to an invalid API key, safety policies, or an invalid prompt.');
  }
};
