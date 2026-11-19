'use client';

import { createContext, useContext } from 'react';
import type { LayoutId } from '@/store/useReadmeStore';

/** Setup plates shown before the README sections, in order. */
export const SETUP_PLATES = ['start', 'templates', 'style', 'tools'] as const;
export type SetupPlateId = (typeof SETUP_PLATES)[number];
export const isSetupPlate = (id: string): id is SetupPlateId => (SETUP_PLATES as readonly string[]).includes(id);

/** Plates the editor can show: the setup plates, then every layout slot. */
export type PlateId = SetupPlateId | LayoutId;

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
