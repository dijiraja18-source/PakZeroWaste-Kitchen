import React, { useState } from 'react';
import {
  Leaf,
  DollarSign,
  TrendingDown,
  Sparkles,
  Recycle,
  ChefHat,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { calculateZeroWasteStats } from '../utils/pantryMatcher';

interface ZeroWasteHubProps {
  selectedPantryItemIds: string[];
  favoriteRecipeIds: string[];
  onNavigateToCookable: () => void;
}

export const ZeroWasteHub: React.FC<ZeroWasteHubProps> = ({
  selectedPantryItemIds,
  favoriteRecipeIds,
  onNavigateToCookable,
}) => {
  const stats = calculateZeroWasteStats(selectedPantryItemIds, favoriteRecipeIds);

  const [activeHackTab, setActiveHackTab] = useState<'roti' | 'herbs' | 'dairy' | 'bones' | 'peels'>('roti');

  const HACKS = {
    roti: {
      title: 'Stale Roti & Leftover Bread (باسی روٹی)',
      hacks: [
        {
          name: 'Sweet Punjabi Churi',
          desc: 'Warm leftover rotis on a tawa, crumble by hand while hot, mix with 1 tbsp warm desi ghee and gur (jaggery) or sugar. A beloved traditional childhood treat!',
        },
        {
          name: 'Crispy Roti Pakoras',
          desc: 'Cut stale rotis into triangles, dip into spiced gram flour (besan) batter with cumin and carom seeds, and deep fry until crackling crisp.',
        },
        {
          name: 'Desi Soup Croutons',
          desc: 'Brush leftover naan or roti with garlic butter, cube into 1-inch squares, and toast in an oven or pan until golden for topping daal or soups.',
        },
      ],
    },
    herbs: {
      title: 'Coriander & Mint Stems (دھنیا پودینہ کی ڈنڈیاں)',
      hacks: [
        {
          name: 'Aromatic Yakhni Broth',
          desc: 'Never throw coriander stems away! The stems contain 3x more essential aromatic oils than the leaves. Tie in a muslin bundle and simmer in mutton/beef yakhni broth.',
        },
        {
          name: 'Green Chutney Foundation',
          desc: 'Tender stems blend smoothly in your blender with green chilies, cumin, salt, and yogurt to make vibrant Pakistani street raita chutney.',
        },
      ],
    },
    dairy: {
      title: 'Sour Yogurt & Milk Scraps (کھٹا دہی اور ملائی)',
      hacks: [
        {
          name: 'Authentic Dahi Kadi',
          desc: 'The sourer the yogurt, the tastier the Punjabi Kadi! Sour yogurt provides the authentic tart foundation that fresh yogurt lacks.',
        },
        {
          name: 'Enzymatic Meat Tenderizer',
          desc: 'Sour curd lactic acid naturally breaks down tough fibers in mutton and beef chunks. Marinate tough cuts for 4 hours before cooking karahi.',
        },
        {
          name: 'Homemade Desi Ghee',
          desc: 'Skim milk malai daily and collect in a freezer box. When full, churn into pure white butter and clarify into golden aromatic desi ghee.',
        },
      ],
    },
    bones: {
      title: 'Bones & Meat Trimmings (ہڈیاں اور یخنی)',
      hacks: [
        {
          name: 'Collagen Rich Bone Broth',
          desc: 'Simmer trimmed chicken backs, marrow bones, and beef ribs with whole garlic and cloves for 3 hours. Strain and freeze into silicone muffin molds.',
        },
        {
          name: 'Pulao Flavor Injector',
          desc: 'Drop 2 frozen yakhni cubes into ordinary boiled rice or lentils to instantly infuse restaurant-grade depth without buying synthetic bouillon cubes.',
        },
      ],
    },
    peels: {
      title: 'Vegetable Skins & Tomato Peels (چھلکے اور مصالحہ)',
      hacks: [
        {
          name: 'Dehydrated Tomato Umami Dust',
          desc: 'Peeled tomato skins from Karahi? Roast in a warm pan until crispy dry, then powder in a spice grinder with salt and chili flakes for savory seasoning.',
        },
        {
          name: 'Crispy Spiced Potato Skins',
          desc: 'Toss clean potato peelings with olive oil, chaat masala, and chili powder. Air fry or bake at 200°C for 12 minutes for gourmet crispy chips.',
        },
      ],
    },
  };

  return (
    <div className="space-y-6">
      {/* Zero Waste Impact Metrics */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-emerald-700/60">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
            Household Impact Calculator
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif mb-2">
          Zero Food Waste in the Pakistani Kitchen
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mb-6">
          By planning meals around active pantry inventory instead of over-purchasing groceries, Pakistani households can divert food from landfills and save thousands of rupees monthly.
        </p>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-800/60 border border-emerald-600/40 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-emerald-200 font-medium">Food Rescued</span>
              <Recycle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
              {stats.gramsSaved} <span className="text-sm font-sans font-normal text-emerald-200">kg</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 mt-1">
              Estimated from {stats.itemsTracked} tracked ingredients
            </p>
          </div>

          <div className="bg-emerald-800/60 border border-emerald-600/40 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-emerald-200 font-medium">Grocery Money Saved</span>
              <DollarSign className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-300">
              Rs. {stats.pkrSaved.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-300/80 mt-1">
              Prevented spoilage & duplicate purchases
            </p>
          </div>

          <div className="bg-emerald-800/60 border border-emerald-600/40 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-emerald-200 font-medium">Carbon Emissions Avoided</span>
              <TrendingDown className="w-4 h-4 text-teal-300" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
              {stats.co2ePreventedKg} <span className="text-sm font-sans font-normal text-emerald-200">kg CO₂e</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 mt-1">
              Organic waste kept out of landfills
            </p>
          </div>
        </div>
      </div>

      {/* Traditional Zero-Waste Hacks Section */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold uppercase tracking-wider">
              <ChefHat className="w-4 h-4" />
              <span>Generational Desi Wisdom</span>
            </div>
            <h3 className="text-lg font-bold font-serif text-stone-900">
              Pakistani Scrap-to-Feast Kitchen Hacks
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            How grandmother’s kitchens wasted 0% of food
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'roti', label: 'Basi Roti (Bread)' },
            { id: 'herbs', label: 'Coriander/Mint Stems' },
            { id: 'dairy', label: 'Sour Curd & Malai' },
            { id: 'bones', label: 'Bones & Broth' },
            { id: 'peels', label: 'Peels & Skins' },
          ].map((tab) => {
            const isActive = activeHackTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveHackTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Hack Content */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3">
          <h4 className="font-bold text-stone-900 text-sm font-serif">
            {HACKS[activeHackTab].title}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HACKS[activeHackTab].hacks.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-semibold text-xs sm:text-sm text-stone-900">
                    {item.name}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed pl-4">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Golden Rules of Pak Zero-Waste Cooking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            <span>Rule 1: FIFO (First In, First Out)</span>
          </div>
          <p className="text-xs text-amber-950/80 leading-relaxed">
            Organize refrigerator shelves so freshly bought coriander, tomatoes, and dairy sit behind older ones. Cook recipes that use fragile leafy greens before dipping into shelf-stable potatoes.
          </p>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Rule 2: The Sunday Stock Pot</span>
          </div>
          <p className="text-xs text-emerald-950/80 leading-relaxed">
            Every weekend, place all vegetable peelings, onion ends, garlic skins, and meat bones into a pot with whole cumin and salt. Simmer 40 minutes for pure organic cooking stock.
          </p>
        </div>
      </div>
    </div>
  );
};
