import Link from 'next/link';
import { AUTHOR, ISSUES_URL, REPO_URL } from '@/lib/site';
import { T } from './i18n';
import { Wordmark } from './Masthead';
import { LanguageToggle, ThemeToggle } from './Toggles';
import { WRAP } from './ui';

// Resolved when the page is prerendered.
const YEAR = new Date().getFullYear();

const LINK = 'link-mark font-mono text-sm text-ink';

/**
 * The footer ends the page the way every generated README ends: a rule, then
 * the optional credit line. Below it, a printer's colophon and the end of file.
 */
export function Colophon() {
  return (
    <footer className="border-t border-line-strong">
      <div className={`${WRAP} pb-10 pt-20 lg:pt-28`}>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-10 lg:col-start-3">
            <p className="font-mono text-xs leading-5 text-ink-soft">
              <T k="footer.signatureNote" />
            </p>
            <p aria-hidden="true" className="mt-8 font-mono text-sm leading-none text-accent-text">
              ---
            </p>
            <p className="mt-3 max-w-[24ch] font-display text-[clamp(2.1rem,5.6vw,5.5rem)] italic leading-[1] tracking-[-0.01em] text-balance">
              <T k="footer.signature" />
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-2">
            <Wordmark />
          </div>
          <div className="lg:col-span-4">
            <p className="font-display text-2xl leading-none">
              <T k="footer.colophonTitle" />
            </p>
            <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-ink-soft">
              <T k="footer.colophon" />
            </p>
          </div>
          <nav aria-labelledby="footer-links-title" className="lg:col-span-3">
            <p id="footer-links-title" className="font-display text-2xl leading-none">
              <T k="footer.linksTitle" />
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/builder" className={LINK}>
                  <T k="footer.builder" />
                </Link>
              </li>
              <li>
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
                  <T k="footer.source" />
                </a>
              </li>
              <li>
                <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
                  <T k="footer.bug" />
                </a>
              </li>
              <li>
                <a href={AUTHOR.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                  <T k="footer.author" />
                </a>
              </li>
            </ul>
          </nav>
          <div className="lg:col-span-3">
            <p className="font-display text-2xl leading-none">
              <T k="footer.settingsTitle" />
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <LanguageToggle />
              <ThemeToggle withLabels />
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between gap-6 font-mono text-xs leading-5 text-ink-soft">
          <p>
            © {YEAR} {AUTHOR.name}
          </p>
          <p className="flex items-center gap-2 text-ink">
            <T k="footer.eof" />
            <span aria-hidden="true" className="inline-block h-4 w-2 animate-blink bg-accent" />
          </p>
        </div>
      </div>
    </footer>
  );
}
