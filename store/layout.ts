import { DEFAULT_LAYOUT } from './defaults';
import type { CustomSection, CustomSectionId, LayoutId, SectionId } from './types';

export const isCustomSectionId = (id: string): id is CustomSectionId => id.startsWith('custom-');

const KNOWN_SECTIONS = new Set<string>(DEFAULT_LAYOUT);
export const isSectionId = (id: unknown): id is SectionId => typeof id === 'string' && KNOWN_SECTIONS.has(id);

/**
 * Garantit qu'un layout contient toutes les sections connues, sans doublon ni section orpheline.
 * Les sections manquantes (ajoutées depuis la sauvegarde) sont placées en fin de layout,
 * dans l'ordre par défaut : elles sont vides tant qu'on ne les configure pas.
 */
export const normalizeLayout = (layout: unknown, customSections: readonly Pick<CustomSection, 'id'>[]): LayoutId[] => {
  const customIds = customSections.map((s) => s.id);
  const known = new Set<string>([...DEFAULT_LAYOUT, ...customIds]);
  const seen = new Set<string>();
  const result: LayoutId[] = [];
  for (const id of Array.isArray(layout) ? layout : []) {
    if (typeof id === 'string' && known.has(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id as LayoutId);
    }
  }
  for (const id of [...DEFAULT_LAYOUT, ...customIds]) {
    if (!seen.has(id)) result.push(id);
  }
  return result;
};

/** Déplace une section en tête ou en fin de layout. */
export const moveToEdge = (layout: readonly LayoutId[], id: LayoutId, edge: 'start' | 'end'): LayoutId[] => {
  const rest = layout.filter((l) => l !== id);
  return edge === 'start' ? [id, ...rest] : [...rest, id];
};

/** Déplace un élément d'une liste d'une position vers le haut (-1) ou le bas (+1). */
export const moveById = <T extends { id: string }>(list: readonly T[], id: string, direction: -1 | 1): T[] => {
  const index = list.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= list.length) return [...list];
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
};
