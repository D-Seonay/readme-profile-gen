// Historique annuler / rétablir de la configuration.
// - Seules les clés suivies (configuration du profil) sont enregistrées : jamais l'état
//   d'exécution ni les préférences d'interface.
// - Les modifications rapides et successives des mêmes clés (frappe au clavier, curseur)
//   sont fusionnées en une seule entrée.
// - L'historique est borné ; un changement net nul (case cochée puis décochée) est oublié.

export interface HistoryOptions {
  /** Clés de l'état suivies par l'historique. */
  trackedKeys: readonly string[];
  /** Nombre maximal d'entrées conservées. */
  limit?: number;
  /** Fenêtre de fusion des modifications successives des mêmes clés (ms). */
  coalesceMs?: number;
  /** Horloge injectable (tests). */
  now?: () => number;
}

export interface HistoryController<S extends object> {
  /** À appeler après chaque mise à jour, avec l'état d'avant et d'après. */
  record: (before: S, after: S) => void;
  /** Renvoie l'instantané à appliquer pour annuler, ou `null`. */
  undo: (current: S) => Record<string, unknown> | null;
  /** Renvoie l'instantané à appliquer pour rétablir, ou `null`. */
  redo: (current: S) => Record<string, unknown> | null;
  clear: () => void;
  /** Termine la fusion en cours : la prochaine modification ouvre une nouvelle entrée. */
  checkpoint: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  size: () => { past: number; future: number };
}

type Snapshot = Record<string, unknown>;

const sameValue = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  return JSON.stringify(a) === JSON.stringify(b);
};

export const createHistory = <S extends object>({ trackedKeys, limit = 100, coalesceMs = 1000, now = Date.now }: HistoryOptions): HistoryController<S> => {
  let past: Snapshot[] = [];
  let future: Snapshot[] = [];
  let lastSignature = '';
  let lastTime = -Infinity;

  const snapshot = (state: S): Snapshot => {
    const source = state as Record<string, unknown>;
    const out: Snapshot = {};
    for (const key of trackedKeys) out[key] = source[key];
    return out;
  };

  const isNoOp = (entry: Snapshot, state: S) => {
    const source = state as Record<string, unknown>;
    return trackedKeys.every((key) => sameValue(entry[key], source[key]));
  };

  return {
    record(before, after) {
      const prev = before as Record<string, unknown>;
      const next = after as Record<string, unknown>;
      const changed = trackedKeys.filter((key) => !Object.is(prev[key], next[key]));
      if (changed.length === 0) return;

      const signature = changed.join('|');
      const time = now();
      const coalesce = signature === lastSignature && time - lastTime < coalesceMs && past.length > 0;
      lastTime = time;

      if (coalesce) {
        // L'entrée en tête contient déjà l'état d'avant la rafale ; si la rafale s'annule, on l'oublie.
        if (isNoOp(past[past.length - 1], after)) {
          past = past.slice(0, -1);
          lastSignature = '';
        }
      } else {
        past = [...past, snapshot(before)].slice(-limit);
        lastSignature = signature;
      }
      future = [];
    },

    undo(current) {
      const entry = past[past.length - 1];
      if (!entry) return null;
      past = past.slice(0, -1);
      future = [...future, snapshot(current)].slice(-limit);
      lastSignature = '';
      return entry;
    },

    redo(current) {
      const entry = future[future.length - 1];
      if (!entry) return null;
      future = future.slice(0, -1);
      past = [...past, snapshot(current)].slice(-limit);
      lastSignature = '';
      return entry;
    },

    clear() {
      past = [];
      future = [];
      lastSignature = '';
    },

    checkpoint() {
      lastSignature = '';
    },

    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0,
    size: () => ({ past: past.length, future: future.length }),
  };
};
