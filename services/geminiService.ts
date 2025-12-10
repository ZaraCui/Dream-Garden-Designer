import { GoogleGenAI, Type } from "@google/genai";
import { GardenPreferences, GardenPlan, SearchSource } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a structured JSON plan for the garden based on user preferences.
 * Uses Google Search Grounding to find real-world resources.
 */
export const generateGardenPlan = async (prefs: GardenPreferences): Promise<GardenPlan> => {
  const prompt = `Create a detailed garden plan for a ${prefs.size} garden in ${prefs.style} style. 
  The sunlight condition is ${prefs.sunlight}. 
  ${prefs.hardinessZone ? `Hardiness Zone: ${prefs.hardinessZone}.` : ''}
  ${prefs.colors ? `Preferred Colors: ${prefs.colors}.` : ''}
  ${prefs.extraNotes ? `Additional Notes: ${prefs.extraNotes}` : ''}
  
  Provide a catchy title, a general description, a list of 5 suitable plants with care levels, and 3 layout tips.

  IMPORTANT: Return the response strictly as a valid JSON object. Do not use Markdown formatting or code blocks.
  The JSON must match this structure exactly:
  {
    "title": "string",
    "description": "string",
    "plants": [
      { "name": "string", "description": "string", "careLevel": "Easy" | "Moderate" | "Difficult" }
    ],
    "layoutTips": ["string"]
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      // We use the googleSearch tool to get real web pages related to the garden
      tools: [{ googleSearch: {} }],
      // responseMimeType and responseSchema are NOT allowed when using googleSearch, 
      // so we rely on the prompt to get JSON.
    }
  });

  const text = response.text;
  if (!text) throw new Error("No plan generated");

  // Clean the text to ensure it's valid JSON (sometimes models add markdown blocks despite instructions)
  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  
  let plan: GardenPlan;
  try {
    plan = JSON.parse(cleanJson) as GardenPlan;
  } catch (e) {
    console.error("Failed to parse JSON", cleanJson);
    throw new Error("Failed to generate a valid plan format. Please try again.");
  }

  // Extract grounding metadata (search results)
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const searchSources: SearchSource[] = [];

  for (const chunk of chunks) {
    if (chunk.web?.uri && chunk.web?.title) {
      searchSources.push({
        title: chunk.web.title,
        uri: chunk.web.uri
      });
    }
  }

  plan.searchSources = searchSources;
  return plan;
};

/**
 * Generates the initial visualization of the garden.
 */
export const generateGardenVisual = async (prefs: GardenPreferences): Promise<string> => {
  const prompt = `Photorealistic top-down or slight perspective view of a beautiful ${prefs.style} garden. 
  Size: ${prefs.size}. Lighting: ${prefs.sunlight}. 
  Features: lush plants, distinct pathways, designed for ${prefs.style} aesthetics. 
  ${prefs.colors ? `Color palette: ${prefs.colors}` : 'Harmonious colors'}.
  High quality, architectural rendering, detailed textures.`;

  // Using gemini-2.5-flash-image (Nano Banana) for generation as requested for the app's power
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      // imageConfig is not strictly needed for 2.5 flash image in simple mode, but we can rely on defaults
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

/**
 * Edits an existing garden visualization based on a user text prompt.
 * Uses Gemini 2.5 Flash Image.
 */
export const editGardenVisual = async (currentImageBase64: string, editPrompt: string): Promise<string> => {
  // Strip prefix if present for the API call (though the SDK handles some formats, it's safer to send clean base64 if constructing manually, 
  // but here we use the inlineData object which expects raw base64 usually, or we can pass the full string if we parse it).
  // The SDK helper `inlineData` expects the raw base64 data string (without "data:image/png;base64,").
  
  const base64Data = currentImageBase64.split(',')[1];
  const mimeType = currentImageBase64.split(';')[0].split(':')[1];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        {
          text: `Edit this garden image: ${editPrompt}. Maintain the same perspective and general layout unless asked to change.`
        }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image generated");
};
