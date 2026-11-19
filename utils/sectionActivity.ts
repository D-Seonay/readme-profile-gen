import type { LayoutId } from '@/store/types';
import { renderSection, type MarkdownInput } from './generateMarkdown';

/** Une section est active si elle produit du Markdown : même règle que le générateur, sans duplication. */
export const isSectionActive = (data: MarkdownInput, id: LayoutId) => renderSection(data, id).trim() !== '';
