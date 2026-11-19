import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { encodeShareToken } from '@/lib/shareCodec';
import { TEMPLATES } from '@/lib/templates';
import { TemplateGallery } from './TemplateGallery';
import { HistoryControls } from './HistoryControls';
import { ShareLinkLoader } from './ShareLink';
import { FEATURE_SECTION_IDS, FeatureSectionEditor } from './featureSections';
import { WorkflowExport } from './WorkflowExport';
import { HealthCheckPanel } from './HealthCheckPanel';
import { FeaturePanels } from './FeaturePanels';

vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), warning: vi.fn() }) }));

beforeEach(() => {
  useReadmeStore.getState().reset();
  useReadmeStore.getState().clearHistory();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('TemplateGallery', () => {
  it('shows every template with a thumbnail and applies one', () => {
    render(<TemplateGallery />);
    expect(screen.getAllByRole('listitem')).toHaveLength(TEMPLATES.length);
    expect(document.querySelectorAll('svg[role="img"]')).toHaveLength(TEMPLATES.length);
    fireEvent.click(screen.getByRole('button', { name: /Terminal hacker/ }));
    expect(useReadmeStore.getState().skillsDisplay).toBe('icons');
    expect(useReadmeStore.getState().canUndo).toBe(true);
  });
});

describe('HistoryControls', () => {
  it('reflects the history state and undoes / redoes with buttons and shortcuts', () => {
    render(<HistoryControls />);
    const undo = screen.getByRole('button', { name: /Undo/ });
    const redo = screen.getByRole('button', { name: /Redo/ });
    expect((undo as HTMLButtonElement).disabled).toBe(true);

    act(() => useReadmeStore.getState().setName('Ada'));
    expect((undo as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(undo);
    expect(useReadmeStore.getState().name).toBe('John Doe');
    expect((redo as HTMLButtonElement).disabled).toBe(false);

    fireEvent.keyDown(window, { key: 'z', ctrlKey: true, shiftKey: true });
    expect(useReadmeStore.getState().name).toBe('Ada');
    fireEvent.keyDown(window, { key: 'z', metaKey: true });
    expect(useReadmeStore.getState().name).toBe('John Doe');
    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });
    expect(useReadmeStore.getState().name).toBe('Ada');
  });

  it('leaves Ctrl+Z to the browser inside text fields', () => {
    render(<><HistoryControls /><input aria-label="field" /></>);
    act(() => useReadmeStore.getState().setName('Ada'));
    fireEvent.keyDown(screen.getByLabelText('field'), { key: 'z', ctrlKey: true });
    expect(useReadmeStore.getState().name).toBe('Ada');
  });
});

describe('ShareLinkLoader', () => {
  const openLink = async (config: Record<string, unknown>) => {
    window.history.replaceState(null, '', `/builder#cfg=${await encodeShareToken(config)}`);
  };

  it('loads a shared profile directly when there is no work to lose, then clears the hash', async () => {
    await openLink({ name: 'Grace', skills: ['python'] });
    render(<ShareLinkLoader />);
    await waitFor(() => expect(useReadmeStore.getState().name).toBe('Grace'));
    expect(useReadmeStore.getState().skills).toEqual(['python']);
    expect(window.location.hash).toBe('');
  });

  it('asks before overwriting existing work', async () => {
    useReadmeStore.getState().setName('Mine');
    await openLink({ name: 'Grace' });
    render(<ShareLinkLoader />);
    const dialog = await screen.findByRole('alertdialog');
    expect(dialog.textContent).toMatch(/replaces your current work/);
    fireEvent.click(screen.getByRole('button', { name: /Keep mine/ }));
    expect(useReadmeStore.getState().name).toBe('Mine');
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('applies the shared profile on confirmation (and it can be undone)', async () => {
    useReadmeStore.getState().setName('Mine');
    await openLink({ name: 'Grace' });
    render(<ShareLinkLoader />);
    fireEvent.click(await screen.findByRole('button', { name: /Load it/ }));
    expect(useReadmeStore.getState().name).toBe('Grace');
    act(() => useReadmeStore.getState().undo());
    expect(useReadmeStore.getState().name).toBe('Mine');
  });
});

describe('section editors', () => {
  it('renders every new section editor', () => {
    for (const id of FEATURE_SECTION_IDS) {
      const { unmount } = render(<FeatureSectionEditor id={id} />);
      expect(document.body.textContent?.length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('edits the store from the experience editor', () => {
    render(<FeatureSectionEditor id="experience" />);
    fireEvent.click(screen.getByRole('button', { name: /Add a position/ }));
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'Staff Engineer' } });
    expect(useReadmeStore.getState().experience[0].role).toBe('Staff Engineer');
  });

  it('shows a live preview of the animated header once enabled', () => {
    render(<FeatureSectionEditor id="headerBanner" />);
    fireEvent.click(screen.getByRole('switch', { name: /Show this banner/ }));
    expect(useReadmeStore.getState().headerBanner.enabled).toBe(true);
    expect(screen.getByRole('img', { name: /Live preview/ }).getAttribute('src')).toContain('capsule-render.vercel.app/api?type=waving');
  });
});

describe('WorkflowExport', () => {
  it('explains when nothing is needed and lists the needed workflows', () => {
    const { rerender } = render(<WorkflowExport />);
    expect(screen.getByText(/No enabled section needs a workflow/)).toBeTruthy();
    act(() => {
      useReadmeStore.getState().setGithubUsername('octocat');
      useReadmeStore.getState().toggleSnake();
    });
    rerender(<WorkflowExport />);
    expect(screen.getByText('.github/workflows/snake.yml')).toBeTruthy();
    expect(screen.getByText('uses: Platane/snk')).toBeTruthy();
  });
});

describe('HealthCheckPanel', () => {
  it('shows the score and one-click fixes', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ statuses: { trophies: false } }), { status: 200 })));
    act(() => {
      useReadmeStore.getState().setGithubUsername('octocat');
      useReadmeStore.getState().toggleTrophies();
    });
    render(<HealthCheckPanel />);
    const fix = await screen.findByRole('button', { name: 'Disable it' });
    expect(screen.getByText(/github-profile-trophy is reported offline/)).toBeTruthy();
    fireEvent.click(fix);
    expect(useReadmeStore.getState().showTrophies).toBe(false);
  });
});

describe('FeaturePanels', () => {
  it('renders the four tool panels inside the provided wrapper', () => {
    const Section = ({ title, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
      <section aria-label={title}>{children}</section>
    );
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ statuses: {} }), { status: 200 })));
    render(<FeaturePanels Section={Section} />);
    for (const name of ['Templates', 'Import an existing README', 'README Health Check', 'Workflows (GitHub Actions)']) {
      expect(screen.getByRole('region', { name })).toBeTruthy();
    }
  });
});
