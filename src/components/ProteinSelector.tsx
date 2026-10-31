import React from 'react';
import type { Protein } from '../types';
import { Drumstick, Plus, Beef, CheckCircle2 } from 'lucide-react';

interface ProteinSelectorProps {
  proteins: Protein[];
  selectedProtein: Protein;
  onSelectProtein: (protein: Protein) => void;
  onOpenAddModal: () => void;
}

export const ProteinSelector: React.FC<ProteinSelectorProps> = ({
  proteins,
  selectedProtein,
  onSelectProtein,
  onOpenAddModal
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">1</span>
            Белковая основа
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            С чего начинается казан: мясо или постная основа, обжариваемая первой
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Свой белок</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {proteins.map((p) => {
          const isSelected = selectedProtein.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectProtein(p)}
              className={`relative p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {p.category === 'poultry' ? (
                    <Drumstick className="w-4 h-4" />
                  ) : (
                    <Beef className="w-4 h-4" />
                  )}
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600 fill-amber-100" />
                )}
              </div>

              <div>
                <p className="font-semibold text-xs sm:text-sm text-slate-800 leading-snug line-clamp-2">
                  {p.name}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                  <span>Обжарка: ~{p.fryTimeMin} мин</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
