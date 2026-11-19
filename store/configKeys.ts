import { initialState, type InitialState, type StateKey } from './defaults';

/** État d'exécution : jamais persisté, exporté, partagé ni historisé. */
export const RUNTIME_KEYS = ['servicesStatus', 'isLoadingGithubData', 'githubFetchError', 'canUndo', 'canRedo'] as const satisfies readonly StateKey[];

/** Jamais exportés (fichier JSON) : état d'exécution + avancement du tour guidé. */
export const TRANSIENT_KEYS: readonly StateKey[] = [...RUNTIME_KEYS, 'isTourActive', 'currentTourStep'];

/** Préférences d'interface : exportées mais ni historisées ni partagées, et conservées si absentes d'un import. */
export const UI_PREF_KEYS = ['language', 'uiTheme', 'hasCompletedTour'] as const satisfies readonly StateKey[];

/** Données récupérées depuis GitHub (cache) : ni historisées ni partagées. */
export const CACHE_KEYS = ['followersList', 'followingList'] as const satisfies readonly StateKey[];

const excluded = new Set<string>([...TRANSIENT_KEYS, ...UI_PREF_KEYS, ...CACHE_KEYS]);

/** Clés qui décrivent le profil lui-même : suivies par l'historique, partagées par lien, remplacées par un import. */
export const CONFIG_KEYS = (Object.keys(initialState) as StateKey[]).filter((key) => !excluded.has(key));

export type ConfigKey = (typeof CONFIG_KEYS)[number];
export type ConfigSnapshot = Partial<Pick<InitialState, StateKey>>;

/** Extrait les valeurs des clés données (copie superficielle : les valeurs sont immuables). */
export const pickKeys = <T extends object>(state: T, keys: readonly string[]): Record<string, unknown> => {
  const source = state as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in source) out[key] = source[key];
  }
  return out;
};

/** Valeurs par défaut des clés de configuration (copies fraîches, sans référence partagée avec `initialState`). */
export const configDefaults = (): Record<string, unknown> =>
  JSON.parse(JSON.stringify(pickKeys(initialState, CONFIG_KEYS))) as Record<string, unknown>;
