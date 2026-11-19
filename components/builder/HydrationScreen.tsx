/**
 * Shown until the persisted store is read. Language-neutral on purpose: it is
 * rendered on the server too, where the user's language is unknown.
 */
export const HydrationScreen = () => (
  <div className="flex h-dvh flex-col bg-canvas text-ink">
    <div className="h-14 shrink-0 border-b border-line-strong bg-surface" />
    <div className="flex min-h-0 flex-1">
      <div className="hidden w-[17rem] shrink-0 border-r border-line bg-surface xl:block" />
      <div className="grid flex-1 place-items-center bg-grid">
        <p className="font-mono text-[13px] text-ink-soft" role="status">
          <span className="text-accent-text">$</span> open README.md
          <span aria-hidden="true" className="ml-1.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] bg-accent animate-blink" />
        </p>
      </div>
      <div className="hidden w-[40%] border-l border-line lg:block" />
    </div>
  </div>
);
