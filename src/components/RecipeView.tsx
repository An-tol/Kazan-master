import React, { useState } from 'react';
import type { GeneratedRecipe } from '../types';
import { 
  Copy, 
  Check, 
  Printer, 
  PlayCircle, 
  AlertTriangle, 
  Scale, 
  Droplets, 
  Clock, 
  ChefHat, 
  Flame,
  Lightbulb
} from 'lucide-react';

interface RecipeViewProps {
  recipe: GeneratedRecipe;
  onStartCookingAssistant: () => void;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ recipe, onStartCookingAssistant }) => {
  const [copied, setCopied] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = () => {
    let text = `🍲 ${recipe.title}\n`;
    text += `Порций: ${recipe.servings} | Время: ~${recipe.totalCookTimeMin} мин | Вода: ${recipe.totalWaterMl} мл\n\n`;
    
    text += `🥩 БЕЛОК:\n`;
    text += `• ${recipe.ingredients.protein.name} — ${recipe.ingredients.protein.amount} ${recipe.ingredients.protein.unit}\n\n`;

    text += `🌾 КРУПЫ (всего ${recipe.totalGrainWeightGrams} г):\n`;
    recipe.ingredients.grains.forEach((g) => {
      text += `• ${g.name} — ${g.amount} ${g.unit} (${g.notes || ''})\n`;
    });
    text += `\n`;

    text += `🥕 ОВОЩИ И ЗАЖАРКА:\n`;
    recipe.ingredients.vegetables.forEach((v) => {
      text += `• ${v.name} — ${v.amount}\n`;
    });
    text += `\n`;

    text += `💧 ВОДА И СПЕЦИИ:\n`;
    recipe.ingredients.liquidsAndSpices.forEach((ls) => {
      text += `• ${ls.name} — ${ls.amount} ${ls.notes ? `(${ls.notes})` : ''}\n`;
    });
    text += `\n`;

    if (recipe.soakingWarnings.length > 0) {
      text += `⚠️ ВАЖНО:\n`;
      recipe.soakingWarnings.forEach((w) => {
        text += `• ${w}\n`;
      });
      text += `\n`;
    }

    text += `👨‍🍳 ПОШАГОВОЕ ПРИГОТОВЛЕНИЕ В КАЗАНЕ:\n`;
    recipe.steps.forEach((step, idx) => {
      text += `${idx + 1}. ${step.title}\n${step.description}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-amber-200/90 shadow-md">
      {/* Title & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Казан-рецепт готов</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-snug">
            {recipe.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Точный расчет воды, ступенчатая закладка круп и пошаговый тайминг
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onStartCookingAssistant}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/25 transition-all cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Режим готовки с таймером</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
            title="Скопировать рецепт в буфер обмена"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
            title="Распечатать рецепт"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Печать</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Время готовки</span>
          </div>
          <p className="text-lg font-black text-slate-800">~{recipe.totalCookTimeMin} мин</p>
          <p className="text-[11px] text-slate-400">включая 10 мин отдыха</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
          <div className="flex items-center gap-1.5 text-xs text-sky-700 mb-1">
            <Droplets className="w-4 h-4 text-sky-500" />
            <span>Всего воды (кипяток)</span>
          </div>
          <p className="text-lg font-black text-sky-800">{recipe.totalWaterMl} мл</p>
          <p className="text-[11px] text-sky-600/75">точно по коэффициентам</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
          <div className="flex items-center gap-1.5 text-xs text-amber-800 mb-1">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>Сухой крупы</span>
          </div>
          <p className="text-lg font-black text-amber-900">{recipe.totalGrainWeightGrams} г</p>
          <p className="text-[11px] text-amber-700/75">на {recipe.servings} порций</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
          <div className="flex items-center gap-1.5 text-xs text-rose-700 mb-1">
            <ChefHat className="w-4 h-4 text-rose-500" />
            <span>Белок ({recipe.proteinUsed.protein.name.split(' ')[0]})</span>
          </div>
          <p className="text-lg font-black text-rose-900">{recipe.proteinUsed.weightGrams} г</p>
          <p className="text-[11px] text-rose-600/75">обжарка ~{recipe.proteinUsed.protein.fryTimeMin} мин</p>
        </div>
      </div>

      {/* Soaking Warning Banner (if any) */}
      {recipe.soakingWarnings.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold mb-1">Обратите внимание перед началом готовки:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-800">
              {recipe.soakingWarnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Ingredients Grid with Checkboxes */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Точные граммовки ингредиентов
          <span className="text-xs font-normal text-slate-400">
            (отмечайте галочками по мере подготовки)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1: Protein & Grains */}
          <div className="space-y-4">
            {/* Protein */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Мясо / Белок
              </h4>
              <label 
                className="flex items-start gap-2.5 cursor-pointer group"
                onClick={() => toggleCheck('protein')}
              >
                <input 
                  type="checkbox" 
                  checked={!!checkedIngredients['protein']} 
                  onChange={() => {}}
                  className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <div className={checkedIngredients['protein'] ? 'line-through opacity-50' : ''}>
                  <div className="font-bold text-sm text-slate-800">
                    {recipe.ingredients.protein.name} — {recipe.ingredients.protein.amount} {recipe.ingredients.protein.unit}
                  </div>
                  <div className="text-xs text-slate-500">{recipe.ingredients.protein.notes}</div>
                </div>
              </label>
            </div>

            {/* Grains */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2.5">
                Крупы и бобовые (Смесь)
              </h4>
              <div className="space-y-2.5">
                {recipe.ingredients.grains.map((g, i) => {
                  const id = `grain_${i}`;
                  const isChecked = !!checkedIngredients[id];
                  return (
                    <label 
                      key={id}
                      className="flex items-start gap-2.5 cursor-pointer group"
                      onClick={() => toggleCheck(id)}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className={isChecked ? 'line-through opacity-50' : ''}>
                        <div className="font-bold text-sm text-slate-800">
                          {g.name} — {g.amount} {g.unit}
                        </div>
                        <div className="text-xs text-slate-500">{g.notes}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Vegetables & Liquids/Spices */}
          <div className="space-y-4">
            {/* Vegetables */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Овощи и зирвак
              </h4>
              <div className="space-y-2">
                {recipe.ingredients.vegetables.map((v, i) => {
                  const id = `veg_${i}`;
                  const isChecked = !!checkedIngredients[id];
                  return (
                    <label 
                      key={id}
                      className="flex items-start gap-2.5 cursor-pointer group"
                      onClick={() => toggleCheck(id)}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className={isChecked ? 'line-through opacity-50' : ''}>
                        <span className="font-semibold text-sm text-slate-800">{v.name}: </span>
                        <span className="text-sm text-slate-700">{v.amount}</span>
                        {v.notes && <span className="text-xs text-slate-500 ml-1">({v.notes})</span>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Liquids & Spices */}
            <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100">
              <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-2.5">
                Вода, масло и специи
              </h4>
              <div className="space-y-2">
                {recipe.ingredients.liquidsAndSpices.map((ls, i) => {
                  const id = `spice_${i}`;
                  const isChecked = !!checkedIngredients[id];
                  return (
                    <label 
                      key={id}
                      className="flex items-start gap-2.5 cursor-pointer group"
                      onClick={() => toggleCheck(id)}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className={isChecked ? 'line-through opacity-50' : ''}>
                        <span className="font-semibold text-sm text-slate-800">{ls.name}: </span>
                        <span className="text-sm text-slate-700 font-medium">{ls.amount}</span>
                        {ls.notes && <span className="text-xs text-slate-500 ml-1">({ls.notes})</span>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Timeline of Staggered Grains */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-200">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          Схема ступенчатой закладки (Синхронизация варки)
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Чтобы крупы приготовились одновременно и не превратились в кашу, добавляйте их по следующей схеме:
        </p>

        <div className="relative pl-6 space-y-4 border-l-2 border-amber-300 ml-2">
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100"></div>
            <p className="text-xs font-bold text-slate-800">Старт (0 мин): Обжарка мяса и зирвака</p>
            <p className="text-[11px] text-slate-500">Подрумяниваем {recipe.proteinUsed.protein.name.split(' ')[0]}, обжариваем лук, морковь, томат и специи (~15 мин)</p>
          </div>

          {recipe.grainsUsed
            .slice()
            .sort((a, b) => b.grain.cookTimeMin - a.grain.cookTimeMin)
            .map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-orange-100"></div>
                <p className="text-xs font-bold text-slate-800">
                  Закладка: {item.grain.name} ({item.weightGrams} г) — варится {item.grain.cookTimeMin} мин
                </p>
                <p className="text-[11px] text-slate-500">
                  Требует ~{item.waterMl} мл кипятка. Закладывается за {item.grain.cookTimeMin} мин до конца варки.
                </p>
              </div>
            ))}

          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
            <p className="text-xs font-bold text-slate-800">Финал (0 мин): Упревание под крышкой (10 мин)</p>
            <p className="text-[11px] text-slate-500">Огонь выключен, казан укутан. Зерна впитывают остаточный пар и становятся рассыпчатыми.</p>
          </div>
        </div>
      </div>

      {/* Step by Step Cooking Instructions */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Пошаговый процесс приготовления
        </h3>

        <div className="space-y-4">
          {recipe.steps.map((step, idx) => {
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                      {step.title}
                    </h4>
                  </div>

                  {step.timeMin && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {step.timeMin} мин
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chef Tips Box */}
      <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-800 mb-1">Секрет идеальной каши в казане:</p>
          <p className="leading-relaxed">
            Если в процессе варки вам покажется, что жидкость выкипела раньше времени (зависит от плотности прилегания крышки казана), не перемешивайте слои! Просто проделайте ножом или ручкой ложки несколько отверстий до самого дна и подлейте 50–70 мл кипятка. А в самом конце, перед упреванием, положите сверху 20–30 г сливочного масла — это сделает вкус ресторанным!
          </p>
        </div>
      </div>
    </div>
  );
};
