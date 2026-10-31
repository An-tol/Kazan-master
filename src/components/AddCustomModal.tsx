import React, { useState } from 'react';
import type { Grain, Protein } from '../types';
import { X } from 'lucide-react';

interface AddCustomModalProps {
  onClose: () => void;
  onAddGrain: (grain: Omit<Grain, 'id'>) => void;
  onAddProtein: (protein: Omit<Protein, 'id'>) => void;
  initialType?: 'grain' | 'protein';
}

export const AddCustomModal: React.FC<AddCustomModalProps> = ({
  onClose,
  onAddGrain,
  onAddProtein,
  initialType = 'grain'
}) => {
  const [tab, setTab] = useState<'grain' | 'protein'>(initialType);

  // Grain form
  const [grainName, setGrainName] = useState('');
  const [grainCategory, setGrainCategory] = useState<'grain' | 'legume'>('grain');
  const [cookTime, setCookTime] = useState<number>(20);
  const [waterRatio, setWaterRatio] = useState<number>(2.0);
  const [soakRequired, setSoakRequired] = useState(false);
  const [soakHours, setSoakHours] = useState<number>(2);

  // Protein form
  const [proteinName, setProteinName] = useState('');
  const [proteinCategory, setProteinCategory] = useState<'meat' | 'poultry' | 'veg'>('meat');
  const [fryTime, setFryTime] = useState<number>(10);
  const [gramsPerServing, setGramsPerServing] = useState<number>(130);

  const handleGrainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grainName.trim()) return;
    onAddGrain({
      name: grainName.trim(),
      category: grainCategory,
      cookTimeMin: Number(cookTime) || 20,
      waterRatio: Number(waterRatio) || 2.0,
      soakRequired,
      soakHours: soakRequired ? Number(soakHours) || 2 : undefined,
      isCustom: true
    });
    onClose();
  };

  const handleProteinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proteinName.trim()) return;
    onAddProtein({
      name: proteinName.trim(),
      category: proteinCategory,
      fryTimeMin: Number(fryTime) || 10,
      gramsPerServing: Number(gramsPerServing) || 130,
      isCustom: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">Добавить свой ингредиент</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 my-4 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setTab('grain')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              tab === 'grain' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            Крупа / Бобовое
          </button>
          <button
            onClick={() => setTab('protein')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              tab === 'protein' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            Мясо / Белок
          </button>
        </div>

        {tab === 'grain' ? (
          <form onSubmit={handleGrainSubmit} className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Название крупы <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Например: Полба дробленая"
                value={grainName}
                onChange={(e) => setGrainName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Категория</label>
                <select
                  value={grainCategory}
                  onChange={(e) => setGrainCategory(e.target.value as 'grain' | 'legume')}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="grain">Злак</option>
                  <option value="legume">Бобовое</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Варка (мин)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={cookTime}
                  onChange={(e) => setCookTime(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Вода (1 : X)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={waterRatio}
                  onChange={(e) => setWaterRatio(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Замачивать?</label>
                <div className="flex items-center h-10">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soakRequired}
                      onChange={(e) => setSoakRequired(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                    <span className="text-slate-600 font-medium">Да</span>
                  </label>
                  {soakRequired && (
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={soakHours}
                      onChange={(e) => setSoakHours(Number(e.target.value))}
                      className="ml-2 w-14 px-1.5 py-1 text-xs border rounded bg-slate-50"
                      title="Часов"
                    />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white mt-2 cursor-pointer shadow-sm shadow-amber-500/20"
            >
              Добавить в конструктор
            </button>
          </form>
        ) : (
          <form onSubmit={handleProteinSubmit} className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Название белка / мяса <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Например: Кролик кусочками"
                value={proteinName}
                onChange={(e) => setProteinName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Тип</label>
                <select
                  value={proteinCategory}
                  onChange={(e) => setProteinCategory(e.target.value as 'meat' | 'poultry' | 'veg')}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="meat">Мясо</option>
                  <option value="poultry">Птица</option>
                  <option value="veg">Постное</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Обжарка (мин)</label>
                <input
                  type="number"
                  min="3"
                  max="40"
                  value={fryTime}
                  onChange={(e) => setFryTime(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Грамм на 1 порцию
              </label>
              <input
                type="number"
                min="50"
                max="400"
                value={gramsPerServing}
                onChange={(e) => setGramsPerServing(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white mt-2 cursor-pointer shadow-sm shadow-amber-500/20"
            >
              Добавить в конструктор
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
