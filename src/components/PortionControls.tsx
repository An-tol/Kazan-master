import React from 'react';
import type { Grain, Protein } from '../types';
import { Users, Scale, Droplet, ChefHat, Sparkles } from 'lucide-react';

interface PortionControlsProps {
  servings: number;
  setServings: (n: number) => void;
  selectedProtein: Protein;
  selectedGrains: Grain[];
  onGenerate: () => void;
}

export const PortionControls: React.FC<PortionControlsProps> = ({
  servings,
  setServings,
  selectedProtein,
  selectedGrains,
  onGenerate
}) => {
  const totalDryGrainGrams = servings * 80;
  const totalProteinGrams = servings * selectedProtein.gramsPerServing;

  // Approximate water calculation
  const grainWater = selectedGrains.reduce((sum, g) => {
    const partWeight = totalDryGrainGrams / (selectedGrains.length || 1);
    return sum + partWeight * g.waterRatio;
  }, 0);
  const approxTotalWater = Math.round(grainWater + 70 + servings * 15);

  const maxCookTime = selectedGrains.length > 0
    ? Math.max(...selectedGrains.map((g) => g.cookTimeMin))
    : 20;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Servings Selector */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">3</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Количество порций
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Автоматический пересчет веса ингредиентов и точного объема воды
          </p>

          <div className="inline-flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-9 h-9 rounded-xl bg-white shadow-xs hover:bg-slate-50 font-bold text-slate-700 text-lg flex items-center justify-center cursor-pointer transition-colors"
            >
              -
            </button>
            <div className="px-3 text-center min-w-[90px]">
              <span className="text-xl font-black text-slate-800">{servings}</span>
              <span className="text-xs text-slate-500 font-medium ml-1.5">
                {servings === 1 ? 'порция' : servings < 5 ? 'порции' : 'порций'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setServings(Math.min(12, servings + 1))}
              className="w-9 h-9 rounded-xl bg-white shadow-xs hover:bg-slate-50 font-bold text-slate-700 text-lg flex items-center justify-center cursor-pointer transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Middle: Calculated Live Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 py-2 px-3 bg-amber-50/60 rounded-xl border border-amber-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-800/80 font-medium mb-0.5">
              <Scale className="w-3 h-3 text-amber-600" />
              <span>Сухая крупа</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-slate-800">
              {totalDryGrainGrams} г
            </p>
            <p className="text-[10px] text-slate-500">
              {selectedGrains.length > 0
                ? `по ~${Math.round(totalDryGrainGrams / selectedGrains.length)} г`
                : 'не выбрано'}
            </p>
          </div>

          <div className="text-center border-x border-amber-200/60 px-2">
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-800/80 font-medium mb-0.5">
              <Users className="w-3 h-3 text-amber-600" />
              <span>Белок</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-slate-800">
              {totalProteinGrams} г
            </p>
            <p className="text-[10px] text-slate-500">
              {selectedProtein.name.split(' ')[0]}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-800/80 font-medium mb-0.5">
              <Droplet className="w-3 h-3 text-sky-600" />
              <span>Вода (кипяток)</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-sky-700">
              ~{approxTotalWater} мл
            </p>
            <p className="text-[10px] text-slate-500">
              варка ~{maxCookTime} мин
            </p>
          </div>
        </div>

        {/* Right: Big CTA Generate Button */}
        <div>
          <button
            type="button"
            disabled={selectedGrains.length === 0}
            onClick={onGenerate}
            className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
              selectedGrains.length > 0
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <ChefHat className="w-5 h-5" />
            <span>Рассчитать пошаговый рецепт</span>
            <Sparkles className="w-4 h-4 opacity-75" />
          </button>
        </div>
      </div>
    </div>
  );
};
