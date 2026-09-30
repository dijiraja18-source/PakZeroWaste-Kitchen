import React from 'react';
import { Leaf, Smartphone, Monitor, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  pantryCount: number;
  cookableCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileFrame,
  onToggleFrame,
  pantryCount,
  cookableCount,
}) => {
  return (
    <header className="bg-emerald-900 text-stone-100 border-b border-emerald-800/80 sticky top-0 z-40 shadow-sm backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-600/40 flex items-center justify-center text-emerald-300 shadow-inner">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-serif">
                PakZeroWaste Kitchen
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700">
                100% Offline
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 font-medium">
              پاک زیرو ویسٹ کچن · Smart Pantry & Traditional Recipes
            </p>
          </div>
        </div>

        {/* Quick Stats & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-emerald-200/90 border-r border-emerald-800 pr-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{pantryCount} Pantry Items</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-amber-200 font-semibold">{cookableCount} Ready to Cook</span>
            </div>
          </div>

          {/* Frame Viewport Mode Toggle */}
          <button
            onClick={onToggleFrame}
            title={isMobileFrame ? 'Switch to Full Screen Layout' : 'Preview as Mobile Frame'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 transition-colors border border-emerald-700/60 shadow-sm"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile Frame</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
