export type GrainCategory = 'grain' | 'legume';

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
}

export interface Protein {
  id: string;
  name: string;
  category: 'meat' | 'poultry' | 'veg';
  fryTimeMin: number;
  gramsPerServing: number;
  isCustom?: boolean;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit: string;
  notes?: string;
}

export interface RecipeStep {
  title: string;
  description: string;
  timeMin?: number;
  alertType?: 'info' | 'warning' | 'timer' | 'success';
}

export interface GeneratedRecipe {
  title: string;
  servings: number;
  totalGrainWeightGrams: number;
  totalWaterMl: number;
  totalCookTimeMin: number;
  grainsUsed: { grain: Grain; weightGrams: number; waterMl: number }[];
  proteinUsed: { protein: Protein; weightGrams: number };
  ingredients: {
    protein: RecipeIngredient;
    grains: RecipeIngredient[];
    vegetables: RecipeIngredient[];
    liquidsAndSpices: RecipeIngredient[];
  };
  soakingWarnings: string[];
  steps: RecipeStep[];
}
