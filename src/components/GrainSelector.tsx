import React, { useState } from 'react';
import type { Grain } from '../types';
import { Sparkles, Dices, Clock, Droplets, Plus, Check, Info } from 'lucide-react';

interface GrainSelectorProps {
  grains: Grain[];
  selectedGrains: Grain[];
  onToggleGrain: (grain: Grain) => void;
  onSelectRandom: (mode: 'any' | 'fast' | 'dense') => void;
  onOpenAddModal: () => void;
}

export const GrainSelector: React.FC<GrainSelectorProps> = ({
  grains,
  selectedGrains,
  onToggleGrain,
  onSelectRandom,
  onOpenAddModal
}) => {
  const [filter, setFilter] = useState<'all' | 'grain' | 'legume'>('all');

  const filteredGrains = grains.filter((g) => {
    if (filter === 'all') return true;
    return g.category === filter;
  });

  const isSelected = (grain: Grain) => selectedGrains.some((g) => g.id === grain.id);
  const isMaxReached = selectedGrains.length >= 4;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">2</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Выбор круп и бобовых
            </h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              selectedGrains.length > 0 
                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              Выбрано: {selectedGrains.length} из 4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Выберите от 1 до 4 круп, либо нажмите кнопку случайного микса
          </p>
        </div>

        {/* Action Buttons: Randomizer & Add */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectRandom('any')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Случайная комбинация от 2 до 4 круп"
          >
            <Dices className="w-3.5 h-3.5 text-amber-600" />
            <span>Случайный микс</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectRandom('fast')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-colors cursor-pointer"
            title="Крупы со временем варки до 20 мин (варятся быстро)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Быстрый (&lt;20м)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectRandom('dense')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200/80 rounded-xl transition-colors cursor-pointer"
            title="Сытные плотные крупы и бобовые (нут, фасоль, перловка)"
          >
            <span>Богатырский</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Своя крупа</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 text-xs">
        <span className="text-slate-400 font-medium">Фильтр:</span>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
            filter === 'all'
              ? 'bg-slate-800 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Все ({grains.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('grain')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
            filter === 'grain'
              ? 'bg-slate-800 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Злаки ({grains.filter((g) => g.category === 'grain').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('legume')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
            filter === 'legume'
              ? 'bg-slate-800 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Бобовые ({grains.filter((g) => g.category === 'legume').length})
        </button>
      </div>

      {/* Grains Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {filteredGrains.map((grain) => {
          const selected = isSelected(grain);
          const disabled = !selected && isMaxReached;

          return (
            <div
              key={grain.id}
              onClick={() => {
                if (!disabled) onToggleGrain(grain);
              }}
              className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer select-none flex flex-col justify-between ${
                selected
                  ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-500/20'
                  : disabled
                  ? 'border-slate-100 bg-slate-50/40 opacity-40 cursor-not-allowed'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      grain.category === 'legume'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {grain.category === 'legume' ? 'Бобовое' : 'Злак'}
                  </span>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      selected
                        ? 'bg-amber-500 text-white'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-sm leading-snug">
                  {grain.name}
                </h3>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-col gap-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Варка: {grain.cookTimeMin} мин
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Droplets className="w-3 h-3 text-sky-500" />
                    1 : {grain.waterRatio}
                  </span>
                </div>

                {grain.soakRequired && (
                  <div className="flex items-center gap-1 text-amber-700 text-[10px] font-medium bg-amber-100/70 px-1.5 py-0.5 rounded">
                    <Info className="w-3 h-3" />
                    <span>Замочить {grain.soakHours || 2} ч</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isMaxReached && (
        <p className="mt-3 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-center">
          Выбрано максимальное количество (4 крупы). Чтобы выбрать другую, снимите отметку с одной из выбранных.
        </p>
      )}
    </div>
  );
};
