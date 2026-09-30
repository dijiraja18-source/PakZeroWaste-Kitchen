import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  Flame,
  Bookmark,
  Sparkles,
  Users,
  Utensils,
  Leaf,
  CheckCircle2,
  ChefHat,
} from 'lucide-react';
import { Recipe, RecipeCategory, Difficulty, RecipeMatchResult } from '../types';

interface RecipeBrowserProps {
  recipes: Recipe[];
  matchResults: Map<string, RecipeMatchResult>;
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const CATEGORIES: RecipeCategory[] = [
  'All',
  'Rice & Biryani',
  'Curries & Karahi',
  'BBQ & Kebabs',
  'Vegetarian & Pulses',
  'Breakfast & Breads',
  'Desserts & Sweets',
];

export const RecipeBrowser: React.FC<RecipeBrowserProps> = ({
  recipes,
  matchResults,
  favoriteIds,
  onToggleFavorite,
  onSelectRecipe,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Vegetarian' | 'Non-Veg'>('All');
  const [maxTimeFilter, setMaxTimeFilter] = useState<number | null>(null); // null = any

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Category filter
      if (selectedCategory !== 'All' && recipe.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (difficultyFilter !== 'All' && recipe.difficulty !== difficultyFilter) {
        return false;
      }

      // Dietary filter
      if (dietaryFilter !== 'All' && recipe.dietary !== dietaryFilter) {
        return false;
      }

      // Max time filter
      if (maxTimeFilter !== null) {
        const totalTime = recipe.prepTime + recipe.cookTime;
        if (totalTime > maxTimeFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(q);
        const matchesUrdu = recipe.urduTitle.toLowerCase().includes(q);
        const matchesDesc = recipe.description.toLowerCase().includes(q);
        const matchesIngredient = recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesUrdu && !matchesDesc && !matchesIngredient) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, selectedCategory, difficultyFilter, dietaryFilter, maxTimeFilter, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Search and Secondary Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 33 authentic recipes, ingredients (e.g. mutton, nihari, lentils)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
            />
          </div>

          {/* Quick Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="px-2.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={dietaryFilter}
              onChange={(e) => setDietaryFilter(e.target.value as any)}
              className="px-2.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none"
            >
              <option value="All">All Diets</option>
              <option value="Vegetarian">Vegetarian Only</option>
              <option value="Non-Veg">Meat & Poultry</option>
            </select>

            <select
              value={maxTimeFilter === null ? 'All' : String(maxTimeFilter)}
              onChange={(e) =>
                setMaxTimeFilter(e.target.value === 'All' ? null : Number(e.target.value))
              }
              className="px-2.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none"
            >
              <option value="All">Any Duration</option>
              <option value="30">≤ 30 mins (Quick)</option>
              <option value="60">≤ 60 mins</option>
              <option value="120">≤ 2 hours</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipes Counter */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>Showing {filteredRecipes.length} traditional Pakistani recipes</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-emerald-700 hover:underline font-medium"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => {
          const isFav = favoriteIds.has(recipe.id);
          const match = matchResults.get(recipe.id);
          const canMake = match?.canMake;
          const matchScore = match?.matchScore ?? 0;

          return (
            <div
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Header Banner Strip with Category & Favorite */}
                <div className="p-4 pb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                      <span>{recipe.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-serif italic text-stone-600 truncate">
                        {recipe.urduTitle}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors font-serif leading-snug">
                      {recipe.title}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(recipe.id);
                    }}
                    title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                    className={`p-2 rounded-xl border transition-colors shrink-0 ${
                      isFav
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isFav ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Description */}
                <p className="px-4 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Pantry Readiness Chip */}
                <div className="px-4 pt-3">
                  {canMake ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Ready to cook with pantry items!</span>
                    </div>
                  ) : match && matchScore > 0 ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{matchScore}% pantry match</span>
                      {match.missingIngredients.length > 0 && (
                        <span className="text-stone-500">
                          (missing {match.missingIngredients.length})
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Zero-Waste Chef Tip Preview */}
                <div className="px-4 pt-3">
                  <div className="text-[11px] text-emerald-900 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/60 line-clamp-1 italic">
                    <strong className="font-semibold not-italic">Chef Tip:</strong> {recipe.zeroWasteTip}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{recipe.prepTime + recipe.cookTime}m</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{recipe.difficulty}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>{recipe.servings}</span>
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-emerald-800 group-hover:underline">
                  Cook Recipe →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
          <Utensils className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800 font-serif">
            No recipes found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search terms or filters to discover more dishes from our 33 authentic Pakistani recipes.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setDifficultyFilter('All');
              setDietaryFilter('All');
              setMaxTimeFilter(null);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-800 text-white"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
