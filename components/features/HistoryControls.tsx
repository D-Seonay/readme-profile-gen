'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useHistoryShortcuts } from './useHistoryShortcuts';
import { IconButton, useEngineText } from './ui';

/**
 * Boutons annuler / rétablir de la barre d'outils. Active aussi les raccourcis clavier
 * (Ctrl/⌘ + Z, Ctrl/⌘ + Maj + Z, Ctrl + Y) : à monter une seule fois dans le builder.
 */
export const HistoryControls = () => {
  const canUndo = useReadmeStore((s) => s.canUndo);
  const canRedo = useReadmeStore((s) => s.canRedo);
  const undo = useReadmeStore((s) => s.undo);
  const redo = useReadmeStore((s) => s.redo);
  const { e } = useEngineText();
  useHistoryShortcuts();

  return (
    <div className="flex items-center gap-1" role="group" aria-label={`${e.history.undo} / ${e.history.redo}`}>
      <IconButton label={e.history.undoShortcut} disabled={!canUndo} onClick={undo}>
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 14L4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 010 11H11" />
        </svg>
      </IconButton>
      <IconButton label={e.history.redoShortcut} disabled={!canRedo} onClick={redo}>
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14l5-5-5-5" />
          <path d="M20 9H9.5a5.5 5.5 0 000 11H13" />
        </svg>
      </IconButton>
    </div>
  );
};
