'use client';

import React, { useEffect, useRef } from 'react';
import { cx } from './cx';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  /** Where the panel sits: centred card, top sheet (palette) or left drawer. */
  placement?: 'center' | 'top' | 'left';
  /** Element to focus when the dialog opens; defaults to the first focusable. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  panelClassName?: string;
}

/**
 * Modal built on the native <dialog>: the browser provides the focus trap,
 * the inert background, Escape and focus restoration. We add the workbench
 * overlay (paper wash + dot grid) and click-outside to close.
 */
export const Dialog = ({
  open,
  onClose,
  children,
  placement = 'center',
  initialFocusRef,
  panelClassName,
  ...aria
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      const target = initialFocusRef?.current;
      if (target) requestAnimationFrame(() => target.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialFocusRef]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onCloseRef.current();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="atelier-dialog"
      onMouseDown={(event) => {
        // Only a press that starts on the overlay itself closes the dialog.
        if (event.target === event.currentTarget || (event.target as HTMLElement).dataset.overlay === 'true') {
          onClose();
        }
      }}
      {...aria}
    >
      {open && (
        <div
          data-overlay="true"
          className={cx(
            'flex h-full w-full bg-canvas/80 bg-grid animate-fade',
            placement === 'center' && 'items-center justify-center p-4',
            placement === 'top' && 'items-start justify-center px-3 pt-[10vh] sm:pt-[14vh]',
            placement === 'left' && 'items-stretch justify-start',
          )}
        >
          <div
            className={cx(
              'relative border-line-strong bg-surface text-ink',
              placement === 'left'
                ? 'h-full w-[min(320px,88vw)] border-r shadow-hard-lg animate-drawer'
                : 'w-full rounded-[6px] border shadow-hard-lg animate-pop',
              panelClassName,
            )}
          >
            {children}
          </div>
        </div>
      )}
    </dialog>
  );
};
