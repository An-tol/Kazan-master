import type { Grain, Protein, GeneratedRecipe, RecipeStep } from '../types';

export function generateRecipe(
  selectedProtein: Protein,
  selectedGrains: Grain[],
  servings: number = 3,
  customGramsDistribution?: Record<string, number>
): GeneratedRecipe {
  if (selectedGrains.length === 0) {
    throw new Error('Выберите хотя бы одну крупу');
  }

  // 1. Calculate grain weights
  const totalGrainWeightGrams = servings * 80;
  const numGrains = selectedGrains.length;

  const grainsUsed = selectedGrains.map((grain, idx) => {
    let weightGrams: number;
    if (customGramsDistribution && customGramsDistribution[grain.id]) {
      weightGrams = customGramsDistribution[grain.id];
    } else {
      // Divide evenly, adjust last grain for rounding
      const baseWeight = Math.floor(totalGrainWeightGrams / numGrains);
      weightGrams = idx === numGrains - 1 
        ? totalGrainWeightGrams - baseWeight * (numGrains - 1)
        : baseWeight;
    }
    const waterMl = Math.round(weightGrams * grain.waterRatio);
    return { grain, weightGrams, waterMl };
  });

  // Calculate liquids
  const grainWaterSum = grainsUsed.reduce((sum, g) => sum + g.waterMl, 0);
  // 100ml buffer for kazan steam loss and tomato/vegetables absorption
  const steamBufferMl = Math.round(70 + servings * 15);
  const totalWaterMl = grainWaterSum + steamBufferMl;

  // Protein
  const proteinGrams = servings * selectedProtein.gramsPerServing;

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

  const saltGrams = Math.round(servings * 3.8); // ~1 tsp flat is ~6g
  const saltDesc = `${saltGrams} г (примерно ${(saltGrams / 6).toFixed(1).replace('.0', '')} ч. л. без горки, по вкусу)`;

  // Sort grains by cooking time descending
  const sortedGrains = [...grainsUsed].sort((a, b) => b.grain.cookTimeMin - a.grain.cookTimeMin);
  const maxGrainTime = sortedGrains[0].grain.cookTimeMin;

  // Total estimated active cook time
  const totalCookTimeMin = selectedProtein.fryTimeMin + 7 + maxGrainTime + 10; // meat + veg + grain boil + resting

  // Group grains into stages (grains with difference <= 3 mins can be added together)
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

    // Check if can be grouped with previous stage (if within 3 mins)
    const prevStage = stages[stages.length - 1];
    if (prevStage && Math.abs(prevStage.minutesRemaining - minutesRemaining) <= 3) {
      prevStage.grains.push(item);
      const additionalWater = item.waterMl;
      prevStage.waterForThisStageMl += additionalWater;
      allocatedWater += additionalWater;
    } else {
      // First stage also gets the steam buffer
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
    if (grain.soakRequired) {
      soakingWarnings.push(
        `${grain.name} требует предварительного замачивания на ${grain.soakHours || 2} ч. в холодной воде. Если времени нет — используйте консервированную или увеличьте время предварительной варки.`
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
    description: `Нарежьте лук мелкими кубиками, морковь — брусочками или соломкой (как на плов), чеснок измельчите либо оставьте целыми очищенными зубчиками. Мясо (${selectedProtein.name}) подготовьте порционно. Промойте крупы холодной водой до прозрачности. Вскипятите чайник с водой — для варки понадобится ровно ${totalWaterMl} мл крутого кипятка.`,
    alertType: 'info'
  });

  // Step 2: Fry protein
  steps.push({
    title: `Обжарка белка (${selectedProtein.name})`,
    description: `Разогрейте казан на сильном огне, влейте растительное масло (${oilTbsp} ст. л. / ${oilMl} мл). Выложите ${selectedProtein.name} (${proteinGrams} г). Обжаривайте без крышки до появления красивой золотистой корочки, периодически помешивая, чтобы мясо «запечаталось» и отдало сок.`,
    timeMin: selectedProtein.fryTimeMin,
    alertType: 'timer'
  });

  // Step 3: Zirvak (Veg & Paste)
  steps.push({
    title: 'Зирвак: лук, морковь, томатная паста и специи',
    description: `Убавьте огонь до среднего. Добавьте к мясу нарезанный лук (${onionGrams} г) и обжаривайте 3 минуты до прозрачности. Затем добавьте морковь (${carrotGrams} г), жарьте ещё 3-4 минуты. Добавьте томатную пасту (${tomatoPasteTbsp} ст. л.), чеснок, специи (зиру, кориандр, паприку) и соль (${saltDesc}). Тщательно перемешайте и прогрейте 1-2 минуты, чтобы паста отдала кислоту и раскрыла цвет.`,
    timeMin: 7,
    alertType: 'timer'
  });

  // Step 4+: Staggered Grains Addition
  if (stages.length === 1) {
    // Single stage (either 1 grain or all grains cook in the same time)
    const stage = stages[0];
    const grainNames = stage.grains.map(g => `${g.grain.name} (${g.weightGrams} г)`).join(', ');
    steps.push({
      title: `Закладка крупы: ${stage.grains.map(g => g.grain.name).join(' + ')}`,
      description: `Засыпьте в казан ${grainNames}. Разровняйте лопаткой поверх мяса с овощами. Аккуратно через шумовку влейте весь кипяток (${totalWaterMl} мл), чтобы не размыть слой. Доведите до активного кипения, убавьте огонь до минимума, плотно закройте крышкой казан и варите ровно ${stage.minutesRemaining} минут. Не открывайте крышку без необходимости!`,
      timeMin: stage.minutesRemaining,
      alertType: 'timer'
    });
  } else {
    // Multiple stages
    stages.forEach((stage, idx) => {
      const grainNames = stage.grains.map(g => `${g.grain.name} (${g.weightGrams} г)`).join(', ');
      const isFirst = idx === 0;
      const nextStage = stages[idx + 1];
      const waitTime = nextStage ? (stage.minutesRemaining - nextStage.minutesRemaining) : stage.minutesRemaining;

      if (isFirst) {
        steps.push({
          title: `Этап 1 закладки крупы: ${stage.grains.map(g => g.grain.name).join(' + ')} (Осталось ${stage.minutesRemaining} мин)`,
          description: `Засыпьте самую долгую крупу: ${grainNames}. Влейте ${stage.waterForThisStageMl} мл кипятка (это порция воды для этой крупы + запас казана). Перемешайте или разровняйте, накройте крышкой и варите на тихом огне ровно ${waitTime} минут до следующей закладки.`,
          timeMin: waitTime,
          alertType: 'timer'
        });
      } else {
        const isLast = idx === stages.length - 1;
        steps.push({
          title: `Этап ${idx + 1} закладки: досыпаем ${stage.grains.map(g => g.grain.name).join(' + ')} (Осталось ${stage.minutesRemaining} мин)`,
          description: `Откройте казан. Засыпьте ${grainNames}. Долейте горячий кипяток (${stage.waterForThisStageMl} мл). Быстро разровняйте лопаткой, снова плотно закройте крышку и продолжайте варить на минимальном огне еще ${waitTime} минут${isLast ? ' до полной готовности' : ' до следующей закладки'}.`,
          timeMin: waitTime,
          alertType: 'timer'
        });
      }
    });
  }

  // Step Final: Rest / Steaming
  steps.push({
    title: 'Упревание и отдых каши',
    description: `Выключите огонь. Не открывая крышку, укутайте казан плотным полотенцем или пледом и оставьте на 10-15 минут. За это время крупы окончательно вберут остаточный пар, объединятся соками с мясом и станут шелковистыми и рассыпчатыми. Перед подачей аккуратно перемешайте снизу вверх. Приятного аппетита!`,
    timeMin: 10,
    alertType: 'success'
  });

  // Title calculation
  const grainTitles = selectedGrains.map(g => g.name).join(' + ');
  const title = `Каша в казане: ${selectedProtein.name} с ${grainTitles}`;

  return {
    title,
    servings,
    totalGrainWeightGrams,
    totalWaterMl,
    totalCookTimeMin,
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
        notes: `около ${(proteinGrams / servings).toFixed(0)} г на порцию`
      },
      grains: grainsUsed.map(g => ({
        name: g.grain.name,
        amount: `${g.weightGrams}`,
        unit: 'г',
        notes: `варится ${g.grain.cookTimeMin} мин, воды нужно ~${g.waterMl} мл`
      })),
      vegetables: [
        { name: 'Лук репчатый', amount: `${onionPcs} шт. (~${onionGrams} г)`, unit: 'шт' },
        { name: 'Морковь', amount: `${carrotPcs} шт. (~${carrotGrams} г)`, unit: 'шт' },
        { name: 'Чеснок', amount: `${garlicCloves}`, unit: 'зубч.', notes: 'раздавить плоской стороной ножа' },
        { name: 'Томатная паста', amount: `${tomatoPasteTbsp} ст. л. (~${tomatoPasteGrams} г)`, unit: 'ст. л.' }
      ],
      liquidsAndSpices: [
        { name: 'Вода (крутой кипяток)', amount: `${totalWaterMl}`, unit: 'мл', notes: 'рассчитано с учетом запаса на выкипание в казане' },
        { name: 'Растительное масло (или жир)', amount: `${oilTbsp} ст. л. (~${oilMl} мл)`, unit: 'ст. л.' },
        { name: 'Соль поваренная', amount: saltDesc, unit: 'г' },
        { name: 'Зира (кумин)', amount: '1/2 ч. л.', unit: 'ч. л.', notes: 'растереть пальцами' },
        { name: 'Кориандр молотый', amount: '1/2 ч. л.', unit: 'ч. л.' },
        { name: 'Паприка сладкая', amount: '1 ч. л.', unit: 'ч. л.', notes: 'для насыщенного цвета' },
        { name: 'Черный перец', amount: 'по вкусу', unit: '' }
      ]
    },
    soakingWarnings,
    steps
  };
}
