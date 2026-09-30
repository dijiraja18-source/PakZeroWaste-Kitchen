import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Flame,
  Users,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChefHat,
  Plus,
  Minus,
  Check,
  ShoppingCart,
  Timer,
  Volume2,
} from 'lucide-react';
import { Recipe } from '../types';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  pantryItemIds: Set<string>;
  assumeStaples: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddMissingToGrocery: (items: string[], recipeTitle: string) => void;
  groceryItemNames: Set<string>;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  pantryItemIds,
  assumeStaples,
  isFavorite,
  onToggleFavorite,
  onAddMissingToGrocery,
  groceryItemNames,
}) => {
  if (!recipe) return null;

  // Servings state
  const [servings, setServings] = useState<number>(recipe.servings || 4);
  const servingRatio = servings / (recipe.servings || 4);

  // Cooking step checklist
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Kitchen Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(recipe.cookTime * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [initialTimerSetting, setInitialTimerSetting] = useState<number>(recipe.cookTime * 60);

  // Sync timer when recipe changes
  useEffect(() => {
    setTimerSeconds(recipe.cookTime * 60);
    setInitialTimerSetting(recipe.cookTime * 60);
    setTimerRunning(false);
    setCompletedSteps(new Set());
    setServings(recipe.servings || 4);
  }, [recipe]);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            // Play gentle web audio beep
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
              gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 1.2);
            } catch {
              // ignore audio error if blocked
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const toggleStep = (stepIdx: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepIdx)) {
        next.delete(stepIdx);
      } else {
        next.add(stepIdx);
      }
      return next;
    });
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setTimerMinutes = (mins: number) => {
    setTimerRunning(false);
    setInitialTimerSetting(mins * 60);
    setTimerSeconds(mins * 60);
  };

  // Missing ingredients check
  const missingItems = recipe.ingredients
    .filter((ing) => !pantryItemIds.has(ing.id) && !(assumeStaples && ing.isStaple))
    .map((ing) => ing.name);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="bg-emerald-900 text-white p-5 pb-4 relative shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium mb-1">
                <span>{recipe.category}</span>
                <span>·</span>
                <span className="font-serif italic text-emerald-200">{recipe.urduTitle}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white leading-tight">
                {recipe.title}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onToggleFavorite(recipe.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'bg-rose-600/20 border-rose-400 text-rose-300'
                    : 'bg-emerald-800/80 border-emerald-700 text-emerald-200 hover:text-white'
                }`}
                title={isFavorite ? 'Remove favorite' : 'Save favorite'}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-emerald-800/80 border border-emerald-700 text-emerald-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 text-xs text-emerald-200 mt-4 pt-3 border-t border-emerald-800/70 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prep: {recipe.prepTime}m</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Cook: {recipe.cookTime}m</span>
            </span>
            <span>·</span>
            <span className="font-medium text-emerald-100">
              Difficulty: {recipe.difficulty}
            </span>
            <span>·</span>
            <span className="text-emerald-100 font-medium">Spice: {recipe.spiceLevel}</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-stone-800">
          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic border-l-2 border-emerald-700 pl-3">
            {recipe.description}
          </p>

          {/* Zero-Waste Chef Tip Highlight Box */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-0.5">
                Pakistani Zero-Waste Chef Secret
              </h4>
              <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                {recipe.zeroWasteTip}
              </p>
            </div>
          </div>

          {/* Servings Scaler */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-600" />
              <span className="text-xs sm:text-sm font-semibold text-stone-800">
                Adjust Recipe Servings:
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 flex items-center justify-center hover:bg-stone-100 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs sm:text-sm font-bold text-emerald-800 w-8 text-center tabular-nums">
                {servings}
              </span>
              <button
                onClick={() => setServings((s) => Math.min(16, s + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 flex items-center justify-center hover:bg-stone-100 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ingredients with Pantry Match Indicators */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-serif text-stone-900 text-base">
                Ingredients Required
              </h3>
              {missingItems.length > 0 && (
                <button
                  onClick={() => onAddMissingToGrocery(missingItems, recipe.title)}
                  className="text-xs text-amber-800 hover:text-amber-950 font-semibold underline flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add Missing ({missingItems.length}) to Grocery</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {recipe.ingredients.map((ing, idx) => {
                const hasInPantry =
                  pantryItemIds.has(ing.id) || (assumeStaples && Boolean(ing.isStaple));
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      hasInPantry
                        ? 'bg-emerald-50/70 border-emerald-300/80 text-emerald-950'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {hasInPantry ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span className="font-medium truncate">{ing.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-stone-500 font-semibold">
                      <span>{ing.amount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Step-by-Step Cooking Mode */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold font-serif text-stone-900 text-base">
                  Step-by-Step Instructions
                </h3>
                <p className="text-[11px] text-stone-500">
                  Tap steps to mark progress as you cook in your kitchen.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {completedSteps.size} of {recipe.instructions.length} done
              </span>
            </div>

            <div className="space-y-2.5">
              {recipe.instructions.map((step, idx) => {
                const isDone = completedSteps.has(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isDone
                        ? 'bg-emerald-50/50 border-emerald-300 text-stone-500 line-through'
                        : 'bg-white border-stone-200 hover:border-emerald-400 text-stone-800 shadow-xs'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 border ${
                        isDone
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-100 text-stone-600 border-stone-300'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">{step}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Built-in Kitchen Timer Tool */}
          <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-5 shadow-inner space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-300">
                  Kitchen Timer & Dum Alert
                </span>
              </div>
              {timerSeconds === 0 && (
                <span className="text-xs font-bold text-amber-400 animate-bounce flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  Time’s up! Check your food
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
              <div className="text-3xl sm:text-4xl font-mono font-bold text-white tabular-nums tracking-wider">
                {formatTimer(timerSeconds)}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                    timerRunning
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{timerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>

                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(initialTimerSetting);
                  }}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-800 text-[11px]">
              <span className="text-stone-400 mr-1">Presets:</span>
              {[5, 10, 15, 20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimerMinutes(mins)}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium transition-colors cursor-pointer"
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-500">
            {completedSteps.size === recipe.instructions.length && recipe.instructions.length > 0 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Dish Completed!
              </span>
            ) : (
              <span>Traditional recipe preserved offline</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm cursor-pointer"
          >
            Done Cooking
          </button>
        </div>
      </div>
    </div>
  );
};
