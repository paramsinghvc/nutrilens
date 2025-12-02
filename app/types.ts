export type MicroAmount = 'Low' | 'Moderate' | 'High';

export interface NutritionResponse {
  error: string | null;
  identifiedFoodItems: string[];
  estimatedPortionSize: {
    itemName: string;
    itemSize: string;
  }[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  micronutrients: {
    'Vitamin A': { category: MicroAmount; amount: string; note: string };
    'Vitamin B': { category: MicroAmount; amount: string; note: string };
    'Vitamin C': { category: MicroAmount; amount: string; note: string };
    'Vitamin D': { category: MicroAmount; amount: string; note: string };
    'Vitamin E': { category: MicroAmount; amount: string; note: string };
    'Vitamin K': { category: MicroAmount; amount: string; note: string };
    Calcium: { category: MicroAmount; amount: string; note: string };
    Iron: { category: MicroAmount; amount: string; note: string };
    Magnesium: { category: MicroAmount; amount: string; note: string };
    Sodium: { category: MicroAmount; amount: string; note: string };
    Potassium: { category: MicroAmount; amount: string; note: string };
    Zinc: { category: MicroAmount; amount: string; note: string };
  };
  health_notes: string[];
  healthier_suggestions: string[];
}
