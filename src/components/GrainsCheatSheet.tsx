import React, { useState } from 'react';
import type { Grain } from '../types';
import { Search, Clock, Droplets, Info, Sparkles } from 'lucide-react';

interface GrainsCheatSheetProps {
  grains: Grain[];
}

export const GrainsCheatSheet: React.FC<GrainsCheatSheetProps> = ({ grains }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'grain' | 'legume'>('all');

  const filtered = grains.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.notes && g.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || g.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Справочник повара</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Шпаргалка круп и бобовых для казана
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Точные коэффициенты воды, время тепловой обработки и нюансы замачивания
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по крупам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
            filter === 'all' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Все ({grains.length})
        </button>
        <button
          onClick={() => setFilter('grain')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
            filter === 'grain' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Злаки ({grains.filter((g) => g.category === 'grain').length})
        </button>
        <button
          onClick={() => setFilter('legume')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
            filter === 'legume' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Бобовые ({grains.filter((g) => g.category === 'legume').length})
        </button>
      </div>

      {/* Table / Cards */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Крупа / Бобовое</th>
              <th className="py-3 px-3">Категория</th>
              <th className="py-3 px-3">Время варки</th>
              <th className="py-3 px-3">Пропорция воды</th>
              <th className="py-3 px-3">Замачивание</th>
              <th className="py-3 px-3">Особенности</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {filtered.map((g) => (
              <tr key={g.id} className="hover:bg-amber-50/40 transition-colors">
                <td className="py-3.5 px-3 font-bold text-slate-800 whitespace-nowrap">
                  {g.name}
                  {g.isCustom && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-normal">
                      пользовательская
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      g.category === 'legume'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {g.category === 'legume' ? 'Бобовое' : 'Злак'}
                  </span>
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {g.cookTimeMin} мин
                  </span>
                </td>
                <td className="py-3.5 px-3 font-bold text-sky-700 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    1 : {g.waterRatio}
                  </span>
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap">
                  {g.soakRequired ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      <Info className="w-3 h-3" />
                      Замочить {g.soakHours || 2} ч
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Не требуется</span>
                  )}
                </td>
                <td className="py-3.5 px-3 text-slate-500 text-xs leading-relaxed max-w-xs">
                  {g.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
