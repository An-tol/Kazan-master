import React from 'react';
import { Flame, BookOpen, Settings, UtensilsCrossed, Star } from 'lucide-react';

interface NavbarProps {
  activeTab: 'constructor' | 'cheatsheet' | 'manage';
  setActiveTab: (tab: 'constructor' | 'cheatsheet' | 'manage') => void;
  hasRecipe: boolean;
  favoritesCount: number;
  onOpenFavorites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  hasRecipe,
  favoritesCount,
  onOpenFavorites
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('constructor')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight leading-tight flex items-center gap-2">
              Казан-Мастер
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Каши & Злаки
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Умный конструктор каш из круп и бобовых с точным расчетом воды и времени
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('constructor')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'constructor'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Конструктор</span>
            {hasRecipe && activeTab !== 'constructor' && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>

          <button
            onClick={onOpenFavorites}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
            title="Избранные рецепты"
          >
            <Star className={`w-4 h-4 ${favoritesCount > 0 ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Избранное</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'cheatsheet'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Шпаргалка</span>
            <span className="sm:hidden">Инфо</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'manage'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">База круп</span>
            <span className="sm:hidden">Крупы</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
