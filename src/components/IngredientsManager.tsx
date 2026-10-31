import React, { useState } from 'react';
import type { Grain, Protein } from '../types';
import { Plus, Trash2, RotateCcw, Clock, Droplets } from 'lucide-react';

interface IngredientsManagerProps {
  grains: Grain[];
  proteins: Protein[];
  onAddGrain: (grain: Omit<Grain, 'id'>) => void;
  onDeleteGrain: (id: string) => void;
  onAddProtein: (protein: Omit<Protein, 'id'>) => void;
  onDeleteProtein: (id: string) => void;
  onResetDefaults: () => void;
}

export const IngredientsManager: React.FC<IngredientsManagerProps> = ({
  grains,
  proteins,
  onAddGrain,
  onDeleteGrain,
  onAddProtein,
  onDeleteProtein,
  onResetDefaults
}) => {
  // Grain form state
  const [grainName, setGrainName] = useState('');
  const [grainCategory, setGrainCategory] = useState<'grain' | 'legume'>('grain');
  const [cookTime, setCookTime] = useState<number>(20);
  const [waterRatio, setWaterRatio] = useState<number>(2.0);
  const [soakRequired, setSoakRequired] = useState(false);
  const [soakHours, setSoakHours] = useState<number>(2);
  const [grainNotes, setGrainNotes] = useState('');

  // Protein form state
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
      notes: grainNotes.trim() || undefined,
      isCustom: true
    });

    setGrainName('');
    setGrainNotes('');
    setCookTime(20);
    setWaterRatio(2.0);
    setSoakRequired(false);
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

    setProteinName('');
    setFryTime(10);
    setGramsPerServing(130);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Reset */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Управление базой круп и мясных ингредиентов
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Добавляйте новые крупы и виды мяса. Все данные сохраняются в памяти вашего браузера.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Сбросить все добавленные крупы и вернуть базовый список?')) {
              onResetDefaults();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить к исходным</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: GRAINS */}
        <div className="space-y-4">
          {/* Add Grain Form */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              Добавить новую крупу / бобовые
            </h3>

            <form onSubmit={handleGrainSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Название крупы <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Зелёная гречка, Амарант, Бурый рис..."
                  value={grainName}
                  onChange={(e) => setGrainName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Категория</label>
                  <select
                    value={grainCategory}
                    onChange={(e) => setGrainCategory(e.target.value as 'grain' | 'legume')}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-500"
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
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Вода (1 : X)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={waterRatio}
                    onChange={(e) => setWaterRatio(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soakRequired}
                    onChange={(e) => setSoakRequired(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-semibold text-slate-700">Требуется замачивание</span>
                </label>

                {soakRequired && (
                  <div className="flex items-center gap-2 pl-6 pt-1">
                    <span className="text-slate-600">Сколько часов:</span>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={soakHours}
                      onChange={(e) => setSoakHours(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg border border-slate-200 bg-white"
                    />
                    <span className="text-slate-500">ч.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Заметки / Особенности вкуса (опционально)
                </label>
                <input
                  type="text"
                  placeholder="Например: предварительно промыть кипятком, сохраняет форму"
                  value={grainNotes}
                  onChange={(e) => setGrainNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
              >
                Сохранить крупу в базу
              </button>
            </form>
          </div>

          {/* Grains List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Крупы в вашей базе ({grains.length})
            </h4>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {grains.map((g) => (
                <div
                  key={g.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{g.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                        {g.category === 'legume' ? 'бобовое' : 'злак'}
                      </span>
                      {g.isCustom && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                          своя
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {g.cookTimeMin} мин
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-sky-500" />
                        1 : {g.waterRatio}
                      </span>
                      {g.soakRequired && <span>💧 {g.soakHours}ч</span>}
                    </div>
                  </div>

                  {g.isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteGrain(g.id)}
                      title="Удалить крупу"
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: PROTEINS */}
        <div className="space-y-4">
          {/* Add Protein Form */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              Добавить свой белковый продукт
            </h3>

            <form onSubmit={handleProteinSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Название продукта <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Баранина, Утка кусочками, Тофу..."
                  value={proteinName}
                  onChange={(e) => setProteinName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Тип</label>
                  <select
                    value={proteinCategory}
                    onChange={(e) => setProteinCategory(e.target.value as 'meat' | 'poultry' | 'veg')}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-500"
                  >
                    <option value="meat">Мясо</option>
                    <option value="poultry">Птица</option>
                    <option value="veg">Постное/Грибы</option>
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
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Грамм / порция</label>
                  <input
                    type="number"
                    min="50"
                    max="400"
                    value={gramsPerServing}
                    onChange={(e) => setGramsPerServing(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
              >
                Сохранить белок в базу
              </button>
            </form>
          </div>

          {/* Proteins List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Белковые основы в базе ({proteins.length})
            </h4>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {proteins.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{p.name}</span>
                      {p.isCustom && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                          своя
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-slate-500">
                      <span>Обжарка: ~{p.fryTimeMin} мин</span>
                      <span>Порция: ~{p.gramsPerServing} г</span>
                    </div>
                  </div>

                  {p.isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteProtein(p.id)}
                      title="Удалить"
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
