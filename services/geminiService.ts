
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, CustomizationOptions, AiAnalysisResult } from "../types";

export const analyzeOrderRisk = async (
  item: MenuItem,
  customization: CustomizationOptions
): Promise<AiAnalysisResult> => {
  // Always initialize with the current process.env.API_KEY
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("Gemini API Key is missing. Please set API_KEY environment variable.");
    return {
      safe: true,
      message: "Safety verification skipped (API Key missing). Your notes are saved.",
      kitchenTicketSummary: `NOTES: ${customization.allergyNotes} ${customization.specialRequests}`
    };
  }

  // Fix: Initializing GoogleGenAI client using the named parameter apiKey from process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert Head Chef and Food Safety Officer.
    Review the following order for potential conflicts between the Menu Item and the Customer's Customizations (especially allergies and dietary restrictions).

    Menu Item: ${item.name}
    Description: ${item.description}
    Ingredients/Tags: ${item.tags.join(', ')}

    Customer Customization:
    - Low Salt: ${customization.lowSalt}
    - Low Sugar: ${customization.lowSugar}
    - Spice Level (0-4): ${customization.spiceLevel}
    - Allergy Notes: "${customization.allergyNotes}"
    - Special Requests: "${customization.specialRequests}"

    Task 1: Determine if there is a conflict (e.g., user is allergic to nuts but item contains nuts, or user wants vegan but item is meat-heavy and cannot be made vegan easily).
    Task 2: Create a concise "Kitchen Ticket" string that highlights the modifications in bold, standardized kitchen shorthand.

    Return JSON.
  `;

  try {
    // Fix: Using gemini-3-flash-preview for a basic text reasoning task as per model selection rules
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: { type: Type.BOOLEAN, description: "True if the order seems safe and possible, False if there is a major conflict." },
            message: { type: Type.STRING, description: "A friendly message to the customer explaining the conflict or confirming the special request." },
            kitchenTicketSummary: { type: Type.STRING, description: "Concise, professional kitchen instructions (e.g., 'NO SALT, ALLERGY: PEANUT')." }
          },
          required: ["safe", "message", "kitchenTicketSummary"]
        }
      }
    });

    // Fix: Extracting generated text using the .text property directly, following the correct extraction method
    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    return JSON.parse(resultText) as AiAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      safe: true,
      message: "Could not verify with AI, but your notes have been saved.",
      kitchenTicketSummary: `NOTES: ${customization.allergyNotes} ${customization.specialRequests}`
    };
  }
};
