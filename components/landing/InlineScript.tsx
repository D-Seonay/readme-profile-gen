'use client';

/**
 * Applies the theme saved by the builder's store before the page paints, so a
 * visitor who chose "paper" never sees a flash of the default "ink" theme.
 * ThemeWrapper keeps <html data-theme> in sync after hydration.
 */
const THEME_BOOT = `(function(){try{var raw=localStorage.getItem('readme-generator-storage');if(!raw)return;var t=JSON.parse(raw).state.uiTheme;if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

/**
 * Runs while the HTML is parsed, before first paint. On the client (hydration,
 * soft navigations) it renders as inert text/plain, so React neither executes
 * nor warns about it; suppressHydrationWarning covers the type difference.
 */
export function ThemeBootScript() {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_BOOT }}
    />
  );
}
