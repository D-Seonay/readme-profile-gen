'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useReadmeStore, LayoutId, SectionId } from '@/store/useReadmeStore';
import { useHydration } from '@/hooks/useHydration';
import { useTranslation } from '@/hooks/useTranslation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useIsMac, useMediaQuery } from '@/hooks/useMediaQuery';
import { usePersistentState } from '@/hooks/usePersistentState';
import { useConfigTransfer } from '@/hooks/useConfigTransfer';
import { StyleConfig } from '@/components/StyleConfig';
import { PreviewPane, PreviewPaneHandle } from '@/components/PreviewPane';
import { GithubProfileFetcher } from '@/components/GithubProfileFetcher';
import { ConfirmModal } from '@/components/ConfirmModal';
import { OnboardingTour, TourStep } from '@/components/OnboardingTour';
import { Button, Dialog, Field, Group, Input, Kbd, MenuEntry, cx } from '@/components/ui';
import { ReadmeDocumentProvider, useReadmeDocument } from '@/components/builder/ReadmeDocument';
import { BuilderNavContext, PlateId, isSetupPlate } from '@/components/builder/BuilderNav';
import { TemplateGallery } from '@/components/features/TemplateGallery';
import { ReadmeImporter } from '@/components/features/ReadmeImporter';
import { HealthCheckPanel } from '@/components/features/HealthCheckPanel';
import { WorkflowExport } from '@/components/features/WorkflowExport';
import { ShareLinkLoader } from '@/components/features/ShareLink';
import { TemplateParamLoader } from '@/components/features/TemplateParamLoader';
import { getSlotInfo, renderSlotEditor } from '@/components/builder/sections';
import { Plate, PlateLink } from '@/components/builder/Plate';
import { Outline } from '@/components/builder/Outline';
import { Toolbar } from '@/components/builder/Toolbar';
import { MobileActionBar, MobileView } from '@/components/builder/MobileActionBar';
import { CommandPalette, Command } from '@/components/builder/CommandPalette';
import { SplitHandle } from '@/components/builder/SplitHandle';
import { HydrationScreen } from '@/components/builder/HydrationScreen';

const ISSUES_URL = 'https://github.com/D-Seonay/readme-profile-gen/issues/new';
const PREVIEW_MIN = 360;
const PREVIEW_DEFAULT = 560;

const pad = (n: number) => String(n).padStart(2, '0');
const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/** "Heading in README" field shown at the top of plates whose title is rendered. */
const HeadingField = ({ id, heading, label }: { id: SectionId; heading: string; label: string }) => {
  const { t } = useTranslation();
  const value = useReadmeStore((state) => state.sectionTitles[id]);
  const setSectionTitle = useReadmeStore((state) => state.setSectionTitle);
  return (
    <Field label={t.builder.plate.heading} hint={t.builder.plate.headingHint} id={`plate-heading-${id}`}>
      <Input leading={heading} value={value} onChange={(e) => setSectionTitle(id, e.target.value)} placeholder={label} />
    </Field>
  );
};

function BuilderShell() {
  const { t, language } = useTranslation();
  const layout = useReadmeStore((state) => state.layout);
  const customSections = useReadmeStore((state) => state.customSections);
  const uiTheme = useReadmeStore((state) => state.uiTheme);
  const hasCompletedTour = useReadmeStore((state) => state.hasCompletedTour);
  const { startTour, addCustomSection, toggleUITheme, setLanguage, checkServicesHealth } = useReadmeStore.getState();
  const { isLive } = useReadmeDocument();
  const { handleExport, openImport, fileInput } = useConfigTransfer();
  const isMac = useIsMac();
  const isMdUp = useMediaQuery('(min-width: 768px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const mod = isMac ? '⌘' : 'Ctrl';

  const previewRef = useRef<PreviewPaneHandle>(null);
  const autofillRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const [storedPlate, setStoredPlate] = usePersistentState<string>('readme-builder:plate', 'start', isString);
  const [previewWidth, setPreviewWidth] = usePersistentState<number>('readme-builder:preview-width', PREVIEW_DEFAULT, isNumber);
  const [previewCollapsed, setPreviewCollapsed] = usePersistentState<boolean>('readme-builder:preview-collapsed', false, isBoolean);
  const [view, setView] = useState<MobileView>('edit');
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [viewport, setViewport] = useState(() => window.innerWidth);

  // A stored plate can point at a free section that no longer exists.
  const selected: PlateId =
    isSetupPlate(storedPlate) || layout.includes(storedPlate as LayoutId)
      ? (storedPlate as PlateId)
      : 'start';
  const selectedLayoutId = isSetupPlate(selected) ? undefined : selected;

  // Preview width: never squeeze the editor below a comfortable measure.
  const previewMax = viewport - (isXl ? 272 + 460 : 440);
  const effectivePreviewWidth = Math.round(Math.min(Math.max(previewWidth, PREVIEW_MIN), Math.max(PREVIEW_MIN, previewMax)));

  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Service health lights (stats cards, WakaTime): checked once per visit.
  useEffect(() => {
    checkServicesHealth();
  }, [checkServicesHealth]);

  // First visit: start the coach marks.
  useEffect(() => {
    if (!hasCompletedTour) startTour();
  }, [hasCompletedTour, startTour]);

  const select = (id: PlateId) => {
    setStoredPlate(id);
    setOutlineOpen(false);
    setView('edit');
    editorRef.current?.scrollTo({ top: 0 });
  };

  const addFree = () => {
    const id = addCustomSection();
    select(id);
    requestAnimationFrame(() => document.getElementById(`${id}-title`)?.focus());
  };

  const copy = async () => (await previewRef.current?.handleCopy()) ?? false;
  const download = () => previewRef.current?.handleDownload();

  const showPreview = () => {
    setView('preview');
    setPreviewCollapsed(false);
  };

  const focusAutofill = () => {
    select('start');
    window.setTimeout(() => autofillRef.current?.focus(), 80);
  };

  const confirmReset = () => {
    const before = useReadmeStore.getState();
    const snapshot = before.exportConfig();
    const prefs = { uiTheme: before.uiTheme, language: before.language, tourDone: before.hasCompletedTour };
    before.reset();
    // Interface preferences are not README data: keep them.
    const after = useReadmeStore.getState();
    after.setUITheme(prefs.uiTheme);
    after.setLanguage(prefs.language);
    if (prefs.tourDone) after.completeTour();
    setStoredPlate('start');
    toast(t.builder.reset.done, {
      action: {
        label: t.builder.reset.undo,
        onClick: () => {
          useReadmeStore.getState().importConfig(snapshot);
          toast.success(t.builder.reset.restored);
        },
      },
    });
  };

  useKeyboardShortcuts({
    onCopy: () => {
      void copy();
    },
    onDownload: download,
    // Open only: every way of closing goes through the palette's own close (which resets it).
    onCommandPalette: () => setPaletteOpen(true),
  });

  /* ---------------------------------------------------------------- tour */
  const steps = t.builder.tour.steps;
  const tourSteps: TourStep[] = [
    {
      id: 'autofill',
      target: '[data-tour="autofill"]',
      ...steps.autofill,
      prepare: () => {
        setStoredPlate('start');
        setView('edit');
      },
    },
    {
      id: 'outline',
      target: '[data-tour="outline"], [data-tour="outline-toggle"]',
      title: steps.outline.title,
      // Below 1280px the outline is a drawer: the step points at its button.
      body: isXl ? steps.outline.body : steps.outline.bodyCompact,
    },
    { id: 'plate', target: '[data-tour="plate"]', ...steps.plate, prepare: () => setView('edit') },
    { id: 'preview', target: '[data-tour="preview"]', ...steps.preview, prepare: showPreview },
    { id: 'export', target: '[data-tour="export"]', ...steps.export },
  ];

  const replayTour = () => {
    tourSteps[0].prepare?.();
    startTour();
  };

  /* -------------------------------------------------- palette and menu */
  const slotLabel = (id: LayoutId) => getSlotInfo(id, t, customSections).label;
  const p = t.builder.palette;

  const commands: Command[] = [
    { id: 'jump-start', group: 'jump', label: t.builder.outline.start, icon: 'flag', keywords: 'github auto-fill autofill start', run: () => select('start') },
    { id: 'jump-templates', group: 'jump', label: t.builder.outline.templates, icon: 'layers', keywords: 'templates presets starter kits modeles', run: () => select('templates') },
    { id: 'jump-style', group: 'jump', label: t.builder.outline.style, icon: 'sliders', keywords: 'style design alignment badges headings', run: () => select('style') },
    { id: 'jump-tools', group: 'jump', label: t.builder.outline.tools, icon: 'check', keywords: 'tools health check score workflows actions import readme', run: () => select('tools') },
    ...layout.map((id, index): Command => {
      const info = getSlotInfo(id, t, customSections);
      return {
        id: `jump-${id}`,
        group: 'jump',
        label: info.label,
        icon: info.icon,
        keywords: info.isCustom ? 'custom free' : id,
        meta: (
          <span className="flex items-center gap-2">
            {pad(index + 1)}
            <span aria-hidden="true" className={cx('h-2 w-2 rounded-full border', isLive(id) ? 'border-line-strong bg-accent' : 'border-field')} />
            <span className="sr-only">{isLive(id) ? t.builder.outline.live : t.builder.outline.empty}</span>
          </span>
        ),
        run: () => select(id),
      };
    }),
    { id: 'new-free', group: 'actions', label: p.newSection, icon: 'plus', keywords: 'add section custom', run: addFree },
    { id: 'autofill', group: 'actions', label: p.autofill, icon: 'github', keywords: 'import profile', run: focusAutofill },
    { id: 'copy', group: 'actions', label: t.builder.toolbar.copy, icon: 'copy', shortcut: [mod, 'C'], run: () => void copy() },
    { id: 'download', group: 'actions', label: t.builder.toolbar.downloadLabel, icon: 'download', shortcut: [mod, 'S'], run: download },
    { id: 'export', group: 'actions', label: p.exportConfig, icon: 'braces', keywords: 'json backup save', run: handleExport },
    { id: 'import', group: 'actions', label: p.importConfig, icon: 'upload', keywords: 'json restore load', run: openImport },
    { id: 'undo', group: 'actions', label: t.engine.history.undo, icon: 'undo', shortcut: [mod, 'Z'], run: () => useReadmeStore.getState().undo() },
    { id: 'redo', group: 'actions', label: t.engine.history.redo, icon: 'rotate', shortcut: [mod, '⇧', 'Z'], run: () => useReadmeStore.getState().redo() },
    { id: 'reset', group: 'actions', label: p.reset, icon: 'rotate', keywords: 'clear delete', run: () => setResetOpen(true) },
    {
      id: 'theme',
      group: 'view',
      label: uiTheme === 'dark' ? t.builder.toolbar.themeToLight : t.builder.toolbar.themeToDark,
      icon: uiTheme === 'dark' ? 'sun' : 'moon',
      keywords: 'theme dark light',
      shortcut: [mod, 'T'],
      run: toggleUITheme,
    },
    {
      id: 'language',
      group: 'view',
      label: p.switchLanguage,
      icon: 'languages',
      keywords: 'language langue english francais',
      shortcut: [mod, 'L'],
      run: () => setLanguage(language === 'en' ? 'fr' : 'en'),
    },
    { id: 'gh-theme', group: 'view', label: p.ghTheme, icon: 'github', keywords: 'preview dark light', run: () => previewRef.current?.toggleGithubTheme() },
    {
      id: 'raw',
      group: 'view',
      label: p.viewRaw,
      icon: 'code',
      keywords: 'markdown source raw',
      run: () => {
        previewRef.current?.setViewMode('raw');
        showPreview();
      },
    },
    {
      id: 'rendered',
      group: 'view',
      label: p.viewRendered,
      icon: 'eye',
      keywords: 'preview rendered',
      run: () => {
        previewRef.current?.setViewMode('preview');
        showPreview();
      },
    },
    { id: 'tour', group: 'help', label: p.tour, icon: 'help', keywords: 'help onboarding', run: replayTour },
    { id: 'bug', group: 'help', label: p.bug, icon: 'bug', keywords: 'issue feedback idea', run: () => window.open(ISSUES_URL, '_blank', 'noopener,noreferrer') },
  ];

  const menuItems: MenuEntry[] = [
    { id: 'export', label: p.exportConfig, icon: 'braces', onSelect: handleExport },
    { id: 'import', label: p.importConfig, icon: 'upload', onSelect: openImport },
    ...(!isMdUp
      ? ([
          { type: 'separator', id: 'sep-prefs' },
          {
            id: 'theme',
            label: uiTheme === 'dark' ? t.builder.toolbar.themeToLight : t.builder.toolbar.themeToDark,
            icon: uiTheme === 'dark' ? 'sun' : 'moon',
            onSelect: toggleUITheme,
          },
          { id: 'language', label: p.switchLanguage, icon: 'languages', onSelect: () => setLanguage(language === 'en' ? 'fr' : 'en') },
        ] satisfies MenuEntry[])
      : []),
    { type: 'separator', id: 'sep-help' },
    { id: 'palette', label: p.label, icon: 'search', shortcut: `${mod} K`, onSelect: () => setPaletteOpen(true) },
    { id: 'tour', label: p.tour, icon: 'help', onSelect: replayTour },
    { id: 'bug', label: p.bug, icon: 'bug', external: true, onSelect: () => window.open(ISSUES_URL, '_blank', 'noopener,noreferrer') },
    { type: 'separator', id: 'sep-danger' },
    { id: 'reset', label: p.reset, icon: 'rotate', tone: 'danger', onSelect: () => setResetOpen(true) },
  ];

  /* -------------------------------------------------------------- plates */
  const sequence: PlateId[] = ['start', 'templates', 'style', 'tools', ...layout];
  const position = sequence.indexOf(selected);
  const linkTo = (id: PlateId | undefined): PlateLink | undefined => {
    if (!id) return undefined;
    if (id === 'start') return { label: t.builder.outline.start, onSelect: () => select('start') };
    if (id === 'style') return { label: t.builder.outline.style, onSelect: () => select('style') };
    if (id === 'templates') return { label: t.builder.outline.templates, onSelect: () => select('templates') };
    if (id === 'tools') return { label: t.builder.outline.tools, onSelect: () => select('tools') };
    return { label: slotLabel(id), number: pad(layout.indexOf(id) + 1), onSelect: () => select(id) };
  };
  const prev = linkTo(sequence[position - 1]);
  const next = linkTo(sequence[position + 1]);

  const renderPlate = () => {
    if (selected === 'start') {
      return (
        <Plate key="start" title={t.builder.start.title} help={t.builder.start.help} icon="flag" next={next}>
          <div className="space-y-10">
            <GithubProfileFetcher ref={autofillRef} onContinue={() => select('bio')} continueLabel={t.builder.start.continue} />
            <Group title={t.builder.start.elsewhere}>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="md" iconRight="arrow-right" onClick={() => select('bio')}>
                  {t.builder.start.writeIntro}
                </Button>
                <Button variant="secondary" size="md" icon="upload" onClick={openImport}>
                  {t.builder.start.importConfig}
                </Button>
              </div>
              <p className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-soft">
                <Kbd>{mod}</Kbd>
                <Kbd>K</Kbd>
                <span>{t.builder.start.paletteTip}</span>
              </p>
            </Group>
          </div>
        </Plate>
      );
    }
    if (selected === 'style') {
      return (
        <Plate key="style" title={t.builder.outline.style} help={t.builder.style.help} icon="sliders" prev={prev} next={next}>
          <StyleConfig />
        </Plate>
      );
    }
    if (selected === 'templates') {
      return (
        <Plate key="templates" title={t.builder.outline.templates} help={t.engine.templates.help} icon="layers" prev={prev} next={next}>
          <TemplateGallery />
        </Plate>
      );
    }
    if (selected === 'tools') {
      return (
        <Plate key="tools" title={t.builder.outline.tools} help={t.builder.outline.toolsHelp} icon="check" prev={prev} next={next}>
          <div className="space-y-9">
            <Group first title={t.engine.health.label} hint={t.engine.health.help}>
              <HealthCheckPanel />
            </Group>
            <Group title={t.engine.workflows.label} hint={t.engine.workflows.help}>
              <WorkflowExport />
            </Group>
            <Group title={t.engine.importer.label} hint={t.engine.importer.help}>
              <ReadmeImporter />
            </Group>
          </div>
        </Plate>
      );
    }
    const info = getSlotInfo(selected, t, customSections);
    return (
      <Plate
        key={selected}
        title={info.label}
        help={info.help}
        icon={info.icon}
        number={pad(layout.indexOf(selected) + 1)}
        total={layout.length}
        live={isLive(selected)}
        lead={info.heading && !info.isCustom ? <HeadingField id={selected as SectionId} heading={info.heading} label={info.label} /> : undefined}
        prev={prev}
        next={next}
      >
        {renderSlotEditor(selected)}
      </Plate>
    );
  };

  return (
    <BuilderNavContext.Provider value={{ selected, select }}>
      <div data-builder-root className="flex h-dvh flex-col overflow-hidden bg-canvas text-ink">
        <a
          href="#editor"
          className="sr-only z-50 rounded-[4px] bg-accent px-3 py-2 font-mono text-[12px] text-accent-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          {t.builder.skip}
        </a>

        <Toolbar
          onOpenOutline={() => setOutlineOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onSelect={select}
          onCopy={copy}
          onDownload={download}
          menuItems={menuItems}
        />

        <div ref={rowRef} className="relative flex min-h-0 flex-1" style={{ '--preview-w': `${effectivePreviewWidth}px` } as React.CSSProperties}>
          <aside className="hidden w-[17rem] shrink-0 border-r border-line bg-surface xl:block">
            <Outline selected={selected} onSelect={select} onAddFree={addFree} />
          </aside>

          <main
            id="editor"
            ref={editorRef}
            tabIndex={-1}
            data-tour="plate"
            className={cx('focus-ring-none custom-scrollbar min-w-0 flex-1 overflow-y-auto outline-none', view === 'preview' && 'max-lg:hidden')}
          >
            <div className="mx-auto w-full max-w-[760px] px-4 pb-32 pt-7 sm:px-8 sm:pt-10 lg:pb-20">{renderPlate()}</div>
          </main>

          {!previewCollapsed && (
            <SplitHandle
              className="hidden lg:block"
              targetRef={rowRef}
              width={effectivePreviewWidth}
              min={PREVIEW_MIN}
              max={previewMax}
              defaultWidth={PREVIEW_DEFAULT}
              onCommit={setPreviewWidth}
              label={t.builder.preview.resize}
            />
          )}

          <PreviewPane
            ref={previewRef}
            selectedId={selectedLayoutId}
            onEditSection={select}
            collapsed={previewCollapsed}
            onToggleCollapsed={() => setPreviewCollapsed((value) => !value)}
            className={cx(
              view === 'edit' ? 'hidden lg:flex' : 'flex',
              'w-full max-lg:pb-[68px] lg:w-[var(--preview-w)] lg:shrink-0 lg:border-l lg:border-line',
            )}
          />
        </div>

        <MobileActionBar view={view} onViewChange={setView} onOpenOutline={() => setOutlineOpen(true)} onCopy={copy} onDownload={download} />

        <Dialog open={outlineOpen} onClose={() => setOutlineOpen(false)} placement="left" aria-label={t.builder.outline.title}>
          <Outline selected={selected} onSelect={select} onAddFree={addFree} onClose={() => setOutlineOpen(false)} />
        </Dialog>

        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />

        <ConfirmModal
          isOpen={resetOpen}
          onClose={() => setResetOpen(false)}
          onConfirm={confirmReset}
          title={t.resetBtn}
          description={t.resetConfirm}
          confirmText={t.resetBtn}
          cancelText={t.builder.confirm.cancel}
        />

        <OnboardingTour steps={tourSteps} />
        <ShareLinkLoader />
        <TemplateParamLoader />
        {fileInput}
      </div>
    </BuilderNavContext.Provider>
  );
}

export default function BuilderPage() {
  const hydrated = useHydration();
  if (!hydrated) return <HydrationScreen />;
  return (
    <ReadmeDocumentProvider>
      <BuilderShell />
    </ReadmeDocumentProvider>
  );
}
