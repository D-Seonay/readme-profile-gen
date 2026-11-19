import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { SITE_NAME } from '@/lib/site';
import { breadcrumbNode } from '@/lib/structuredData';

const TITLE = 'GitHub Profile README Builder';
const DESCRIPTION =
  'Build your GitHub profile README section by section: auto-fill from your username, badges, stats cards, banners and templates, a live GitHub-style preview, then copy README.md.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/builder',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/builder',
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@DSeonay',
  },
};

/*
 * Applies the stored theme before the first paint, so people who chose the
 * light theme don't get a dark flash on a full page load (see Next's
 * "preventing flash before hydration" guide). <html> already carries
 * suppressHydrationWarning in the root layout.
 */
const THEME_SCRIPT = `try{var s=JSON.parse(localStorage.getItem('readme-generator-storage')||'null');var t=s&&s.state&&s.state.uiTheme;if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}`;

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      <JsonLd
        data={breadcrumbNode([
          { name: SITE_NAME, path: '/' },
          { name: 'Builder', path: '/builder' },
        ])}
      />
      {children}
    </>
  );
}
