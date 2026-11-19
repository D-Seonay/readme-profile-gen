/** Remplace les `{clé}` d'un gabarit de traduction par leurs valeurs. */
export const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in params ? String(params[key]) : match));
