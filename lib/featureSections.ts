// Identifiants et libellés des sections du moteur étendu (sans React : utilisable partout).
import type { FeatureSectionId } from '@/store/types';

export const FEATURE_SECTION_IDS: readonly FeatureSectionId[] = [
  'headerBanner', 'footerBanner', 'activity', 'summaryCards', 'quote', 'experience', 'currently', 'pinned',
];

export const isFeatureSectionId = (id: string): id is FeatureSectionId => (FEATURE_SECTION_IDS as readonly string[]).includes(id);

/** Libellés de layout des nouvelles sections (à fusionner dans ceux du LayoutManager). */
export const getFeatureLayoutLabels = (t: { engine: { sections: Record<FeatureSectionId, string> } }): Record<FeatureSectionId, string> =>
  Object.fromEntries(FEATURE_SECTION_IDS.map((id) => [id, t.engine.sections[id]])) as Record<FeatureSectionId, string>;
