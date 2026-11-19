'use client';

import React from 'react';
import { toast } from 'sonner';
import { useReadmeStore, CustomSectionId } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { useBuilderNav } from '@/components/builder/BuilderNav';
import { cleanHelp } from '@/components/builder/labels';

/** Éditeur d'une section libre : titre optionnel + Markdown/HTML repris tel quel dans le README. */
export const CustomSectionEditor = ({ id }: { id: CustomSectionId }) => {
  const section = useReadmeStore((state) => state.customSections.find((s) => s.id === id));
  const updateCustomSection = useReadmeStore((state) => state.updateCustomSection);
  const removeCustomSection = useReadmeStore((state) => state.removeCustomSection);
  const { t } = useTranslation();
  const nav = useBuilderNav();

  if (!section) return null;

  // Deleting is instant; the toast offers an undo that restores content and position.
  const handleDelete = () => {
    const { layout, addCustomSection, reorderLayout } = useReadmeStore.getState();
    const index = layout.indexOf(id);
    const snapshot = { title: section.title, content: section.content };
    const neighbour = layout[index - 1] ?? layout[index + 1];

    removeCustomSection(id);
    nav?.select(neighbour ?? 'start');

    toast(t.builder.custom.deleted, {
      action: {
        label: t.builder.custom.undo,
        onClick: () => {
          const restored = addCustomSection();
          useReadmeStore.getState().updateCustomSection(restored, snapshot);
          const target = useReadmeStore.getState().layout[index];
          if (target && target !== restored) reorderLayout(restored, target);
          nav?.select(restored);
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <Field label={t.free.sectionTitle} id={`${id}-title`}>
        <Input
          leading="##"
          value={section.title}
          onChange={(e) => updateCustomSection(id, { title: e.target.value })}
          placeholder="✨ ..."
        />
      </Field>
      <Field label={t.free.sectionContent} hint={cleanHelp(t.free.sectionHelp)} id={`${id}-content`}>
        <Textarea
          mono
          rows={12}
          value={section.content}
          onChange={(e) => updateCustomSection(id, { content: e.target.value })}
          placeholder={t.free.sectionPlaceholder}
          spellCheck={false}
        />
      </Field>
      <div className="flex justify-end border-t border-line pt-5">
        <Button variant="danger-ghost" icon="trash" onClick={handleDelete}>
          {t.free.deleteSection}
        </Button>
      </div>
    </div>
  );
};
