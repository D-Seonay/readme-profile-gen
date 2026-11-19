'use client';

import React, { useId, useRef } from 'react';
import { Button, Dialog } from '@/components/ui';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  /** `danger` paints the confirm button coral. */
  tone?: 'danger' | 'default';
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  tone = 'danger',
}: ConfirmModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  // Destructive dialogs open on the safe choice.
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      initialFocusRef={cancelRef}
      panelClassName="max-w-md p-6 sm:p-7"
    >
      <h2 id={titleId} className="font-display text-[30px] leading-[1.1] text-ink">
        {title}
      </h2>
      <p id={descriptionId} className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
        {description}
      </p>
      <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button ref={cancelRef} variant="secondary" size="md" onClick={onClose}>
          {cancelText}
        </Button>
        <Button
          variant={tone === 'danger' ? 'danger' : 'accent'}
          size="md"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Dialog>
  );
};
