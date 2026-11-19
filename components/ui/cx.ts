export type ClassValue = string | false | null | undefined | 0;

/** Joins truthy class names. Tiny on purpose: no merging, so order is the contract. */
export const cx = (...classes: ClassValue[]): string => classes.filter(Boolean).join(' ');

/** Replaces `{key}` placeholders in a translated string. */
export const fmt = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
