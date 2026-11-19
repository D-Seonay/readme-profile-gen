// Petites fonctions pures partagées par les générateurs de sections.

export const enc = encodeURIComponent;

/** Ajoute un schéma aux URLs saisies sans (`exemple.com` → `https://exemple.com`, e-mail → `mailto:`). */
export const normalizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(trimmed)) return `mailto:${trimmed}`;
  return `https://${trimmed}`;
};

/** URL utilisable dans la cible d'un lien Markdown `[..](url)`. */
export const mdUrl = (url: string) => url.replace(/\s/g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');

/** Lien sûr : seuls http(s) et mailto sont acceptés (pas de `javascript:` dans un README). */
export const safeLink = (url: string) => {
  const normalized = normalizeUrl(url);
  return /^(https?:|mailto:)/i.test(normalized) ? mdUrl(normalized) : '';
};

/** Texte alternatif d'image : sans crochets ni retours à la ligne. */
export const mdAlt = (text: string) => text.replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim();

/** Cellule de tableau Markdown : barres verticales échappées, retours à la ligne en `<br>`. */
export const mdCell = (text: string) => text.trim().replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');

/** Texte de lien Markdown sans crochets parasites. */
export const mdLinkText = (text: string) => text.replace(/[[\]]/g, '').trim();

/** Valeur d'attribut HTML. */
export const htmlAttr = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Hex sans '#' (3, 6 ou 8 chiffres) ou `fallback`. */
export const hexOr = (color: string, fallback: string) => {
  const hex = color.trim().replace(/^#/, '');
  return /^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex) ? hex : fallback;
};

export const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : min;

/** Enveloppe centrée façon GitHub (le Markdown reste interprété grâce aux lignes vides). */
export const centerWrap = (md: string, isCentered: boolean) => (isCentered ? `<div align="center">\n\n${md}\n\n</div>` : md);

/** Titre de section en Markdown (`## Titre\n\n`), ou rien si le titre est vide. */
export const heading = (title: string | undefined, level: 2 | 3 = 2) => (title?.trim() ? `${'#'.repeat(level)} ${title.trim()}\n\n` : '');

/**
 * Image adaptée au thème clair / sombre de GitHub (balise `<picture>`).
 * `dark` est aussi l'image par défaut des clients qui ignorent `prefers-color-scheme`.
 */
export const themedPicture = (alt: string, light: string, dark: string, fallback: 'light' | 'dark' = 'light') =>
  [
    '<picture>',
    `  <source media="(prefers-color-scheme: dark)" srcset="${htmlAttr(dark)}" />`,
    `  <source media="(prefers-color-scheme: light)" srcset="${htmlAttr(light)}" />`,
    `  <img alt="${htmlAttr(alt)}" src="${htmlAttr(fallback === 'dark' ? dark : light)}" />`,
    '</picture>',
  ].join('\n');
