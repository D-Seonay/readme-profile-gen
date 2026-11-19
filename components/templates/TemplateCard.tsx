import Link from 'next/link';
import { TemplateThumbnail } from '@/components/features/TemplateGallery';
import { T } from '@/components/landing/i18n';
import type { ProfileTemplate } from '@/lib/templates';
import { ByLang } from './ByLang';

/** A template in a list: schematic thumbnail, name, tags and description, linking to its page. */
export function TemplateCard({ template, headingLevel = 'h2' }: { template: ProfileTemplate; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return (
    <li className="group relative flex flex-col overflow-hidden rounded-sm border border-line-strong bg-surface transition-[translate,box-shadow] duration-150 ease-snap hover:-translate-x-px hover:-translate-y-px hover:shadow-hard focus-within:shadow-hard">
      <div className="border-b border-line-strong">
        <TemplateThumbnail template={template} />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Heading className="font-display text-2xl italic leading-tight">
          <Link href={`/templates/${template.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            <ByLang en={template.name.en} fr={template.name.fr} />
          </Link>
        </Heading>
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          <ByLang
            en={template.tags.en.map((tag) => (
              <li key={tag} className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                {tag}
              </li>
            ))}
            fr={template.tags.fr.map((tag) => (
              <li key={tag} className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                {tag}
              </li>
            ))}
          />
        </ul>
        <p className="flex-1 text-sm leading-relaxed text-ink-soft">
          <ByLang en={template.description.en} fr={template.description.fr} />
        </p>
        <span aria-hidden="true" className="font-mono text-xs text-accent-text">
          <T k="templatesPage.view" /> →
        </span>
      </div>
    </li>
  );
}
