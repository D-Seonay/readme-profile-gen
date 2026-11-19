'use client';

import React, { type ComponentType, type ReactNode } from 'react';
import { TemplateGallery } from './TemplateGallery';
import { ReadmeImporter } from './ReadmeImporter';
import { HealthCheckPanel } from './HealthCheckPanel';
import { WorkflowExport } from './WorkflowExport';
import { useEngineText } from './ui';

export type SectionWrapper = ComponentType<{ title: string; subtitle?: string; children: ReactNode }>;

/** Panneaux d'outils du moteur, dans l'ordre conseillé (id stable, titre, aide, contenu). */
export const FEATURE_PANELS = [
  { id: 'templates', Panel: TemplateGallery },
  { id: 'importer', Panel: ReadmeImporter },
  { id: 'health', Panel: HealthCheckPanel },
  { id: 'workflows', Panel: WorkflowExport },
] as const;

/**
 * Modèles, import d'un README existant, bilan de santé et workflows, chacun dans le panneau
 * repliable fourni par le builder (`Section`), pour garder le style du shell.
 */
export const FeaturePanels = ({ Section }: { Section: SectionWrapper }) => {
  const { e } = useEngineText();
  const titles: Record<(typeof FEATURE_PANELS)[number]['id'], { title: string; subtitle: string }> = {
    templates: { title: e.templates.label, subtitle: e.templates.help },
    importer: { title: e.importer.label, subtitle: e.importer.help },
    health: { title: e.health.label, subtitle: e.health.help },
    workflows: { title: e.workflows.label, subtitle: e.workflows.help },
  };
  return (
    <>
      {FEATURE_PANELS.map(({ id, Panel }) => (
        <Section key={id} title={titles[id].title} subtitle={titles[id].subtitle}>
          <Panel />
        </Section>
      ))}
    </>
  );
};
