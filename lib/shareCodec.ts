// Partage d'une configuration par lien, sans serveur : la configuration (écarts aux valeurs
// par défaut) est sérialisée en JSON, compressée (deflate-raw via CompressionStream) puis encodée
// en base64url dans le fragment de l'URL (`#cfg=…`), qui n'est jamais envoyé au serveur.
// Format : `<version>.<mode>.<données>` — mode `z` = compressé, `j` = JSON brut (navigateurs sans
// CompressionStream). Le décodage ne fait que reconstruire l'objet : la validation est faite par le
// store (`applyConfig`), exactement comme pour un import de fichier JSON.

export const SHARE_PARAM = 'cfg';
const VERSION = '1';
/** Au-delà, un lien devient pénible à partager (messageries, QR codes…). */
export const SHARE_URL_SOFT_LIMIT = 8000;
/** Garde-fou contre les liens forgés trop volumineux (avant et après décompression). */
const MAX_TOKEN_LENGTH = 200_000;
const MAX_JSON_LENGTH = 2_000_000;

const hasCompression = () => typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';

export const toBase64Url = (bytes: Uint8Array): string => {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const fromBase64Url = (text: string): Uint8Array => {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) throw new Error('Invalid base64url');
  const base64 = text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (text.length % 4)) % 4);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const pipe = async (bytes: Uint8Array, stream: CompressionStream | DecompressionStream, limit = Infinity): Promise<Uint8Array> => {
  const writer = stream.writable.getWriter();
  void writer.write(bytes as unknown as BufferSource).then(() => writer.close()).catch(() => undefined);
  const reader = stream.readable.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > limit) {
      await reader.cancel();
      throw new Error('Payload too large');
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
};

/** Encode un objet en jeton de partage. */
export const encodeShareToken = async (config: Record<string, unknown>): Promise<string> => {
  const json = new TextEncoder().encode(JSON.stringify(config));
  if (hasCompression()) {
    const compressed = await pipe(json, new CompressionStream('deflate-raw'));
    return `${VERSION}.z.${toBase64Url(compressed)}`;
  }
  return `${VERSION}.j.${toBase64Url(json)}`;
};

/** Décode un jeton de partage ; `null` s'il est invalide, corrompu ou trop volumineux. */
export const decodeShareToken = async (token: string): Promise<unknown | null> => {
  try {
    if (!token || token.length > MAX_TOKEN_LENGTH) return null;
    const [version, mode, data] = token.split('.');
    if (version !== VERSION || !data) return null;
    let bytes = fromBase64Url(data);
    if (mode === 'z') {
      if (!hasCompression()) return null;
      bytes = await pipe(bytes, new DecompressionStream('deflate-raw'), MAX_JSON_LENGTH);
    } else if (mode !== 'j') {
      return null;
    }
    if (bytes.length > MAX_JSON_LENGTH) return null;
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    return null;
  }
};

/** Lien complet de partage à partir de l'adresse courante. */
export const buildShareUrl = (base: string, token: string) => {
  const url = base.split('#')[0];
  return `${url}#${SHARE_PARAM}=${token}`;
};

/** Extrait le jeton d'un fragment d'URL (`#cfg=…`, éventuellement parmi d'autres paramètres). */
export const readShareToken = (hash: string): string | null => {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const token = params.get(SHARE_PARAM);
  return token && token.trim() ? token.trim() : null;
};
