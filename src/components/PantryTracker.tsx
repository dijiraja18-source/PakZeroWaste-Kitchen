import React, { useState, useMemo } from 'react';
import {
  Check,
  Plus,
  Search,
  RotateCcw,
  Sparkles,
  Carrot,
  Drumstick,
  Milk,
  Wheat,
  Clock,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';
import { PantryCategory, PantryItem } from '../types';
import { PANTRY_CATEGORIES } from '../data/pantryData';
import { COMMON_STAPLE_IDS } from '../utils/pantryMatcher';

interface PantryTrackerProps {
  allItems: PantryItem[];
  selectedItemIds: string[];
  onToggleItem: (id: string) => void;
  onSelectAllCategory: (category: PantryCategory) => void;
  onClearCategory: (category: PantryCategory) => void;
  onAddCustomItem: (item: Omit<PantryItem, 'id' | 'isCustom'>) => void;
  onRemoveCustomItem: (id: string) => void;
  onResetToDefaults: () => void;
  assumeStaples: boolean;
  onToggleAssumeStaples: () => void;
  onNavigateToCookable: () => void;
  cookableCount: number;
}

export const PantryTracker: React.FC<PantryTrackerProps> = ({
  allItems,
  selectedItemIds,
  onToggleItem,
  onSelectAllCategory,
  onClearCategory,
  onAddCustomItem,
  onRemoveCustomItem,
  onResetToDefaults,
  assumeStaples,
  onToggleAssumeStaples,
  onNavigateToCookable,
  cookableCount,
}) => {
  const [activeCategory, setActiveCategory] = useState<PantryCategory>('vegetables');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrdu, setNewItemUrdu] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PantryCategory>('vegetables');
  const [newItemShelfDays, setNewItemShelfDays] = useState(7);

  const selectedSet = useMemo(() => new Set(selectedItemIds), [selectedItemIds]);

  // Filter items by category & search query
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.urduName && item.urduName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allItems, activeCategory, searchQuery]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<PantryCategory, { selected: number; total: number }> = {
      vegetables: { selected: 0, total: 0 },
      meats: { selected: 0, total: 0 },
      dairy: { selected: 0, total: 0 },
      staples: { selected: 0, total: 0 },
    };

    allItems.forEach((item) => {
      counts[item.category].total += 1;
      if (selectedSet.has(item.id)) {
        counts[item.category].selected += 1;
      }
    });

    return counts;
  }, [allItems, selectedSet]);

  const handleCreateCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddCustomItem({
      name: newItemName.trim(),
      urduName: newItemUrdu.trim() || undefined,
      category: newItemCategory,
      shelfLifeDays: newItemShelfDays || 7,
    });

    setNewItemName('');
    setNewItemUrdu('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'vegetables':
        return <Carrot className="w-4 h-4" />;
      case 'meats':
        return <Drumstick className="w-4 h-4" />;
      case 'dairy':
        return <Milk className="w-4 h-4" />;
      case 'staples':
      default:
        return <Wheat className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Quick Ready CTA */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-4 sm:p-5 text-white shadow-sm border border-emerald-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-emerald-200">
                Smart Pantry Inventory
              </span>
              <span className="text-xs text-emerald-300">·</span>
              <span className="text-xs text-emerald-100 font-medium">
                {selectedItemIds.length} ingredients selected
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif">
              Check what’s in your kitchen today
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              Tap items you currently have in your fridge or pantry. The smart filter will instantly match them against 30+ authentic Pakistani recipes.
            </p>
          </div>

          <button
            onClick={onNavigateToCookable}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-stone-900" />
            <span>Can I Make This? ({cookableCount} ready)</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PANTRY_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id as PantryCategory];
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as PantryCategory)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white border-emerald-700 shadow-sm'
                  : 'bg-white hover:bg-emerald-50/50 text-stone-700 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-emerald-700/80 text-emerald-200' : 'bg-emerald-100/80 text-emerald-800'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-emerald-900/60 text-emerald-200'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {count.selected}/{count.total}
                </span>
              </div>
              <div className="font-semibold text-xs sm:text-sm leading-snug">{cat.label}</div>
              <div
                className={`text-[11px] truncate ${
                  isActive ? 'text-emerald-200/80' : 'text-stone-500'
                }`}
              >
                {cat.urdu}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Bar: Search, Bulk Select, Custom Add */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ingredients in English or Urdu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-stone-50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={() => onSelectAllCategory(activeCategory)}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
          >
            Select All
          </button>
          <button
            onClick={() => onClearCategory(activeCategory)}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom</span>
          </button>
          <button
            onClick={onResetToDefaults}
            title="Reset to typical Pakistani starter pantry"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Household Staples Auto-Stock Toggle */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-emerald-800 shrink-0" />
          <div>
            <span className="font-semibold text-emerald-950">Assume Everyday Spices Are Always In Stock</span>
            <p className="text-stone-600 text-xs">
              Includes salt, cooking oil, red chili powder, turmeric, cumin, coriander powder & atta flour.
            </p>
          </div>
        </div>
        <button
          onClick={onToggleAssumeStaples}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
            assumeStaples ? 'bg-emerald-700' : 'bg-stone-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              assumeStaples ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Items Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filteredItems.map((item) => {
          const isSelected = selectedSet.has(item.id);
          const isCommonStaple = COMMON_STAPLE_IDS.has(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all select-none ${
                isSelected
                  ? 'bg-emerald-50/90 border-emerald-500 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Custom Checkbox */}
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'border-stone-300 bg-stone-100 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                      {item.name}
                    </span>
                    {item.isCustom && (
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                        Custom
                      </span>
                    )}
                  </div>
                  {item.urduName && (
                    <div className="text-[11px] text-stone-500 font-medium truncate">
                      {item.urduName}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.shelfLifeDays && (
                  <span
                    title={`Shelf life ~${item.shelfLifeDays} days`}
                    className="flex items-center gap-1 text-[11px] text-stone-400"
                  >
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{item.shelfLifeDays}d</span>
                  </span>
                )}
                {item.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCustomItem(item.id);
                    }}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
          <Carrot className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-stone-600 font-medium text-sm">No ingredients found matching "{searchQuery}"</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-3 px-3 py-1.5 text-xs rounded-lg bg-emerald-700 text-white font-medium inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add this as a custom item</span>
          </button>
        </div>
      )}

      {/* Add Custom Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-stone-900 font-serif text-base">
                Add Custom Ingredient
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ingredient Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Chai leaves, Turnip, Quail"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Urdu Name or Transliteration (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. شلجم (Shalgam)"
                  value={newItemUrdu}
                  onChange={(e) => setNewItemUrdu(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as PantryCategory)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="vegetables">Vegetables & Aromatics</option>
                    <option value="meats">Meats & Proteins</option>
                    <option value="dairy">Dairy & Fats</option>
                    <option value="staples">Staples & Spices</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Estimated Shelf Life (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="730"
                    value={newItemShelfDays}
                    onChange={(e) => setNewItemShelfDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                >
                  Add to Pantry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
