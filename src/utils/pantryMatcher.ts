import { Recipe, RecipeMatchResult } from '../types';

export interface MatchOptions {
  assumeCommonStaples?: boolean;
}

// Common staples usually assumed present in most Pakistani households
export const COMMON_STAPLE_IDS = new Set([
  'salt',
  'oil',
  'red_chili_powder',
  'turmeric',
  'coriander_powder',
  'cumin_seeds',
  'garam_masala',
  'wheat_flour',
  'sugar'
]);

export function calculateRecipeMatches(
  recipes: Recipe[],
  selectedPantryItemIds: string[],
  options: MatchOptions = { assumeCommonStaples: true }
): RecipeMatchResult[] {
  const selectedSet = new Set(selectedPantryItemIds);

  return recipes.map((recipe) => {
    const totalIngredients = recipe.ingredients.length;
    if (totalIngredients === 0) {
      return {
        recipe,
        matchScore: 100,
        matchedIngredients: [],
        missingIngredients: [],
        canMake: true,
        almostCanMake: true,
      };
    }

    const matchedIngredients: string[] = [];
    const missingIngredients: string[] = [];

    recipe.ingredients.forEach((ing) => {
      const isPresent = selectedSet.has(ing.id);
      const isAssumed = options.assumeCommonStaples && COMMON_STAPLE_IDS.has(ing.id);

      if (isPresent || isAssumed) {
        matchedIngredients.push(ing.name);
      } else {
        missingIngredients.push(ing.name);
      }
    });

    const matchScore = Math.round((matchedIngredients.length / totalIngredients) * 100);
    const canMake = missingIngredients.length === 0;
    const almostCanMake = missingIngredients.length > 0 && missingIngredients.length <= 2;

    return {
      recipe,
      matchScore,
      matchedIngredients,
      missingIngredients,
      canMake,
      almostCanMake,
    };
  });
}

export function calculateZeroWasteStats(
  selectedPantryItemIds: string[],
  favoriteRecipeIds: string[]
) {
  // Estimated metrics based on active pantry tracking
  const itemsTracked = selectedPantryItemIds.length;
  // Estimate ~180g food rescued per actively matched pantry meal session
  const gramsSaved = itemsTracked * 240;
  const pkrSaved = Math.round(itemsTracked * 185);
  const co2ePreventedKg = (gramsSaved * 2.5 / 1000).toFixed(1);

  return {
    itemsTracked,
    gramsSaved: (gramsSaved / 1000).toFixed(2), // in kg
    pkrSaved,
    co2ePreventedKg,
    favoritesCount: favoriteRecipeIds.length,
  };
}
