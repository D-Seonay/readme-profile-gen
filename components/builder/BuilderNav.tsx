'use client';

import { createContext, useContext } from 'react';
import type { LayoutId } from '@/store/useReadmeStore';

/** Plates the editor can show: the two setup plates, then every layout slot. */
export type PlateId = 'start' | 'style' | LayoutId;

interface BuilderNav {
  selected: PlateId;
  select: (id: PlateId) => void;
}

export const BuilderNavContext = createContext<BuilderNav | null>(null);

/**
 * Lets a section editor send people to another plate (e.g. "add your GitHub
 * username in Start"). Returns null outside the builder shell.
 */
export const useBuilderNav = () => useContext(BuilderNavContext);
