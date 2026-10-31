import type { Grain, Protein, GeneratedRecipe, RecipeStep, CalculationMode, SpiceStyle, NutritionInfo } from '../types';
import { SPICE_STYLES } from '../data/defaults';
import { formatGrainKitchenMeasure, formatWaterKitchenMeasure, formatSaltKitchenMeasure } from './conversions';

export interface RecipeGeneratorOptions {
  calculationMode?: CalculationMode;
  servings?: number;
  targetProteinGrams?: number;
  targetGrainGrams?: number;
  spiceStyle?: SpiceStyle;
  cannedLegumes?: boolean;
}

export function generateRecipe(
  selectedProtein: Protein,
  selectedGrains: Grain[],
  options: RecipeGeneratorOptions = {}
): GeneratedRecipe {
  if (selectedGrains.length === 0) {
    throw new Error('Выберите хотя бы одну крупу');
  }

  const calculationMode = options.calculationMode || 'servings';
  const spiceStyle = options.spiceStyle || 'classic';
  const cannedLegumes = !!options.cannedLegumes;

  let servings: number = options.servings || 3;
  let proteinGrams: number = servings * selectedProtein.gramsPerServing;
  let totalGrainWeightGrams: number = servings * 80;

  // Mode calculations
  if (calculationMode === 'by_protein' && options.targetProteinGrams) {
    proteinGrams = Math.round(options.targetProteinGrams);
    const calculatedServings = proteinGrams / selectedProtein.gramsPerServing;
    servings = Math.max(1, Math.round(calculatedServings * 10) / 10);
    totalGrainWeightGrams = Math.round(servings * 80);
  } else if (calculationMode === 'by_grain' && options.targetGrainGrams) {
    totalGrainWeightGrams = Math.round(options.targetGrainGrams);
    const calculatedServings = totalGrainWeightGrams / 80;
    servings = Math.max(1, Math.round(calculatedServings * 10) / 10);
    proteinGrams = Math.round(servings * selectedProtein.gramsPerServing);
  }

  // 1. Distribute grain weights
  const numGrains = selectedGrains.length;
  const grainsUsed = selectedGrains.map((originalGrain, idx) => {
    // If user has canned legumes (canned chickpeas/red beans), adapt them!
    const isCanned = cannedLegumes && (originalGrain.id === 'chickpeas' || originalGrain.id === 'red_beans' || originalGrain.id === 'split_peas');
    const grain = isCanned ? {
      ...originalGrain,
      name: `${originalGrain.name} (консервированный)`,
      cookTimeMin: 5,
      waterRatio: 0.5,
      soakRequired: false,
      notes: 'Готовый из банки — добавить за 5 мин до конца варки!'
    } : originalGrain;

    const baseWeight = Math.floor(totalGrainWeightGrams / numGrains);
    const weightGrams = idx === numGrains - 1 
      ? totalGrainWeightGrams - baseWeight * (numGrains - 1)
      : baseWeight;

    const waterMl = Math.round(weightGrams * grain.waterRatio);
    const kitchenMeasure = formatGrainKitchenMeasure(grain, weightGrams);

    return { grain, weightGrams, waterMl, kitchenMeasure };
  });

  // Calculate liquids
  const grainWaterSum = grainsUsed.reduce((sum, g) => sum + g.waterMl, 0);
  const steamBufferMl = Math.round(60 + servings * 15);
  const totalWaterMl = grainWaterSum + steamBufferMl;

  // Vegetables & Aromatics
  const onionPcs = Math.max(1, Math.round(servings * 0.45));
  const onionGrams = onionPcs * 110;

  const carrotPcs = Math.max(1, Math.round(servings * 0.45));
  const carrotGrams = carrotPcs * 120;

  const garlicCloves = Math.max(2, Math.round(servings * 1.5));
  const tomatoPasteTbsp = Math.max(1, Math.round(servings * 0.7));
  const tomatoPasteGrams = tomatoPasteTbsp * 25;

  const oilTbsp = Math.max(2, Math.round(servings * 1.2));
  const oilMl = oilTbsp * 15;

  const saltGrams = Math.round(servings * 3.8);
  const saltKitchen = formatSaltKitchenMeasure(saltGrams);

  // Sort grains by cooking time descending
  const sortedGrains = [...grainsUsed].sort((a, b) => b.grain.cookTimeMin - a.grain.cookTimeMin);
  const maxGrainTime = sortedGrains[0].grain.cookTimeMin;
  const totalCookTimeMin = selectedProtein.fryTimeMin + 7 + maxGrainTime + 10;

  // Nutrition Calculation (KBJU)
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  // Grains nutrition
  grainsUsed.forEach(({ grain, weightGrams }) => {
    const factor = weightGrams / 100;
    totalCalories += (grain.caloriesPer100g || 330) * factor;
    totalProtein += (grain.proteinPer100g || 12) * factor;
    totalFat += (grain.fatPer100g || 2) * factor;
    totalCarbs += (grain.carbsPer100g || 65) * factor;
  });

  // Meat nutrition
  const meatFactor = proteinGrams / 100;
  totalCalories += (selectedProtein.caloriesPer100g || 200) * meatFactor;
  totalProtein += (selectedProtein.proteinPer100g || 20) * meatFactor;
  totalFat += (selectedProtein.fatPer100g || 12) * meatFactor;
  totalCarbs += (selectedProtein.carbsPer100g || 0) * meatFactor;

  // Oil nutrition (1 tbsp oil ~130 kcal, 14g fat)
  const oilCalories = oilTbsp * 125;
  const oilFat = oilTbsp * 14;
  totalCalories += oilCalories;
  totalFat += oilFat;

  // Vegetables nutrition (~80 kcal per serving)
  totalCalories += servings * 60;
  totalCarbs += servings * 12;

  const nutrition: NutritionInfo = {
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein),
    totalFat: Math.round(totalFat),
    totalCarbs: Math.round(totalCarbs),
    perServingCalories: Math.round(totalCalories / servings),
    perServingProtein: Math.round(totalProtein / servings),
    perServingFat: Math.round(totalFat / servings),
    perServingCarbs: Math.round(totalCarbs / servings)
  };

  // Timeline Stages
  interface GrainStage {
    timeFromStartMin: number;
    minutesRemaining: number;
    grains: typeof grainsUsed;
    waterForThisStageMl: number;
  }

  const stages: GrainStage[] = [];
  let allocatedWater = 0;

  for (let i = 0; i < sortedGrains.length; i++) {
    const item = sortedGrains[i];
    const minutesRemaining = item.grain.cookTimeMin;
    const timeFromStartMin = maxGrainTime - minutesRemaining;

    const prevStage = stages[stages.length - 1];
    if (prevStage && Math.abs(prevStage.minutesRemaining - minutesRemaining) <= 3) {
      prevStage.grains.push(item);
      const additionalWater = item.waterMl;
      prevStage.waterForThisStageMl += additionalWater;
      allocatedWater += additionalWater;
    } else {
      const stageWater = item.waterMl + (stages.length === 0 ? steamBufferMl : 0);
      stages.push({
        timeFromStartMin,
        minutesRemaining,
        grains: [item],
        waterForThisStageMl: stageWater
      });
      allocatedWater += stageWater;
    }
  }

  // Soaking warnings
  const soakingWarnings: string[] = [];
  sortedGrains.forEach(({ grain }) => {
    if (grain.soakRequired && !cannedLegumes) {
      soakingWarnings.push(
        `${grain.name} требует предварительного замачивания на ${grain.soakHours || 2} ч. в холодной воде. Если замачивать некогда — включите опцию «Консервированные бобовые» или возьмите баночный нут/фасоль!`
      );
    }
    if (grain.id === 'millet') {
      soakingWarnings.push(
        'Пшенку перед закладкой обязательно ошпарьте крутым кипятком и промойте, чтобы удалить природную масляную пленочку с горчинкой.'
      );
    }
  });

  // Steps construction
  const steps: RecipeStep[] = [];

  // Step 1: Prep
  steps.push({
    title: 'Подготовка ингредиентов',
    description: `Нарежьте лук (${onionPcs} шт.) мелкими кубиками, морковь (${carrotPcs} шт.) — брусочками или соломкой, чеснок (${garlicCloves} зуб.) очистите. Мясо (${selectedProtein.name}, ${proteinGrams} г) нарежьте кусочками. Отмерьте крупы (${grainsUsed.map(g => `${g.grain.name}: ${g.kitchenMeasure} / ${g.weightGrams}г`).join(', ')}). Вскипятите ${totalWaterMl} мл воды (${formatWaterKitchenMeasure(totalWaterMl)}).`,
    alertType: 'info'
  });

  // Step 2: Fry protein
  steps.push({
    title: `Обжарка белка (${selectedProtein.name})`,
    description: `Разогрейте казан на сильном огне, влейте ${oilTbsp} ст. л. растительного масла. Выложите ${selectedProtein.name} (${proteinGrams} г). Обжаривайте без крышки ~${selectedProtein.fryTimeMin} минут до появления золотистой корочки, чтобы мясо запечатало сок внутри.`,
    timeMin: selectedProtein.fryTimeMin,
    alertType: 'timer'
  });

  // Step 3: Zirvak (Veg & Paste & Spices)
  const currentSpicePreset = SPICE_STYLES[spiceStyle];
  const spiceNames = currentSpicePreset.spices.map(s => `${s.name} (${s.amount})`).join(', ');

  steps.push({
    title: `Зирвак: овощи, томатная паста и специи (${currentSpicePreset.name})`,
    description: `Убавьте огонь до среднего. Добавьте к мясу лук (${onionPcs} шт.) и жарьте 3 минуты. Добавьте морковь (${carrotPcs} шт.), обжаривайте ещё 3-4 минуты. Добавьте томатную пасту (${tomatoPasteTbsp} ст. л.), чеснок, соль (${saltGrams} г или ${saltKitchen}) и специи: ${spiceNames}. Тщательно перемешайте и прогрейте 1-2 минуты, чтобы паста отдала кислоту и раскрыла цвет.`,
    timeMin: 7,
    alertType: 'timer'
  });

  // Step 4+: Staggered Grains Addition
  if (stages.length === 1) {
    const stage = stages[0];
    const grainNames = stage.grains.map(g => `${g.grain.name} (${g.weightGrams} г / ${g.kitchenMeasure})`).join(', ');
    steps.push({
      title: `Закладка крупы: ${stage.grains.map(g => g.grain.name).join(' + ')}`,
      description: `Засыпьте в казан ${grainNames}. Разровняйте лопаткой поверх мяса. Аккуратно через шумовку влейте весь кипяток (${totalWaterMl} мл / ${formatWaterKitchenMeasure(totalWaterMl)}). Доведите до активного кипения, убавьте огонь до минимума, плотно закройте крышкой казан и варите ровно ${stage.minutesRemaining} минут. Крышку не открывать!`,
      timeMin: stage.minutesRemaining,
      alertType: 'timer'
    });
  } else {
    stages.forEach((stage, idx) => {
      const grainNames = stage.grains.map(g => `${g.grain.name} (${g.weightGrams} г / ${g.kitchenMeasure})`).join(', ');
      const isFirst = idx === 0;
      const nextStage = stages[idx + 1];
      const waitTime = nextStage ? (stage.minutesRemaining - nextStage.minutesRemaining) : stage.minutesRemaining;
      const waterMeasure = formatWaterKitchenMeasure(stage.waterForThisStageMl);

      if (isFirst) {
        steps.push({
          title: `Этап 1 закладки: ${stage.grains.map(g => g.grain.name).join(' + ')} (Осталось ${stage.minutesRemaining} мин)`,
          description: `Засыпьте самую долгую крупу: ${grainNames}. Влейте ${stage.waterForThisStageMl} мл кипятка (${waterMeasure}). Накройте крышкой казан и варите на тихом огне ровно ${waitTime} минут до следующей закладки.`,
          timeMin: waitTime,
          alertType: 'timer'
        });
      } else {
        const isLast = idx === stages.length - 1;
        steps.push({
          title: `Этап ${idx + 1} закладки: досыпаем ${stage.grains.map(g => g.grain.name).join(' + ')} (Осталось ${stage.minutesRemaining} мин)`,
          description: `Откройте крышку. Засыпьте ${grainNames}. Долейте кипяток (${stage.waterForThisStageMl} мл / ${waterMeasure}). Быстро разровняйте, закройте крышку и продолжайте варить на минимальном огне еще ${waitTime} минут${isLast ? ' до полной готовности' : ' до следующей закладки'}.`,
          timeMin: waitTime,
          alertType: 'timer'
        });
      }
    });
  }

  // Step Final: Rest
  steps.push({
    title: 'Упревание и отдых каши',
    description: `Выключите огонь. Не открывая крышку, укутайте казан плотным полотенцем и дайте постоять 10-15 минут. За это время крупы окончательно вберут весь пар и сок мяса. Перед подачей аккуратно перемешайте снизу вверх. Приятного аппетита!`,
    timeMin: 10,
    alertType: 'success'
  });

  const grainTitles = selectedGrains.map(g => g.name).join(' + ');
  const title = `Каша в казане: ${selectedProtein.name} с ${grainTitles}`;

  return {
    id: `recipe_${Date.now()}`,
    title,
    calculationMode,
    targetInputWeight: calculationMode === 'by_protein' ? proteinGrams : calculationMode === 'by_grain' ? totalGrainWeightGrams : undefined,
    servings,
    totalGrainWeightGrams,
    totalWaterMl,
    totalCookTimeMin,
    spiceStyle,
    grainsUsed,
    proteinUsed: {
      protein: selectedProtein,
      weightGrams: proteinGrams
    },
    ingredients: {
      protein: {
        name: selectedProtein.name,
        amount: `${proteinGrams}`,
        unit: 'г',
        amountGrams: proteinGrams,
        amountKitchenUnits: `${proteinGrams} г (примерно ${proteinGrams > 300 ? '1 упаковка / лоток' : 'порция на сковороду'})`,
        notes: `около ${(proteinGrams / servings).toFixed(0)} г на порцию`
      },
      grains: grainsUsed.map(g => ({
        name: g.grain.name,
        amount: `${g.weightGrams}`,
        unit: 'г',
        amountGrams: g.weightGrams,
        amountKitchenUnits: g.kitchenMeasure,
        notes: `варится ${g.grain.cookTimeMin} мин, воды нужно ~${g.waterMl} мл`
      })),
      vegetables: [
        { 
          name: 'Лук репчатый', 
          amount: `${onionPcs} шт. (~${onionGrams} г)`, 
          unit: 'шт',
          amountGrams: onionGrams,
          amountKitchenUnits: `${onionPcs} шт. (средних)`
        },
        { 
          name: 'Морковь', 
          amount: `${carrotPcs} шт. (~${carrotGrams} г)`, 
          unit: 'шт',
          amountGrams: carrotGrams,
          amountKitchenUnits: `${carrotPcs} шт. (средних)`
        },
        { 
          name: 'Чеснок', 
          amount: `${garlicCloves} зубч.`, 
          unit: 'зубч.', 
          amountKitchenUnits: `${garlicCloves} зубчика (раздавить ножом)`,
          notes: 'раздавить плоской стороной ножа' 
        },
        { 
          name: 'Томатная паста', 
          amount: `${tomatoPasteTbsp} ст. л. (~${tomatoPasteGrams} г)`, 
          unit: 'ст. л.',
          amountGrams: tomatoPasteGrams,
          amountKitchenUnits: `${tomatoPasteTbsp} ст. ложки`
        }
      ],
      liquidsAndSpices: [
        { 
          name: 'Вода (крутой кипяток)', 
          amount: `${totalWaterMl} мл`, 
          unit: 'мл',
          amountGrams: totalWaterMl,
          amountKitchenUnits: formatWaterKitchenMeasure(totalWaterMl),
          notes: 'рассчитано с запасом на выкипание в казане' 
        },
        { 
          name: 'Растительное масло (или жир)', 
          amount: `${oilTbsp} ст. л. (~${oilMl} мл)`, 
          unit: 'ст. л.',
          amountKitchenUnits: `${oilTbsp} ст. ложки`
        },
        { 
          name: 'Соль поваренная', 
          amount: `${saltGrams} г`, 
          unit: 'г',
          amountGrams: saltGrams,
          amountKitchenUnits: saltKitchen,
          notes: 'по вкусу'
        },
        ...currentSpicePreset.spices.map(s => ({
          name: s.name,
          amount: s.amount,
          unit: '',
          amountKitchenUnits: s.amount,
          notes: s.notes
        }))
      ]
    },
    soakingWarnings,
    nutrition,
    steps
  };
}
