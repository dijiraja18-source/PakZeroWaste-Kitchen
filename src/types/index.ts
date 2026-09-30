export type PantryCategory = 'vegetables' | 'meats' | 'dairy' | 'staples';

export type RecipeCategory =
  | 'All'
  | 'Rice & Biryani'
  | 'Curries & Karahi'
  | 'BBQ & Kebabs'
  | 'Vegetarian & Pulses'
  | 'Breakfast & Breads'
  | 'Desserts & Sweets';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy';

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  category: PantryCategory;
  isStaple?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  urduTitle: string;
  category: RecipeCategory;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  difficulty: Difficulty;
  servings: number;
  spiceLevel: SpiceLevel;
  ingredients: RecipeIngredient[];
  instructions: string[];
  zeroWasteTip: string;
  description: string;
  dietary: 'Non-Veg' | 'Vegetarian';
}

export interface PantryItem {
  id: string;
  name: string;
  urduName?: string;
  category: PantryCategory;
  isDefaultStaple?: boolean;
  isCustom?: boolean;
  shelfLifeDays?: number;
}

export interface RecipeMatchResult {
  recipe: Recipe;
  matchScore: number; // 0 to 100
  matchedIngredients: string[];
  missingIngredients: string[];
  canMake: boolean; // 100% match
  almostCanMake: boolean; // missing <= 2 items
}

export interface GroceryItem {
  id: string;
  name: string;
  category?: string;
  checked: boolean;
  recipeTitle?: string;
}
