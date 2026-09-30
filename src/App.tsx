import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  BookOpen,
  Leaf,
  Bookmark,
  Code,
  Carrot,
} from 'lucide-react';
import { Header } from './components/Header';
import { PantryTracker } from './components/PantryTracker';
import { CanIMakeThis } from './components/CanIMakeThis';
import { RecipeBrowser } from './components/RecipeBrowser';
import { ZeroWasteHub } from './components/ZeroWasteHub';
import { FavoritesAndGroceries } from './components/FavoritesAndGroceries';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';
import { RecipeDetailModal } from './components/RecipeDetailModal';

import { PAKISTANI_RECIPES } from './data/recipesData';
import { INITIAL_PANTRY_ITEMS } from './data/pantryData';
import { StorageService, DEFAULT_INITIAL_PANTRY_IDS } from './services/storageService';
import { calculateRecipeMatches } from './utils/pantryMatcher';
import { PantryCategory, PantryItem, Recipe, GroceryItem, RecipeMatchResult } from './types';

// Hero image asset from earlier parallel generation
import culinaryHeroImg from './assets/images/pak_culinary_hero_1790772104406.jpg';

type TabType = 'pantry' | 'matcher' | 'recipes' | 'zerowaste' | 'favorites' | 'flutter';

export default function App() {
  // Offline State from LocalStorage
  const [selectedPantryIds, setSelectedPantryIds] = useState<string[]>(() =>
    StorageService.getSelectedPantryIds()
  );
  const [customItems, setCustomItems] = useState<PantryItem[]>(() =>
    StorageService.getCustomPantryItems()
  );
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    StorageService.getFavoriteIds()
  );
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() =>
    StorageService.getGroceryList()
  );
  const [assumeStaples, setAssumeStaples] = useState<boolean>(() =>
    StorageService.getAssumeStaples()
  );

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<TabType>('matcher');

  // Selected Recipe for Detail Modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Mobile Device Frame Simulator Mode (defaults to true for authentic smartphone feel)
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Combine initial pantry items with custom added items
  const allPantryItems = useMemo(() => {
    return [...INITIAL_PANTRY_ITEMS, ...customItems];
  }, [customItems]);

  // Selected pantry item IDs set for O(1) checks
  const pantryIdsSet = useMemo(() => new Set(selectedPantryIds), [selectedPantryIds]);
  const favoriteIdsSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const groceryItemNamesSet = useMemo(
    () => new Set(groceryList.map((g) => g.name.toLowerCase())),
    [groceryList]
  );

  // Save changes to offline LocalStorage
  useEffect(() => {
    StorageService.saveSelectedPantryIds(selectedPantryIds);
  }, [selectedPantryIds]);

  useEffect(() => {
    StorageService.saveCustomPantryItems(customItems);
  }, [customItems]);

  useEffect(() => {
    StorageService.saveFavoriteIds(favoriteIds);
  }, [favoriteIds]);

  useEffect(() => {
    StorageService.saveGroceryList(groceryList);
  }, [groceryList]);

  useEffect(() => {
    StorageService.saveAssumeStaples(assumeStaples);
  }, [assumeStaples]);

  // Match calculations
  const matchResults: RecipeMatchResult[] = useMemo(() => {
    return calculateRecipeMatches(PAKISTANI_RECIPES, selectedPantryIds, {
      assumeCommonStaples: assumeStaples,
    });
  }, [selectedPantryIds, assumeStaples]);

  // Quick map for RecipeBrowser lookup
  const matchResultsMap = useMemo(() => {
    const map = new Map<string, RecipeMatchResult>();
    matchResults.forEach((m) => map.set(m.recipe.id, m));
    return map;
  }, [matchResults]);

  const readyToCookCount = useMemo(() => {
    return matchResults.filter((m) => m.canMake).length;
  }, [matchResults]);

  // Favorite recipes array
  const favoriteRecipes = useMemo(() => {
    return PAKISTANI_RECIPES.filter((r) => favoriteIdsSet.has(r.id));
  }, [favoriteIdsSet]);

  // Handlers for Pantry
  const handleTogglePantryItem = (id: string) => {
    setSelectedPantryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllCategory = (cat: PantryCategory) => {
    const categoryItemIds = allPantryItems
      .filter((i) => i.category === cat)
      .map((i) => i.id);
    setSelectedPantryIds((prev) => Array.from(new Set([...prev, ...categoryItemIds])));
  };

  const handleClearCategory = (cat: PantryCategory) => {
    const categoryItemIds = new Set(
      allPantryItems.filter((i) => i.category === cat).map((i) => i.id)
    );
    setSelectedPantryIds((prev) => prev.filter((id) => !categoryItemIds.has(id)));
  };

  const handleAddCustomItem = (newItem: Omit<PantryItem, 'id' | 'isCustom'>) => {
    const id = `custom_${Date.now()}`;
    const itemWithId: PantryItem = {
      ...newItem,
      id,
      isCustom: true,
    };
    setCustomItems((prev) => [...prev, itemWithId]);
    setSelectedPantryIds((prev) => [...prev, id]);
  };

  const handleRemoveCustomItem = (id: string) => {
    setCustomItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedPantryIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const handleResetToDefaults = () => {
    setSelectedPantryIds(DEFAULT_INITIAL_PANTRY_IDS);
  };

  // Handlers for Favorites
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Handlers for Grocery List
  const handleAddMissingToGrocery = (items: string[], recipeTitle: string) => {
    setGroceryList((prev) => {
      const existingNames = new Set(prev.map((g) => g.name.toLowerCase()));
      const newItems: GroceryItem[] = [];

      items.forEach((itemName) => {
        if (!existingNames.has(itemName.toLowerCase())) {
          newItems.push({
            id: `grocery_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: itemName,
            checked: false,
            recipeTitle,
          });
          existingNames.add(itemName.toLowerCase());
        }
      });

      return [...prev, ...newItems];
    });
  };

  const handleToggleGroceryItem = (id: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddGroceryItem = (name: string) => {
    const newItem: GroceryItem = {
      id: `grocery_${Date.now()}`,
      name,
      checked: false,
    };
    setGroceryList((prev) => [newItem, ...prev]);
  };

  const handleRemoveGroceryItem = (id: string) => {
    setGroceryList((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCheckedGroceries = () => {
    setGroceryList((prev) => prev.filter((i) => !i.checked));
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Header */}
      <Header
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        pantryCount={selectedPantryIds.length}
        cookableCount={readyToCookCount}
      />

      {/* Main Container / Mobile Frame Wrapper */}
      <main
        className={`flex-1 flex justify-center py-4 px-2 sm:px-4 ${
          isMobileFrame ? 'items-start' : 'w-full'
        }`}
      >
        <div
          className={`w-full transition-all duration-300 ${
            isMobileFrame
              ? 'max-w-[420px] bg-stone-50 rounded-[40px] shadow-2xl border-[10px] border-stone-800 overflow-hidden relative min-h-[840px] flex flex-col'
              : 'max-w-6xl'
          }`}
        >
          {/* Mobile Frame Simulated Speaker / Camera Notch if in Frame Mode */}
          {isMobileFrame && (
            <div className="bg-stone-800 pt-3 pb-2 px-6 flex items-center justify-between text-[11px] text-stone-300 font-mono select-none">
              <span>9:41</span>
              <div className="w-16 h-4 bg-stone-900 rounded-full mx-auto" />
              <span>100% ⚡</span>
            </div>
          )}

          {/* Hero Visual Spotlight (shown on initial load if on recipes or matcher) */}
          <div className="p-3 sm:p-4 pb-0">
            <div className="relative rounded-2xl overflow-hidden shadow-sm h-36 sm:h-44 bg-emerald-950 flex items-end p-4 border border-stone-200">
              <img
                src={culinaryHeroImg}
                alt="Authentic Pakistani Karahi and Biryani Spread"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent" />
              
              <div className="relative z-10 text-white space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PakZeroWaste Culinary Engine</span>
                </div>
                <h2 className="text-base sm:text-xl font-bold font-serif text-white leading-tight">
                  Cook authentic Pakistani feasts with what’s already in your kitchen.
                </h2>
                <p className="text-[11px] sm:text-xs text-stone-300 hidden sm:block">
                  Zero food waste · 33 traditional recipes · 100% offline & API-free
                </p>
              </div>
            </div>
          </div>

          {/* Screen Body Content */}
          <div className="p-3 sm:p-4 flex-1 pb-24">
            {activeTab === 'pantry' && (
              <PantryTracker
                allItems={allPantryItems}
                selectedItemIds={selectedPantryIds}
                onToggleItem={handleTogglePantryItem}
                onSelectAllCategory={handleSelectAllCategory}
                onClearCategory={handleClearCategory}
                onAddCustomItem={handleAddCustomItem}
                onRemoveCustomItem={handleRemoveCustomItem}
                onResetToDefaults={handleResetToDefaults}
                assumeStaples={assumeStaples}
                onToggleAssumeStaples={() => setAssumeStaples(!assumeStaples)}
                onNavigateToCookable={() => setActiveTab('matcher')}
                cookableCount={readyToCookCount}
              />
            )}

            {activeTab === 'matcher' && (
              <CanIMakeThis
                matches={matchResults}
                onSelectRecipe={(r) => setSelectedRecipe(r)}
                onAddMissingToGrocery={handleAddMissingToGrocery}
                groceryItemNames={groceryItemNamesSet}
                onNavigateToPantry={() => setActiveTab('pantry')}
              />
            )}

            {activeTab === 'recipes' && (
              <RecipeBrowser
                recipes={PAKISTANI_RECIPES}
                matchResults={matchResultsMap}
                favoriteIds={favoriteIdsSet}
                onToggleFavorite={handleToggleFavorite}
                onSelectRecipe={(r) => setSelectedRecipe(r)}
              />
            )}

            {activeTab === 'zerowaste' && (
              <ZeroWasteHub
                selectedPantryItemIds={selectedPantryIds}
                favoriteRecipeIds={favoriteIds}
                onNavigateToCookable={() => setActiveTab('matcher')}
              />
            )}

            {activeTab === 'favorites' && (
              <FavoritesAndGroceries
                favorites={favoriteRecipes}
                groceryList={groceryList}
                onToggleFavorite={handleToggleFavorite}
                onSelectRecipe={(r) => setSelectedRecipe(r)}
                onToggleGroceryItem={handleToggleGroceryItem}
                onAddGroceryItem={handleAddGroceryItem}
                onRemoveGroceryItem={handleRemoveGroceryItem}
                onClearCheckedGroceries={handleClearCheckedGroceries}
              />
            )}

            {activeTab === 'flutter' && <FlutterCodeViewer />}
          </div>

          {/* Sticky Bottom Navigation Bar (Thumb-Zone Ergonomics compliant with reference) */}
          <nav
            className={`${
              isMobileFrame
                ? 'absolute bottom-0 left-0 right-0'
                : 'fixed bottom-0 left-0 right-0 max-w-6xl mx-auto'
            } z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 py-1.5`}
          >
            <div className="grid grid-cols-6 items-center">
              {/* Tab 1: Pantry */}
              <button
                onClick={() => setActiveTab('pantry')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative cursor-pointer ${
                  activeTab === 'pantry' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <div className="relative">
                  <Carrot className="w-5 h-5" />
                  {selectedPantryIds.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-emerald-700 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                      {selectedPantryIds.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold tracking-tight mt-1">Pantry</span>
              </button>

              {/* Tab 2: Can I Cook? */}
              <button
                onClick={() => setActiveTab('matcher')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative cursor-pointer ${
                  activeTab === 'matcher' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  {readyToCookCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-amber-500 text-stone-950 text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center animate-pulse">
                      {readyToCookCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold tracking-tight mt-1">Can I Cook?</span>
              </button>

              {/* Tab 3: Recipes */}
              <button
                onClick={() => setActiveTab('recipes')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors cursor-pointer ${
                  activeTab === 'recipes' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-[10px] font-semibold tracking-tight mt-1">33 Recipes</span>
              </button>

              {/* Tab 4: Zero Waste */}
              <button
                onClick={() => setActiveTab('zerowaste')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors cursor-pointer ${
                  activeTab === 'zerowaste' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Leaf className="w-5 h-5" />
                <span className="text-[10px] font-semibold tracking-tight mt-1">Zero Waste</span>
              </button>

              {/* Tab 5: Saved & Groceries */}
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative cursor-pointer ${
                  activeTab === 'favorites' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <div className="relative">
                  <Bookmark className="w-5 h-5" />
                  {groceryList.filter((g) => !g.checked).length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                      {groceryList.filter((g) => !g.checked).length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold tracking-tight mt-1">Saved</span>
              </button>

              {/* Tab 6: Flutter Code */}
              <button
                onClick={() => setActiveTab('flutter')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors cursor-pointer ${
                  activeTab === 'flutter' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Code className="w-5 h-5" />
                <span className="text-[10px] font-semibold tracking-tight mt-1">Flutter</span>
              </button>
            </div>
          </nav>
        </div>
      </main>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        pantryItemIds={pantryIdsSet}
        assumeStaples={assumeStaples}
        isFavorite={selectedRecipe ? favoriteIdsSet.has(selectedRecipe.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddMissingToGrocery={handleAddMissingToGrocery}
        groceryItemNames={groceryItemNamesSet}
      />
    </div>
  );
}
