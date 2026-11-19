import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Builder',
  description:
    'Build your GitHub profile README section by section, with a live GitHub-style preview, drag-and-drop ordering and one-click export.',
  alternates: {
    canonical: '/builder',
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
      {children}
    </>
  );
}
