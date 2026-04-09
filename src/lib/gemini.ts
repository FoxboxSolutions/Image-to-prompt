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
  const prompt = `${SYSTEM_PROMPTS[preset]} The output must be in ${language}. Generate an optimized AI image prompt based on this image.`;

  try {
    const response = await fetch("/api/ai/llava", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageData,
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate prompt");
    }

    const result = await response.json();
    
    // Cloudflare LLaVA response structure is usually { result: { description: "..." } } or similar
    // Based on the user's snippet, it returns the model response directly.
    // Usually it's { result: { description: "..." } } or { result: "..." }
    return result.result?.description || result.result || "No description generated.";
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}
