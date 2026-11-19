import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { buildTemplatePatch } from '@/lib/templates';
import { initialState } from './defaults';
import { CONFIG_KEYS, RUNTIME_KEYS, TRANSIENT_KEYS, configDefaults, pickKeys } from './configKeys';
import { createHistory } from './history';
import { createId } from './ids';
import { buildPatch, buildReplacement, mergePersistedState } from './sanitize';
import { createProfileActions } from './actions/profile';
import { createFeatureActions } from './actions/features';
import { createGithubActions } from './actions/github';
import type { ReadmeState, SetState } from './state';
import type { CustomSectionId } from './types';

// API publique historique : types, garde de section libre et normalisation du layout.
export * from './types';
export { isCustomSectionId, isSectionId, normalizeLayout } from './layout';
export { DEFAULT_LAYOUT, DEFAULT_SECTION_TITLES, initialState } from './defaults';
export { CONFIG_KEYS } from './configKeys';
export type { ReadmeState, ReadmeData, ReadmeActions, ImportedBlock } from './state';

/** Historique annuler / rétablir : ne suit que les clés de configuration du profil. */
const history = createHistory<ReadmeState>({ trackedKeys: CONFIG_KEYS, limit: 100, coalesceMs: 1000, now: () => Date.now() });

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export const useReadmeStore = create<ReadmeState>()(
  persist(
    (rawSet, get) => {
      const syncHistoryFlags = () => {
        const canUndo = history.canUndo();
        const canRedo = history.canRedo();
        const state = get();
        if (state.canUndo !== canUndo || state.canRedo !== canRedo) rawSet({ canUndo, canRedo });
      };

      // Toute mise à jour passant par les actions est enregistrée dans l'historique.
      const set: SetState = (partial) => {
        const before = get();
        rawSet(partial);
        history.record(before, get());
        syncHistoryFlags();
      };

      /** Mise à jour "atomique" : une entrée d'historique à part entière, jamais fusionnée avec la frappe. */
      const commit = (partial: Partial<ReadmeState>) => {
        history.checkpoint();
        set(partial);
        history.checkpoint();
      };

      const getShareableConfig = () => {
        const defaults = configDefaults();
        const current = pickKeys(get(), CONFIG_KEYS);
        const out: Record<string, unknown> = {};
        for (const key of CONFIG_KEYS) {
          if (!sameJson(current[key], defaults[key])) out[key] = current[key];
        }
        return out;
      };

      return {
        ...initialState,
        ...createProfileActions(set, get),
        ...createFeatureActions(set, get),
        ...createGithubActions(set, get),

        exportConfig: () => {
          const state = get() as unknown as Record<string, unknown>;
          const data: Record<string, unknown> = {};
          for (const key of Object.keys(initialState)) {
            if (!TRANSIENT_KEYS.includes(key as keyof typeof initialState)) data[key] = state[key];
          }
          return JSON.stringify(data, null, 2);
        },
        importConfig: (json) => {
          try {
            return get().applyConfig(JSON.parse(json));
          } catch {
            return false;
          }
        },
        applyConfig: (raw) => {
          const next = buildReplacement(raw);
          if (!next) return false;
          commit(next as Partial<ReadmeState>);
          return true;
        },
        patchConfig: (raw) => {
          const patch = buildPatch(raw, get());
          if (!patch) return false;
          commit(patch as Partial<ReadmeState>);
          return true;
        },
        getShareableConfig,
        hasUnsavedWork: () => Object.keys(getShareableConfig()).length > 0,
        applyTemplate: (templateId) => {
          const patch = buildTemplatePatch(templateId, get());
          if (!patch) return false;
          commit(patch as Partial<ReadmeState>);
          return true;
        },
        importReadmeBlocks: (blocks) => {
          const sections = blocks
            .filter((b) => b.title.trim() || b.content.trim())
            .map((b) => ({ id: `custom-${createId()}` as CustomSectionId, title: b.title.trim().slice(0, 300), content: b.content.trim().slice(0, 100000) }));
          // Ids uniques même pour des créations dans la même milliseconde
          const seen = new Set(get().customSections.map((s) => s.id));
          for (const s of sections) {
            while (seen.has(s.id)) s.id = `custom-${createId()}`;
            seen.add(s.id);
          }
          if (sections.length === 0) return [];
          const state = get();
          const footerIndex = state.layout.indexOf('footerBanner');
          const ids = sections.map((s) => s.id);
          const layout = footerIndex >= 0
            ? [...state.layout.slice(0, footerIndex), ...ids, ...state.layout.slice(footerIndex)]
            : [...state.layout, ...ids];
          commit({ customSections: [...state.customSections, ...sections], layout });
          return ids;
        },

        undo: () => {
          const entry = history.undo(get());
          if (entry) rawSet(entry as Partial<ReadmeState>);
          syncHistoryFlags();
        },
        redo: () => {
          const entry = history.redo(get());
          if (entry) rawSet(entry as Partial<ReadmeState>);
          syncHistoryFlags();
        },
        clearHistory: () => {
          history.clear();
          syncHistoryFlags();
        },

        reset: () => commit(initialState as Partial<ReadmeState>),
      };
    },
    {
      name: 'readme-generator-storage',
      storage: createJSONStorage(() => localStorage),
      // Les anciennes sauvegardes (sans les nouvelles clés) sont validées et complétées.
      merge: (persisted, current) => mergePersistedState(persisted, current),
      onRehydrateStorage: () => () => {
        history.clear();
      },
      partialize: (state) => {
        const persisted: Record<string, unknown> = { ...state };
        for (const key of RUNTIME_KEYS) delete persisted[key];
        return persisted as Partial<ReadmeState>;
      },
    },
  ),
);
