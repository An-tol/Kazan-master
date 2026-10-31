import { DEFAULT_GRAINS, DEFAULT_PROTEINS } from '../data/defaults';
import type { Grain, Protein, FavoriteRecipe } from '../types';

const GRAINS_KEY = 'kazan_calculator_grains_v1';
const PROTEINS_KEY = 'kazan_calculator_proteins_v1';
const FAVORITES_KEY = 'kazan_calculator_favorites_v1';

export function getStoredGrains(): Grain[] {
  try {
    const raw = localStorage.getItem(GRAINS_KEY);
    if (!raw) return DEFAULT_GRAINS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load grains from storage', e);
  }
  return DEFAULT_GRAINS;
}

export function saveStoredGrains(grains: Grain[]) {
  try {
    localStorage.setItem(GRAINS_KEY, JSON.stringify(grains));
  } catch (e) {
    console.error('Failed to save grains to storage', e);
  }
}

export function getStoredProteins(): Protein[] {
  try {
    const raw = localStorage.getItem(PROTEINS_KEY);
    if (!raw) return DEFAULT_PROTEINS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load proteins from storage', e);
  }
  return DEFAULT_PROTEINS;
}

export function saveStoredProteins(proteins: Protein[]) {
  try {
    localStorage.setItem(PROTEINS_KEY, JSON.stringify(proteins));
  } catch (e) {
    console.error('Failed to save proteins to storage', e);
  }
}

export function getStoredFavorites(): FavoriteRecipe[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.error('Failed to load favorites', e);
  }
  return [];
}

export function saveStoredFavorites(favs: FavoriteRecipe[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
}

export function resetStorageToDefaults(): { grains: Grain[]; proteins: Protein[] } {
  localStorage.removeItem(GRAINS_KEY);
  localStorage.removeItem(PROTEINS_KEY);
  return {
    grains: DEFAULT_GRAINS,
    proteins: DEFAULT_PROTEINS
  };
}
