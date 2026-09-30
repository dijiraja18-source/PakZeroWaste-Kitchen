import React, { useState } from 'react';
import {
  Bookmark,
  ShoppingCart,
  Trash2,
  Plus,
  Check,
  Share2,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Recipe, GroceryItem } from '../types';

interface FavoritesAndGroceriesProps {
  favorites: Recipe[];
  groceryList: GroceryItem[];
  onToggleFavorite: (id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleGroceryItem: (id: string) => void;
  onAddGroceryItem: (name: string) => void;
  onRemoveGroceryItem: (id: string) => void;
  onClearCheckedGroceries: () => void;
}

export const FavoritesAndGroceries: React.FC<FavoritesAndGroceriesProps> = ({
  favorites,
  groceryList,
  onToggleFavorite,
  onSelectRecipe,
  onToggleGroceryItem,
  onAddGroceryItem,
  onRemoveGroceryItem,
  onClearCheckedGroceries,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'groceries'>('favorites');
  const [newItemName, setNewItemName] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleAddGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddGroceryItem(newItemName.trim());
    setNewItemName('');
  };

  const copyGroceryList = () => {
    if (groceryList.length === 0) return;
    const text = `🛒 PakZeroWaste Kitchen - Shopping List:\n` +
      groceryList
        .map((item) => `[${item.checked ? 'x' : ' '}] ${item.name}${item.recipeTitle ? ` (for ${item.recipeTitle})` : ''}`)
        .join('\n');

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Top Segmented Tab Switcher */}
      <div className="flex items-center gap-2 p-1 bg-stone-100/90 rounded-2xl border border-stone-200 text-xs">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Bookmark className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Favorite Recipes ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('groceries')}
          className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'groceries'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-emerald-700" />
          <span>Grocery Checklist ({groceryList.filter((g) => !g.checked).length})</span>
        </button>
      </div>

      {/* Tab 1: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => onSelectRecipe(recipe)}
                  className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <span>{recipe.category}</span>
                          <span>·</span>
                          <span className="font-serif italic text-stone-600">
                            {recipe.urduTitle}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors font-serif mt-0.5">
                          {recipe.title}
                        </h3>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(recipe.id);
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        title="Remove from favorites"
                      >
                        <Bookmark className="w-4 h-4 fill-rose-500" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
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
                    </div>

                    <span className="text-emerald-800 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Cook</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-6 space-y-3">
              <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800 font-serif">
                No favorite recipes bookmarked yet
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Tap the bookmark icon on any Pakistani recipe to save it here for instant offline access.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Grocery Checklist */}
      {activeTab === 'groceries' && (
        <div className="space-y-4">
          {/* Header Action Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-bold text-stone-900 font-serif text-base">
                  Smart Missing Items Checklist
                </h3>
                <p className="text-xs text-stone-500">
                  Items automatically gathered when you tap "Add Missing to Grocery" in recipe matches.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyGroceryList}
                  disabled={groceryList.length === 0}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedNotification ? 'Copied to Clipboard!' : 'Share / Copy List'}</span>
                </button>

                {groceryList.some((g) => g.checked) && (
                  <button
                    onClick={onClearCheckedGroceries}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-stone-500" />
                    <span>Clear Checked</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddGrocery} className="flex items-center gap-2 pt-2 border-t">
              <input
                type="text"
                placeholder="Add missing ingredient to shopping list..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Grocery Items List */}
          {groceryList.length > 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 shadow-xs overflow-hidden">
              {groceryList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleGroceryItem(item.id)}
                  className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                    item.checked ? 'bg-stone-50/80 text-stone-400' : 'hover:bg-emerald-50/30 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                        item.checked
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'border-stone-300 bg-stone-50 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>

                    <div className="min-w-0">
                      <span
                        className={`text-xs sm:text-sm font-semibold truncate block ${
                          item.checked ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {item.name}
                      </span>
                      {item.recipeTitle && (
                        <span className="text-[11px] text-stone-400 font-medium truncate block">
                          for {item.recipeTitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveGroceryItem(item.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-6 space-y-3">
              <ShoppingCart className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800 font-serif">
                Your shopping checklist is empty
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                When you check a recipe in "Can I Make This?", any missing items can be added here with one single tap.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
