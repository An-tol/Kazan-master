import React from 'react';
import type { FavoriteRecipe, Grain, Protein } from '../types';
import { X, Star, Trash2, ChefHat, Clock } from 'lucide-react';

interface FavoritesModalProps {
  favorites: FavoriteRecipe[];
  grains: Grain[];
  proteins: Protein[];
  onClose: () => void;
  onLoadFavorite: (fav: FavoriteRecipe) => void;
  onDeleteFavorite: (id: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  favorites,
  grains,
  proteins,
  onClose,
  onLoadFavorite,
  onDeleteFavorite
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Избранные рецепты каш</h3>
              <p className="text-[11px] text-slate-400">Сохраненные удачные сочетания круп</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="overflow-y-auto flex-1 my-4 space-y-3 pr-1">
          {favorites.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <ChefHat className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">Пока нет сохраненных рецептов</p>
              <p className="text-xs text-slate-400 mt-1">
                Нажмите «Сохранить» в рецепте, чтобы добавить понравившуюся кашу в избранное!
              </p>
            </div>
          ) : (
            favorites.map((fav) => {
              const protein = proteins.find((p) => p.id === fav.proteinId);
              const favGrains = fav.grainIds.map((id) => grains.find((g) => g.id === id)).filter(Boolean);

              return (
                <div
                  key={fav.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                      {fav.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onDeleteFavorite(fav.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      🥩 {protein?.name.split(' ')[0] || 'Мясо'}
                    </span>
                    {favGrains.map((g) => (
                      <span key={g?.id} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                        {g?.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {fav.createdAt}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        onLoadFavorite(fav);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer text-xs shadow-xs"
                    >
                      Приготовить снова
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
