import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  ChefHat,
  ArrowRight,
  ShoppingCart,
  Check,
} from 'lucide-react';
import { Recipe, RecipeMatchResult } from '../types';

interface CanIMakeThisProps {
  matches: RecipeMatchResult[];
  onSelectRecipe: (recipe: Recipe) => void;
  onAddMissingToGrocery: (items: string[], recipeTitle: string) => void;
  groceryItemNames: Set<string>;
  onNavigateToPantry: () => void;
}

export const CanIMakeThis: React.FC<CanIMakeThisProps> = ({
  matches,
  onSelectRecipe,
  onAddMissingToGrocery,
  groceryItemNames,
  onNavigateToPantry,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'ready' | 'almost'>('ready');

  // Categorize matches
  const readyMatches = useMemo(() => matches.filter((m) => m.canMake), [matches]);
  const almostMatches = useMemo(
    () => matches.filter((m) => m.almostCanMake && !m.canMake),
    [matches]
  );
  const allRanked = useMemo(
    () => [...matches].sort((a, b) => b.matchScore - a.matchScore),
    [matches]
  );

  const displayedList = useMemo(() => {
    switch (filterMode) {
      case 'ready':
        return readyMatches;
      case 'almost':
        return almostMatches;
      case 'all':
      default:
        return allRanked;
    }
  }, [filterMode, readyMatches, almostMatches, allRanked]);

  const [addedRecipeIds, setAddedRecipeIds] = useState<Set<string>>(new Set());

  const handleAddMissing = (e: React.MouseEvent, match: RecipeMatchResult) => {
    e.stopPropagation();
    onAddMissingToGrocery(match.missingIngredients, match.recipe.title);
    setAddedRecipeIds((prev) => new Set(prev).add(match.recipe.id));
  };

  return (
    <div className="space-y-5">
      {/* Hero Overview */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
                Pantry Match Engine
              </span>
              <span className="text-xs text-stone-300">·</span>
              <span className="text-xs text-stone-500 font-medium">Real-Time Inventory Match</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              Can I Make This?
            </h2>
          </div>

          <button
            onClick={onNavigateToPantry}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-4 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Update Available Ingredients</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-2 p-1 bg-stone-100/90 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => setFilterMode('ready')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              filterMode === 'ready'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready to Cook Now ({readyMatches.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('almost')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              filterMode === 'almost'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Missing 1-2 Items ({almostMatches.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('all')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              filterMode === 'all'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All 30+ Recipes Ranked</span>
          </button>
        </div>
      </div>

      {/* Recipe Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedList.map((match) => {
          const { recipe, matchScore, missingIngredients, canMake } = match;
          const hasAdded = addedRecipeIds.has(recipe.id);

          return (
            <div
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Header with Title and Match Score */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                      <span>{recipe.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-serif italic text-stone-600">{recipe.urduTitle}</span>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-stone-900 group-hover:text-emerald-800 transition-colors font-serif leading-snug">
                      {recipe.title}
                    </h3>
                  </div>

                  {/* Match Score Indicator */}
                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 ${
                      canMake
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : matchScore >= 75
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {canMake ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    )}
                    <span>{matchScore}% Match</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Missing Ingredients Alert if not 100% */}
                {!canMake && missingIngredients.length > 0 && (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-amber-900">
                      <span>Missing ({missingIngredients.length}):</span>
                      <button
                        onClick={(e) => handleAddMissing(e, match)}
                        className="text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-1 cursor-pointer"
                      >
                        {hasAdded ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span className="text-emerald-800 font-semibold">Added to List</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3" />
                            <span>Add Missing to Grocery</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-amber-800 font-medium">
                      {missingIngredients.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-white/90 px-2 py-0.5 rounded border border-amber-200/70"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Zero-Waste Chef Tip Snippet */}
                <div className="text-[11px] text-emerald-800 bg-emerald-50/60 rounded-lg p-2 border border-emerald-100/70 flex items-start gap-1.5">
                  <ChefHat className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-700" />
                  <span className="line-clamp-1 italic">
                    <strong className="font-semibold not-italic">Zero-Waste Tip:</strong>{' '}
                    {recipe.zeroWasteTip}
                  </span>
                </div>
              </div>

              {/* Card Footer: Metadata and Action */}
              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{recipe.prepTime + recipe.cookTime} mins</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{recipe.difficulty}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-emerald-800 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>View Recipe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayedList.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800 font-serif">
            No recipes matching this criteria yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try checking a few more common ingredients in your Pantry Tracker to unlock delicious meals!
          </p>
          <button
            onClick={onNavigateToPantry}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-800 text-white"
          >
            Go to Pantry Tracker
          </button>
        </div>
      )}
    </div>
  );
};
