'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useReadmeStore } from '@/store/useReadmeStore';
import { getTemplate } from '@/lib/templates';
import { useEngineText } from './ui';

export const TEMPLATE_PARAM = 'template';

/**
 * Mounted once in the builder: `/builder?template=<id>` (the public template
 * pages' "Use this template") applies that template on arrival, exactly like
 * the gallery does: presentation only, undoable from the toast. The parameter
 * is then dropped from the URL so a reload doesn't apply it again.
 */
export const TemplateParamLoader = () => {
  const { e, language } = useEngineText();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const url = new URL(window.location.href);
    const id = url.searchParams.get(TEMPLATE_PARAM);
    if (id === null) return;
    url.searchParams.delete(TEMPLATE_PARAM);
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);

    const template = getTemplate(id);
    const store = useReadmeStore.getState();
    if (!template || !store.applyTemplate(template.id)) return;
    toast.success(`${e.templates.applied} · ${template.name[language]}`, {
      action: { label: e.templates.undo, onClick: () => useReadmeStore.getState().undo() },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- read the link once, on mount
  }, []);

  return null;
};
