'use client';

import { useEffect } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

const isEditable = (target: EventTarget | null) => {
  if (typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) return false;
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target.isContentEditable;
};

/** Gestionnaire unique, partagé par toutes les instances du hook. */
export const handleHistoryKeyDown = (event: KeyboardEvent) => {
  if (!(event.metaKey || event.ctrlKey) || event.altKey || isEditable(event.target)) return;
  const key = event.key.toLowerCase();
  const { undo, redo } = useReadmeStore.getState();
  if (key === 'z' && !event.shiftKey) {
    event.preventDefault();
    undo();
  } else if ((key === 'z' && event.shiftKey) || (key === 'y' && event.ctrlKey && !event.metaKey)) {
    event.preventDefault();
    redo();
  }
};

let subscribers = 0;

/**
 * Raccourcis annuler / rétablir de la configuration :
 * Ctrl/⌘ + Z, Ctrl/⌘ + Maj + Z et Ctrl + Y.
 * Dans un champ de saisie, le navigateur garde son propre annuler (texte en cours de frappe).
 * Un seul écouteur est installé même si le hook est utilisé à plusieurs endroits.
 */
export const useHistoryShortcuts = () => {
  useEffect(() => {
    if (subscribers === 0) window.addEventListener('keydown', handleHistoryKeyDown);
    subscribers += 1;
    return () => {
      subscribers -= 1;
      if (subscribers === 0) window.removeEventListener('keydown', handleHistoryKeyDown);
    };
  }, []);
};
