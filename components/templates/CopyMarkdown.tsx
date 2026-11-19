'use client';

import { toast } from 'sonner';
import { useLandingCopy } from '@/components/landing/i18n';
import { BTN_GHOST } from '@/components/landing/ui';

/** Copies a template's sample Markdown, in the visitor's language. */
export function CopyMarkdown({ en, fr }: { en: string; fr: string }) {
  const { copy, language } = useLandingCopy();
  const c = copy.templatesPage;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(language === 'fr' ? fr : en);
      toast.success(c.copied);
    } catch {
      toast.error(c.copyError);
    }
  };

  return (
    <button type="button" onClick={onCopy} className={BTN_GHOST}>
      {c.copy}
    </button>
  );
}
