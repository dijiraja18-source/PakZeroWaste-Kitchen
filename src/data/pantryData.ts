import { PantryItem } from '../types';

export const PANTRY_CATEGORIES = [
  { id: 'vegetables', label: 'Vegetables & Aromatics', urdu: 'سبزیاں اور مصالحہ جات', icon: 'Carrot' },
  { id: 'meats', label: 'Meats & Proteins', urdu: 'گوشت اور دالیں', icon: 'Drumstick' },
  { id: 'dairy', label: 'Dairy & Fats', urdu: 'دودھ، دہی اور گھی', icon: 'Milk' },
  { id: 'staples', label: 'Staples, Rice & Spices', urdu: 'چاول، آٹا اور گرم مصالحہ', icon: 'Wheat' },
] as const;

export const INITIAL_PANTRY_ITEMS: PantryItem[] = [
  // --- Vegetables & Aromatics ---
  { id: 'onion', name: 'Onion', urduName: 'پیاز (Pyaaz)', category: 'vegetables', isDefaultStaple: true, shelfLifeDays: 28 },
  { id: 'tomato', name: 'Tomato', urduName: 'ٹماٹر (Tamatar)', category: 'vegetables', isDefaultStaple: true, shelfLifeDays: 7 },
  { id: 'garlic', name: 'Garlic', urduName: 'لہسن (Lehsan)', category: 'vegetables', isDefaultStaple: true, shelfLifeDays: 30 },
  { id: 'ginger', name: 'Ginger', urduName: 'ادرک (Adrak)', category: 'vegetables', isDefaultStaple: true, shelfLifeDays: 21 },
  { id: 'green_chili', name: 'Green Chilies', urduName: 'ہری مرچ (Hari Mirch)', category: 'vegetables', isDefaultStaple: true, shelfLifeDays: 14 },
  { id: 'fresh_coriander', name: 'Fresh Coriander', urduName: 'ہرا دھنیا (Hara Dhaniya)', category: 'vegetables', isDefaultStaple: false, shelfLifeDays: 5 },
  { id: 'mint', name: 'Fresh Mint', urduName: 'پودینہ (Podina)', category: 'vegetables', isDefaultStaple: false, shelfLifeDays: 5 },
  { id: 'potatoes', name: 'Potatoes', urduName: 'آلو (Aloo)', category: 'vegetables', isDefaultStaple: true, shelfLifeDays: 30 },
  { id: 'spinach', name: 'Spinach', urduName: 'پالک (Palak)', category: 'vegetables', isDefaultStaple: false, shelfLifeDays: 4 },
  { id: 'cauliflower', name: 'Cauliflower', urduName: 'گوبھی (Gobi)', category: 'vegetables', isDefaultStaple: false, shelfLifeDays: 7 },
  { id: 'okra', name: 'Okra (Ladyfinger)', urduName: 'بھنڈی (Bhindi)', category: 'vegetables', isDefaultStaple: false, shelfLifeDays: 5 },
  { id: 'eggplant', name: 'Eggplant', urduName: 'بینگن (Baingan)', category: 'vegetables', isDefaultStaple: false, shelfLifeDays: 6 },
  { id: 'peas', name: 'Green Peas', urduName: 'مٹر (Matar)', category: 'vegetables', isDefaultStaple: false, shelfLifeDays: 7 },
  { id: 'lemon', name: 'Lemon / Lime', urduName: 'لیمو (Nimbu)', category: 'vegetables', isDefaultStaple: true, shelfLifeDays: 14 },
  { id: 'cucumber', name: 'Cucumber', urduName: 'کھیرا (Kheera)', category: 'vegetables', isDefaultStaple: false, shelfLifeDays: 7 },
  { id: 'sarson_greens', name: 'Mustard Greens', urduName: 'سرسوں کا ساگ (Sarson)', category: 'vegetables', isDefaultStaple: false, shelfLifeDays: 5 },

  // --- Meats, Poultry & Proteins ---
  { id: 'chicken', name: 'Chicken', urduName: 'مرغی کا گوشت (Murgh)', category: 'meats', isDefaultStaple: false, shelfLifeDays: 3 },
  { id: 'mutton', name: 'Mutton / Goat Meat', urduName: 'بکرے کا گوشت (Gosht)', category: 'meats', isDefaultStaple: false, shelfLifeDays: 3 },
  { id: 'beef', name: 'Beef', urduName: 'گائے کا گوشت (Bara Gosht)', category: 'meats', isDefaultStaple: false, shelfLifeDays: 3 },
  { id: 'minced_meat', name: 'Minced Meat (Keema)', urduName: 'قیمہ (Keema)', category: 'meats', isDefaultStaple: false, shelfLifeDays: 2 },
  { id: 'beef_shank', name: 'Beef Shank (Nihari cut)', urduName: 'بونگ گوشت (Nihari Meat)', category: 'meats', isDefaultStaple: false, shelfLifeDays: 3 },
  { id: 'fish', name: 'Fish Fillet', urduName: 'مچھلی (Machhli)', category: 'meats', isDefaultStaple: false, shelfLifeDays: 2 },
  { id: 'eggs', name: 'Eggs', urduName: 'انڈے (Anday)', category: 'meats', isDefaultStaple: true, shelfLifeDays: 21 },
  { id: 'chickpeas', name: 'White Chickpeas', urduName: 'سفید چنے (Kabuli Chana)', category: 'meats', isDefaultStaple: true, shelfLifeDays: 180 },
  { id: 'red_lentils', name: 'Red Lentils (Masoor Daal)', urduName: 'مسور کی دال (Masoor)', category: 'meats', isDefaultStaple: true, shelfLifeDays: 180 },
  { id: 'yellow_lentils', name: 'Yellow Lentils (Moong Daal)', urduName: 'مونگ کی دال (Moong)', category: 'meats', isDefaultStaple: true, shelfLifeDays: 180 },
  { id: 'chana_daal', name: 'Split Bengal Gram (Chana Daal)', urduName: 'چنے کی دال (Chana Daal)', category: 'meats', isDefaultStaple: true, shelfLifeDays: 180 },
  { id: 'red_kidney_beans', name: 'Red Kidney Beans', urduName: 'سرخ لوبیا (Lobia)', category: 'meats', isDefaultStaple: false, shelfLifeDays: 180 },

  // --- Dairy & Fats ---
  { id: 'yogurt', name: 'Plain Yogurt', urduName: 'دہی (Dahi)', category: 'dairy', isDefaultStaple: true, shelfLifeDays: 10 },
  { id: 'milk', name: 'Whole Milk', urduName: 'دودھ (Doodh)', category: 'dairy', isDefaultStaple: true, shelfLifeDays: 7 },
  { id: 'ghee', name: 'Desi Ghee / Clarified Butter', urduName: 'دیسی گھی (Desi Ghee)', category: 'dairy', isDefaultStaple: true, shelfLifeDays: 90 },
  { id: 'oil', name: 'Cooking Oil', urduName: 'کوکنگ آئل (Tel)', category: 'dairy', isDefaultStaple: true, shelfLifeDays: 180 },
  { id: 'butter', name: 'Butter', urduName: 'مکھن (Makkhan)', category: 'dairy', isDefaultStaple: false, shelfLifeDays: 30 },
  { id: 'heavy_cream', name: 'Heavy Cream / Malai', urduName: 'ملائی / کریم (Malai)', category: 'dairy', isDefaultStaple: false, shelfLifeDays: 7 },
  { id: 'paneer', name: 'Paneer (Cottage Cheese)', urduName: 'پنیر (Paneer)', category: 'dairy', isDefaultStaple: false, shelfLifeDays: 7 },

  // --- Staples, Flours, Rice & Spices ---
  { id: 'basmati_rice', name: 'Basmati Rice', urduName: 'باسمتی چاول (Chawal)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'wheat_flour', name: 'Whole Wheat Flour (Atta)', urduName: 'گندم کا آٹا (Atta)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 180 },
  { id: 'gram_flour', name: 'Gram Flour (Besan)', urduName: 'بیسن (Besan)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 180 },
  { id: 'semolina', name: 'Semolina (Sooji)', urduName: 'سوجی (Sooji)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 180 },
  { id: 'vermicelli', name: 'Thin Vermicelli (Sewaiyan)', urduName: 'سویاں (Sewaiyan)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 180 },
  { id: 'cornmeal', name: 'Maize Flour (Makki Ka Atta)', urduName: 'مکئی کا آٹا (Makki Atta)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 90 },
  { id: 'all_purpose_flour', name: 'All-Purpose Flour (Maida)', urduName: 'میدہ (Maida)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 180 },
  
  // Spices
  { id: 'salt', name: 'Salt', urduName: 'نمک (Namak)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 730 },
  { id: 'red_chili_powder', name: 'Red Chili Powder', urduName: 'لال مرچ پاؤڈر (Lal Mirch)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'turmeric', name: 'Turmeric Powder', urduName: 'ہلدی (Haldi)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'coriander_powder', name: 'Coriander Powder', urduName: 'دھنیا پاؤڈر (Dhaniya Powder)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'cumin_seeds', name: 'Cumin Seeds (Zeera)', urduName: 'سفید زیرہ (Zeera)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'garam_masala', name: 'Garam Masala Powder', urduName: 'گرم مصالحہ (Garam Masala)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'black_pepper', name: 'Black Pepper (Ground or Whole)', urduName: 'کالی مرچ (Kaali Mirch)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'cinnamon', name: 'Cinnamon Sticks', urduName: 'دارچینی (Dalchini)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'cloves', name: 'Cloves (Laung)', urduName: 'لونگ (Laung)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'green_cardamom', name: 'Green Cardamom (Elaichi)', urduName: 'سبز الائچی (Choti Elaichi)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'black_cardamom', name: 'Black Cardamom', urduName: 'بڑی الائچی (Badi Elaichi)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 365 },
  { id: 'bay_leaf', name: 'Bay Leaves (Tej Patta)', urduName: 'تیز پات (Tej Patta)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'kasuri_methi', name: 'Dried Fenugreek (Kasuri Methi)', urduName: 'قصوری میتھی (Kasuri Methi)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 365 },
  { id: 'chaat_masala', name: 'Chaat Masala', urduName: 'چاٹ مصالحہ (Chaat Masala)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 365 },
  { id: 'sugar', name: 'Sugar', urduName: 'چینی (Cheeni)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 730 },
  { id: 'tamarind', name: 'Tamarind (Imli)', urduName: 'املی (Imli)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 180 },
  { id: 'crushed_chili', name: 'Crushed Red Pepper Flakes', urduName: 'کٹی لال مرچ (Kuti Mirch)', category: 'staples', isDefaultStaple: true, shelfLifeDays: 365 },
  { id: 'pomegranate_seeds', name: 'Dried Pomegranate Seeds (Anardana)', urduName: 'اناردانہ (Anardana)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 365 },
  { id: 'nihari_masala', name: 'Fennel & Dry Ginger (Saunf & Saunth)', urduName: 'سونف اور سونٹھ (Saunf/Saunth)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 365 },
  { id: 'nuts_dry_fruits', name: 'Almonds & Pistachios', urduName: 'بادام اور پستہ (Badaam/Pista)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 180 },
  { id: 'saffron', name: 'Saffron / Yellow Food Color', urduName: 'زعفران / زردہ رنگ (Zafran/Rang)', category: 'staples', isDefaultStaple: false, shelfLifeDays: 365 },
];
