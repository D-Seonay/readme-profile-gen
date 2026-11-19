import { translations } from './translations';

/** The landing FAQ, in display order (copy in translations: landing.faq.items). */
export const FAQ_KEYS = ['what', 'add', 'free', 'templates', 'stats', 'badges', 'update', 'import'] as const;

/** Inline marks (`*em*`, `` `code` ``) stripped, for structured data and llms.txt. */
const plain = (text: string) => text.replace(/[*`]/g, '');

/** The FAQ as plain-text question/answer pairs. */
export function faqEntries(language: 'en' | 'fr' = 'en') {
  const items = translations[language].landing.faq.items;
  return FAQ_KEYS.map((key) => ({ question: plain(items[key].q), answer: plain(items[key].a) }));
}
