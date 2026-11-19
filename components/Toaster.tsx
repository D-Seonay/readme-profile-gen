'use client';

import React from 'react';
import { Toaster as Sonner } from 'sonner';
import { Icon } from '@/components/ui';

/*
 * Sonner, unstyled and redrawn in the Atelier language: a printed slip with a
 * hard shadow, mono type and a coloured edge (lime = done, coral = failed).
 */
export const Toaster = () => (
  <Sonner
    position="bottom-right"
    closeButton
    gap={10}
    mobileOffset={{ bottom: 84, left: 12, right: 12 }}
    icons={{
      success: <Icon name="check" size={15} strokeWidth={2.25} />,
      error: <Icon name="alert" size={15} />,
      info: <Icon name="info" size={15} />,
      warning: <Icon name="alert" size={15} />,
      close: <Icon name="x" size={12} strokeWidth={2.25} />,
    }}
    toastOptions={{
      unstyled: true,
      classNames: {
        toast:
          'group/toast relative flex w-full items-start gap-3 rounded-[4px] border border-line-strong border-l-[5px] border-l-ink-soft bg-surface py-3 pl-3.5 pr-10 font-mono text-[12.5px] leading-snug text-ink shadow-hard sm:w-[360px]',
        success: '!border-l-accent',
        error: '!border-l-hot-text',
        warning: '!border-l-hot-text',
        icon: 'mt-px flex h-5 w-5 shrink-0 items-center justify-center text-ink',
        content: 'flex min-w-0 flex-1 flex-col gap-0.5',
        title: 'text-ink',
        description: 'text-ink-soft',
        actionButton:
          'ml-auto shrink-0 self-center rounded-[3px] border border-line-strong bg-accent px-2.5 py-1 font-mono text-[11.5px] font-semibold text-accent-ink transition hover:-translate-y-px active:translate-y-px',
        cancelButton: 'shrink-0 self-center rounded-[3px] border border-field px-2.5 py-1 text-[11.5px] text-ink-soft',
        closeButton:
          '!absolute !left-auto !right-2 !top-2.5 !flex !h-6 !w-6 !items-center !justify-center !rounded-[3px] !border !border-transparent !bg-transparent !text-ink-soft hover:!border-line hover:!text-ink !transform-none',
      },
    }}
  />
);
