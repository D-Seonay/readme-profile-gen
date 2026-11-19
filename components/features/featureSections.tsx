'use client';

// Registre des sections du moteur étendu : un éditeur par identifiant de section.
// Le builder n'a besoin que d'un `case default` pour les afficher (voir app/builder/page.tsx).
import React, { type ComponentType } from 'react';
import type { FeatureSectionId } from '@/store/useReadmeStore';
import { CapsuleBannerEditor } from './CapsuleBannerEditor';
import { ActivityGraphEditor, QuoteCardEditor, SummaryCardsEditor } from './WidgetEditors';
import { CurrentlyEditor, ExperienceEditor, PinnedEditor } from './ListEditors';

export { FEATURE_SECTION_IDS, isFeatureSectionId, getFeatureLayoutLabels } from '@/lib/featureSections';

const HeaderBannerEditor = () => <CapsuleBannerEditor slot="headerBanner" />;
const FooterBannerEditor = () => <CapsuleBannerEditor slot="footerBanner" />;

export const FEATURE_SECTION_EDITORS: Record<FeatureSectionId, ComponentType> = {
  headerBanner: HeaderBannerEditor,
  footerBanner: FooterBannerEditor,
  activity: ActivityGraphEditor,
  summaryCards: SummaryCardsEditor,
  quote: QuoteCardEditor,
  experience: ExperienceEditor,
  currently: CurrentlyEditor,
  pinned: PinnedEditor,
};

/** Éditeur d'une section du moteur étendu, à placer dans le panneau repliable de la section. */
export const FeatureSectionEditor = ({ id }: { id: FeatureSectionId }) => {
  const Editor = FEATURE_SECTION_EDITORS[id];
  return <Editor />;
};
