import * as fs from 'fs';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const microAmount = z.enum(['Low', 'Moderate', 'High']);
const microNutrient = z.object({
  category: microAmount,
  note: z.string(),
  amount: z.string(),
});

const nutritionResponse = z.object({
  error: z.nullable(z.string()),
  identifiedFoodItems: z.array(z.string()),
  estimatedPortionSize: z.array(
    z.object({
      itemName: z.string(),
      itemSize: z.string(),
    })
  ),
  macros: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fats: z.number(),
    fiber: z.number(),
  }),
  micronutrients: z.object({
    'Vitamin A': microNutrient,
    'Vitamin B': microNutrient,
    'Vitamin C': microNutrient,
    'Vitamin D': microNutrient,
    'Vitamin E': microNutrient,
    'Vitamin K': microNutrient,
    Calcium: microNutrient,
    Iron: microNutrient,
    Magnesium: microNutrient,
    Sodium: microNutrient,
    Potassium: microNutrient,
    Zinc: microNutrient,
  }),
  health_notes: z.array(z.string()),
  healthier_suggestions: z.array(z.string()),
});

export class AIService {
  static createFile = async (file: File) => {
    const result = await client.files.create({
      file,
      purpose: 'vision',
    });
    return result.id;
  };

  static analyseFood = async (file: File) => {
    const fileId = await this.createFile(file);
    const response = await client.responses.create({
      model: 'gpt-5-nano',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `You are a Nutrition Coach AI for a mobile fitness app.

										Analyze the uploaded food image and return structured JSON following the schema exactly.

										Your purpose: give quick, practical, meal-time guidance that users can easily apply.

										### Output Rules
										1. If **no recognizable food or meal** is detected, respond with: 
											"No food detected. Please upload a clear photo of a meal."
											in the error field and nothing else.
										2. If food is detected:
											- "identifiedFoodItems": list simple item names (no long descriptions)
											- "estimatedPortionSize": for each item, include only grams (no cups/spoons)
											- "macros": concise numeric values with units
													- calories (kcal)
													- protein (g)
													- carbs (g)
													- fats (g)
													- fiber (g)
											- "micronutrients": each vitamin/mineral has:
													- "category": "Low" | "Moderate" | "High"
													- "amount": number with units
													- "note": one short benefit or meaning (≤10 words)
											- "health_notes": 2-3 short, friendly, encouraging insights, starting with emojis (≤12 words each)
													- Example: "High in fiber — helps with fullness."
											- "healthier_suggestions": 2-3 quick, practical meal-time suggestions, starting with emojis
													- Example: "Add a handful of salad for balance."
										3. Use everyday tone — simple, friendly, and useful.
										4. Avoid technical, medical, or long text.
										5. Return **only valid JSON**, no markdown or explanations.`,
            },
            { type: 'input_image', file_id: fileId, detail: 'auto' },
          ],
        },
      ],
      text: {
        format: zodTextFormat(nutritionResponse, 'nutritionResponse'),
      },
    });
    console.log(response);
    return response;
  };
}
