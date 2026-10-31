import React from 'react';
import type { Grain, Protein, CalculationMode, SpiceStyle, UnitDisplayMode } from '../types';
import { SPICE_STYLES } from '../data/defaults';
import { Scale, Droplet, ChefHat, Sparkles } from 'lucide-react';

interface PortionControlsProps {
  calculationMode: CalculationMode;
  setCalculationMode: (mode: CalculationMode) => void;
  servings: number;
  setServings: (n: number) => void;
  targetProteinGrams: number;
  setTargetProteinGrams: (g: number) => void;
  targetGrainGrams: number;
  setTargetGrainGrams: (g: number) => void;
  unitDisplayMode: UnitDisplayMode;
  setUnitDisplayMode: (u: UnitDisplayMode) => void;
  spiceStyle: SpiceStyle;
  setSpiceStyle: (s: SpiceStyle) => void;
  cannedLegumes: boolean;
  setCannedLegumes: (c: boolean) => void;
  selectedProtein: Protein;
  selectedGrains: Grain[];
  onGenerate: () => void;
}

export const PortionControls: React.FC<PortionControlsProps> = ({
  calculationMode,
  setCalculationMode,
  servings,
  setServings,
  targetProteinGrams,
  setTargetProteinGrams,
  targetGrainGrams,
  setTargetGrainGrams,
  unitDisplayMode,
  setUnitDisplayMode,
  spiceStyle,
  setSpiceStyle,
  cannedLegumes,
  setCannedLegumes,
  selectedProtein,
  selectedGrains,
  onGenerate
}) => {
  // Compute calculated preview numbers
  let effectiveProteinGrams = targetProteinGrams;
  let effectiveGrainGrams = targetGrainGrams;
  let effectiveServings = servings;

  if (calculationMode === 'servings') {
    effectiveProteinGrams = servings * selectedProtein.gramsPerServing;
    effectiveGrainGrams = servings * 80;
    effectiveServings = servings;
  } else if (calculationMode === 'by_protein') {
    effectiveServings = Math.max(1, Math.round((targetProteinGrams / selectedProtein.gramsPerServing) * 10) / 10);
    effectiveGrainGrams = Math.round(effectiveServings * 80);
    effectiveProteinGrams = targetProteinGrams;
  } else if (calculationMode === 'by_grain') {
    effectiveServings = Math.max(1, Math.round((targetGrainGrams / 80) * 10) / 10);
    effectiveProteinGrams = Math.round(effectiveServings * selectedProtein.gramsPerServing);
    effectiveGrainGrams = targetGrainGrams;
  }

  // Water approximation
  const grainWater = selectedGrains.reduce((sum, g) => {
    const partWeight = effectiveGrainGrams / (selectedGrains.length || 1);
    const ratio = (cannedLegumes && (g.id === 'chickpeas' || g.id === 'red_beans')) ? 0.5 : g.waterRatio;
    return sum + partWeight * ratio;
  }, 0);
  const approxTotalWater = Math.round(grainWater + 60 + effectiveServings * 15);

  const hasLegumes = selectedGrains.some((g) => g.id === 'chickpeas' || g.id === 'red_beans' || g.id === 'split_peas');

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">3</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Параметры и расчет порций
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Выберите, от чего рассчитывать рецепт: от порций, от веса мяса или от крупы
          </p>
        </div>

        {/* Calculation Mode Pills */}
        <div className="flex p-1 bg-slate-100 rounded-2xl text-xs font-bold gap-1 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setCalculationMode('servings')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              calculationMode === 'servings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            По порциям
          </button>
          <button
            type="button"
            onClick={() => setCalculationMode('by_protein')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              calculationMode === 'by_protein'
                ? 'bg-white text-amber-900 shadow-xs ring-1 ring-amber-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🥩 От веса мяса ({selectedProtein.name.split(' ')[0]})
          </button>
          <button
            type="button"
            onClick={() => setCalculationMode('by_grain')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              calculationMode === 'by_grain'
                ? 'bg-white text-amber-900 shadow-xs ring-1 ring-amber-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌾 От веса крупы
          </button>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {/* Input Selector depending on mode */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          {calculationMode === 'servings' && (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Количество персон
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-10 h-10 rounded-xl bg-white shadow-xs hover:bg-slate-100 font-bold text-slate-700 text-lg flex items-center justify-center cursor-pointer border border-slate-200"
                >
                  -
                </button>
                <div className="flex-1 text-center bg-white py-2 rounded-xl border border-slate-200">
                  <span className="text-2xl font-black text-slate-800">{servings}</span>
                  <span className="text-xs text-slate-500 font-medium ml-1.5">
                    {servings === 1 ? 'порция' : servings < 5 ? 'порции' : 'порций'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setServings(Math.min(15, servings + 1))}
                  className="w-10 h-10 rounded-xl bg-white shadow-xs hover:bg-slate-100 font-bold text-slate-700 text-lg flex items-center justify-center cursor-pointer border border-slate-200"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {calculationMode === 'by_protein' && (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Вес мяса / фарша в наличии
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Приложение само рассчитает нужный вес круп и воды
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="3000"
                  step="50"
                  value={targetProteinGrams}
                  onChange={(e) => setTargetProteinGrams(Math.max(50, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-lg font-black rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <span className="text-sm font-bold text-slate-600">грамм</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[250, 400, 500, 700].map((quickGrams) => (
                  <button
                    key={quickGrams}
                    type="button"
                    onClick={() => setTargetProteinGrams(quickGrams)}
                    className="flex-1 py-1 text-[11px] font-semibold rounded-lg bg-white border border-slate-200 hover:bg-amber-50 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    {quickGrams} г
                  </button>
                ))}
              </div>
            </div>
          )}

          {calculationMode === 'by_grain' && (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Общий вес сухой крупы
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Сколько крупы хотите приготовить
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="2000"
                  step="50"
                  value={targetGrainGrams}
                  onChange={(e) => setTargetGrainGrams(Math.max(50, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-lg font-black rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <span className="text-sm font-bold text-slate-600">грамм</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[160, 240, 320, 500].map((quickGrams) => (
                  <button
                    key={quickGrams}
                    type="button"
                    onClick={() => setTargetGrainGrams(quickGrams)}
                    className="flex-1 py-1 text-[11px] font-semibold rounded-lg bg-white border border-slate-200 hover:bg-amber-50 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    {quickGrams} г
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Calculated Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/60">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-800 font-semibold mb-0.5">
              <Scale className="w-3 h-3 text-amber-600" />
              <span>Крупа</span>
            </div>
            <p className="text-base font-black text-slate-800">
              {effectiveGrainGrams} г
            </p>
            <p className="text-[10px] text-slate-500">
              {selectedGrains.length > 0
                ? `по ~${Math.round(effectiveGrainGrams / selectedGrains.length)} г`
                : '—'}
            </p>
          </div>

          <div className="text-center border-x border-amber-200/70 px-1">
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-800 font-semibold mb-0.5">
              <ChefHat className="w-3 h-3 text-amber-600" />
              <span>Белок</span>
            </div>
            <p className="text-base font-black text-slate-800">
              {effectiveProteinGrams} г
            </p>
            <p className="text-[10px] text-slate-500">
              ~{effectiveServings} порц.
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-800 font-semibold mb-0.5">
              <Droplet className="w-3 h-3 text-sky-600" />
              <span>Вода</span>
            </div>
            <p className="text-base font-black text-sky-800">
              ~{approxTotalWater} мл
            </p>
            <p className="text-[10px] text-slate-500">
              кипяток в казан
            </p>
          </div>
        </div>

        {/* Big Action Button */}
        <div>
          <button
            type="button"
            disabled={selectedGrains.length === 0}
            onClick={onGenerate}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
              selectedGrains.length > 0
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25 hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <ChefHat className="w-5 h-5" />
            <span>Рассчитать пошаговый рецепт</span>
            <Sparkles className="w-4 h-4 opacity-75" />
          </button>
        </div>
      </div>

      {/* Extra Kitchen Preferences Toolbar */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Unit measurement mode */}
        <div>
          <span className="font-bold text-slate-700 block mb-1.5">
            Единицы измерения в рецепте:
          </span>
          <div className="flex p-0.5 bg-slate-100 rounded-xl font-medium gap-0.5">
            <button
              type="button"
              onClick={() => setUnitDisplayMode('grams')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-colors cursor-pointer ${
                unitDisplayMode === 'grams' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              ⚖️ Граммы
            </button>
            <button
              type="button"
              onClick={() => setUnitDisplayMode('kitchen_units')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-colors cursor-pointer ${
                unitDisplayMode === 'kitchen_units' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              🥄 Стаканы/ложки
            </button>
            <button
              type="button"
              onClick={() => setUnitDisplayMode('both')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-colors cursor-pointer ${
                unitDisplayMode === 'both' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              ✨ Всё вместе
            </button>
          </div>
        </div>

        {/* Spice Style */}
        <div>
          <span className="font-bold text-slate-700 block mb-1.5">
            Стиль специй и аромата:
          </span>
          <select
            value={spiceStyle}
            onChange={(e) => setSpiceStyle(e.target.value as SpiceStyle)}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-amber-500"
          >
            {(Object.keys(SPICE_STYLES) as SpiceStyle[]).map((key) => (
              <option key={key} value={key}>
                {SPICE_STYLES[key].name} ({SPICE_STYLES[key].description.slice(0, 30)}...)
              </option>
            ))}
          </select>
        </div>

        {/* Canned Legumes Shortcut */}
        <div className="flex items-center">
          <label className={`flex items-center gap-2.5 p-2 rounded-xl border w-full transition-colors cursor-pointer ${
            cannedLegumes ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <input
              type="checkbox"
              checked={cannedLegumes}
              onChange={(e) => setCannedLegumes(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div className="text-[11px] leading-tight">
              <span className="font-bold block">🥫 Консервированные бобовые</span>
              <span className="text-[10px] text-slate-500">
                {hasLegumes ? 'Уберет замачивание, варка 5 мин' : 'Для нута/фасоли из банки'}
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
