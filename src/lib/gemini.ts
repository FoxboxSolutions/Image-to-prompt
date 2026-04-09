import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type ModelPreset = "Midjourney" | "Flux" | "Stable Diffusion" | "General";

const SYSTEM_PROMPTS: Record<ModelPreset, string> = {
  Midjourney: "You are an expert Midjourney prompt engineer. Analyze the image and generate a highly detailed, artistic Midjourney prompt. Include artistic styles, lighting, camera settings, and Midjourney specific parameters like --v 6.0, --ar 16:9 if appropriate. Focus on aesthetics and mood.",
  Flux: "You are an expert Flux prompt engineer. Analyze the image and generate a precise, descriptive prompt optimized for Flux. Focus on realistic details, textures, and composition. Avoid overly flowery language, be direct and descriptive.",
  "Stable Diffusion": "You are an expert Stable Diffusion prompt engineer. Analyze the image and generate a prompt using keywords and weights (e.g., (masterpiece:1.2), high quality, detailed). Include negative prompt suggestions if possible. Focus on technical tags and stylistic keywords.",
  General: "Analyze the image and provide a comprehensive, descriptive prompt that captures all key elements, colors, mood, and composition for any AI image generator."
};

export async function generatePrompt(
  imageData: string, // base64
  mimeType: string,
  preset: ModelPreset,
  language: string = "English"
) {
  const systemInstruction = `${SYSTEM_PROMPTS[preset]} The output must be in ${language}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: imageData.split(",")[1], // Remove prefix
              mimeType: mimeType,
            },
          },
          {
            text: "Generate an optimized AI image prompt based on this image.",
          },
        ],
      },
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
