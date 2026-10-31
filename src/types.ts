export type GrainCategory = 'grain' | 'legume';

export type CalculationMode = 'servings' | 'by_protein' | 'by_grain';

export type UnitDisplayMode = 'grams' | 'kitchen_units' | 'both';

export type SpiceStyle = 'classic' | 'plov' | 'georgian' | 'herbs';

export interface Grain {
  id: string;
  name: string;
  category: GrainCategory;
  cookTimeMin: number; // minutes of boiling
  waterRatio: number; // e.g. 2.0 = 1 part grain : 2 parts water
  soakRequired: boolean;
  soakHours?: number;
  notes?: string;
  isCustom?: boolean;
  // Nutrition per 100g dry
  caloriesPer100g?: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  carbsPer100g?: number;
  // Grams in 1 standard 250ml glass
  gramsPerGlass?: number;
}

export interface Protein {
  id: string;
  name: string;
  category: 'meat' | 'poultry' | 'veg';
  fryTimeMin: number;
  gramsPerServing: number;
  isCustom?: boolean;
  // Nutrition per 100g raw
  caloriesPer100g?: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  carbsPer100g?: number;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit: string;
  amountKitchenUnits?: string; // e.g. "1 стакан + 2 ст. л."
  amountGrams?: number;
  notes?: string;
}

export interface RecipeStep {
  title: string;
  description: string;
  timeMin?: number;
  alertType?: 'info' | 'warning' | 'timer' | 'success';
}

export interface NutritionInfo {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  perServingCalories: number;
  perServingProtein: number;
  perServingFat: number;
  perServingCarbs: number;
}

export interface GeneratedRecipe {
  id: string;
  title: string;
  calculationMode: CalculationMode;
  targetInputWeight?: number;
  servings: number;
  totalGrainWeightGrams: number;
  totalWaterMl: number;
  totalCookTimeMin: number;
  spiceStyle: SpiceStyle;
  grainsUsed: { grain: Grain; weightGrams: number; waterMl: number; kitchenMeasure: string }[];
  proteinUsed: { protein: Protein; weightGrams: number };
  ingredients: {
    protein: RecipeIngredient;
    grains: RecipeIngredient[];
    vegetables: RecipeIngredient[];
    liquidsAndSpices: RecipeIngredient[];
  };
  soakingWarnings: string[];
  nutrition: NutritionInfo;
  steps: RecipeStep[];
}

export interface FavoriteRecipe {
  id: string;
  title: string;
  createdAt: string;
  proteinId: string;
  grainIds: string[];
  servings: number;
  calculationMode: CalculationMode;
  targetInputWeight?: number;
  spiceStyle: SpiceStyle;
  rating?: number;
  userNotes?: string;
}
