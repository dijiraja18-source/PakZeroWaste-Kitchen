import { GroceryItem, PantryItem } from '../types';

const STORAGE_KEYS = {
  SELECTED_PANTRY_ITEMS: 'pak_zero_waste_pantry_items_v1',
  CUSTOM_PANTRY_ITEMS: 'pak_zero_waste_custom_items_v1',
  FAVORITES: 'pak_zero_waste_favorites_v1',
  GROCERY_LIST: 'pak_zero_waste_groceries_v1',
  ASSUME_STAPLES: 'pak_zero_waste_assume_staples_v1',
};

// Default pantry starter kit representing everyday staples
export const DEFAULT_INITIAL_PANTRY_IDS = [
  'onion',
  'tomato',
  'ginger',
  'garlic',
  'green_chili',
  'fresh_coriander',
  'potatoes',
  'chicken',
  'eggs',
  'yogurt',
  'oil',
  'ghee',
  'basmati_rice',
  'wheat_flour',
  'salt',
  'red_chili_powder',
  'turmeric',
  'coriander_powder',
  'cumin_seeds',
  'garam_masala',
  'black_pepper',
  'cinnamon',
  'cloves',
  'green_cardamom'
];

export const StorageService = {
  getSelectedPantryIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SELECTED_PANTRY_ITEMS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return DEFAULT_INITIAL_PANTRY_IDS;
  },

  saveSelectedPantryIds(ids: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_PANTRY_ITEMS, JSON.stringify(ids));
    } catch {
      // ignore
    }
  },

  getCustomPantryItems(): PantryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_PANTRY_ITEMS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return [];
  },

  saveCustomPantryItems(items: PantryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PANTRY_ITEMS, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  getFavoriteIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return ['chicken_biryani', 'mutton_karahi', 'daal_chawal'];
  },

  saveFavoriteIds(ids: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(ids));
    } catch {
      // ignore
    }
  },

  getGroceryList(): GroceryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GROCERY_LIST);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return [];
  },

  saveGroceryList(items: GroceryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GROCERY_LIST, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  getAssumeStaples(): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSUME_STAPLES);
      if (data !== null) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return true;
  },

  saveAssumeStaples(value: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSUME_STAPLES, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
};
