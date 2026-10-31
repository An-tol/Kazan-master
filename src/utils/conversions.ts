import type { Grain } from '../types';

/**
 * Converts dry grain weight in grams to kitchen measures (glasses and tablespoons)
 * Using standard 250 ml glass (~200-220g dry grain)
 */
export function formatGrainKitchenMeasure(grain: Grain, grams: number): string {
  const glassCapacity = grain.gramsPerGlass || 210;
  const glassFraction = grams / glassCapacity;

  if (grams < 35) {
    const tbsp = Math.round(grams / 20);
    return `${Math.max(1, tbsp)} ст. л. с горкой`;
  }

  // Check simple fractions (0.5, 1, 1.5, 2, 2.5, 3)
  const roundedToQuarter = Math.round(glassFraction * 4) / 4;
  
  if (roundedToQuarter === 0.5) return '1/2 стакана (250 мл)';
  if (roundedToQuarter === 0.25) return '1/4 стакана (или ~3 ст. л. с горкой)';
  if (roundedToQuarter === 0.75) return '3/4 стакана';
  if (roundedToQuarter === 1) return '1 полный стакан (250 мл)';
  if (roundedToQuarter === 1.5) return '1.5 стакана (250 мл)';
  if (roundedToQuarter === 2) return '2 стакана';
  if (roundedToQuarter === 2.5) return '2.5 стакана';
  if (roundedToQuarter === 3) return '3 стакана';

  const fullGlasses = Math.floor(glassFraction);
  const remainderGrams = grams - fullGlasses * glassCapacity;
  const remainderTbsp = Math.round(remainderGrams / 20);

  if (fullGlasses === 0) {
    return `~${glassFraction.toFixed(1)} стакана (${remainderTbsp} ст. л. с горкой)`;
  }

  if (remainderTbsp <= 0) {
    return `${fullGlasses} стак.`;
  }

  return `${fullGlasses} стак. + ${remainderTbsp} ст. л.`;
}

/**
 * Converts water in milliliters to glasses (250 ml) and tablespoons
 */
export function formatWaterKitchenMeasure(ml: number): string {
  const glassMl = 250;
  const fullGlasses = Math.floor(ml / glassMl);
  const remainderMl = ml - fullGlasses * glassMl;
  const remainderTbsp = Math.round(remainderMl / 15);

  if (fullGlasses === 0) {
    return `${remainderTbsp} ст. л. воды`;
  }

  if (remainderTbsp === 0) {
    return `${fullGlasses} стак. кипятка (по 250 мл)`;
  }

  // Fraction approximations
  const fraction = remainderMl / glassMl;
  if (Math.abs(fraction - 0.5) < 0.1) {
    return `${fullGlasses}.5 стакана кипятка (по 250 мл)`;
  }

  return `${fullGlasses} стак. + ${remainderTbsp} ст. л. кипятка`;
}

/**
 * Format salt in teaspoons
 */
export function formatSaltKitchenMeasure(grams: number): string {
  // 1 flat tsp = ~6g, 1 heaping tsp = ~8g
  const tsp = grams / 6;
  if (tsp < 0.8) return '1/2 ч. л. без горки';
  if (tsp < 1.3) return '1 ч. л. без горки';
  if (tsp < 1.8) return '1.5 ч. л.';
  if (tsp < 2.3) return '2 ч. л. без горки';
  return `~${tsp.toFixed(1)} ч. л.`;
}
