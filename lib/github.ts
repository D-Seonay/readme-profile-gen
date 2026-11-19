// Accès en lecture à l'API publique GitHub (CORS autorisé, sans jeton : 60 requêtes / heure / IP).
const API = 'https://api.github.com';
const enc = encodeURIComponent;

/** Règles des pseudos GitHub : alphanumérique et tirets isolés, 39 caractères au plus. */
export const isValidGithubUsername = (username: string) => /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username);

export const githubApi = {
  user: (username: string) => `${API}/users/${enc(username)}`,
  socialAccounts: (username: string) => `${API}/users/${enc(username)}/social_accounts`,
  followers: (username: string, limit: number) => `${API}/users/${enc(username)}/followers?per_page=${limit}`,
  following: (username: string, limit: number) => `${API}/users/${enc(username)}/following?per_page=${limit}`,
  /** README du dépôt de profil `username/username`, quel que soit le nom exact du fichier. */
  profileReadme: (username: string) => `${API}/repos/${enc(username)}/${enc(username)}/readme`,
  profileWorkflows: (username: string) => `${API}/repos/${enc(username)}/${enc(username)}/contents/.github/workflows`,
};

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/** Texte brut du README de profil, ou `null` s'il n'existe pas. Lève une erreur en cas d'échec réseau ou de quota. */
export const fetchProfileReadme = async (username: string, fetchImpl: FetchLike = fetch): Promise<string | null> => {
  const res = await fetchImpl(githubApi.profileReadme(username), { headers: { Accept: 'application/vnd.github.raw' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(res.status === 403 || res.status === 429 ? 'rate-limited' : `GitHub API error ${res.status}`);
  return res.text();
};

export interface WorkflowFileInfo {
  name: string;
  content: string;
}

/**
 * Fichiers `.github/workflows/*.yml` du dépôt de profil, avec leur contenu (10 au plus),
 * pour vérifier quelles GitHub Actions sont réellement installées. Tableau vide s'il n'y en a pas.
 */
export const fetchProfileWorkflows = async (username: string, fetchImpl: FetchLike = fetch): Promise<WorkflowFileInfo[]> => {
  const res = await fetchImpl(githubApi.profileWorkflows(username));
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(res.status === 403 || res.status === 429 ? 'rate-limited' : `GitHub API error ${res.status}`);
  const data: unknown = await res.json();
  if (!Array.isArray(data)) return [];
  const files = data
    .filter((f): f is { name: string; download_url: string } =>
      typeof f === 'object' && f !== null
      && typeof (f as { name?: unknown }).name === 'string'
      && typeof (f as { download_url?: unknown }).download_url === 'string'
      && /\.ya?ml$/i.test((f as { name: string }).name))
    .slice(0, 10);
  return Promise.all(files.map(async (f) => {
    try {
      const raw = await fetchImpl(f.download_url);
      return { name: f.name, content: raw.ok ? await raw.text() : '' };
    } catch {
      return { name: f.name, content: '' };
    }
  }));
};
