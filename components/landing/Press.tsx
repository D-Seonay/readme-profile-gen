'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { toast } from 'sonner';
import { getSkillBySlug } from '@/lib/skillsData';
import { useReadmeStore, type BadgeStyle } from '@/store/useReadmeStore';
import { generateMarkdown } from '@/utils/generateMarkdown';
import { useLandingCopy } from './i18n';
import { MarkdownSource } from './MarkdownSource';
import { CropMarks } from './Ornaments';
import { ReadmeRender } from './ReadmeRender';
import { BADGE_STYLES, composeReadme, DEMO_SKILLS, SAMPLE_NAME, SAMPLE_SKILLS } from './samples';
import { BTN_GHOST, BTN_PRIMARY } from './ui';

type Align = 'left' | 'center';
type View = 'proof' | 'markdown';

const CHIP =
  'cursor-pointer select-none rounded-xs border border-line px-2 py-1 font-mono text-xs leading-4 text-ink-soft transition-[translate,box-shadow,background-color,color,border-color] duration-150 ease-snap hover:-translate-x-px hover:-translate-y-px hover:border-line-strong hover:text-ink has-checked:border-line-strong has-checked:bg-accent has-checked:text-accent-ink has-checked:shadow-hard-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-text has-[:focus-visible]:[outline-style:solid]';

const FIELD =
  'w-full min-w-0 rounded-none border-0 border-b border-line bg-transparent px-0 py-1 font-mono text-sm text-ink placeholder:text-muted hover:border-line-strong focus:border-line-strong';

const KEY = 'pt-1 font-mono text-sm leading-6 text-accent-text';

/**
 * "Compose": six fields of the builder, the real generator, a live proof.
 * The demo keeps its own state; "Continue in the builder" hands the edited
 * fields to the builder's store (asking first if a draft is already there).
 */
export function Press() {
  const { copy, language } = useLandingCopy();
  const c = copy.compose;
  const router = useRouter();
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  // null = untouched: the field shows the sample, which follows the language
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>(SAMPLE_SKILLS);
  const [alignment, setAlignment] = useState<Align>('left');
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyle>('for-the-badge');
  const [dirty, setDirty] = useState(false);
  const [view, setView] = useState<View>('proof');
  const [confirming, setConfirming] = useState(false);
  const replaceRef = useRef<HTMLButtonElement>(null);

  const values = {
    name: name ?? SAMPLE_NAME,
    role: role ?? copy.samples.role,
    bio: bio ?? copy.samples.bio,
  };

  const markdown = generateMarkdown(
    composeReadme({
      language,
      ...values,
      skills,
      alignment,
      badgeStyle,
      skillsTitle: copy.samples.skillsTitle,
    }),
  );

  useEffect(() => {
    if (confirming) replaceRef.current?.focus();
  }, [confirming]);

  const touched = () => {
    setDirty(true);
    setConfirming(false);
  };

  const toggleSkill = (slug: string) => {
    setSkills((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]));
    touched();
  };

  const applyDraft = () => {
    useReadmeStore.setState({
      name: values.name,
      title: values.role,
      description: values.bio,
      skills,
      alignment,
      badgeStyle,
    });
  };

  const builderIsEmpty = () => {
    const state = useReadmeStore.getState();
    const initial = useReadmeStore.getInitialState();
    return (
      state.name === initial.name &&
      state.title === initial.title &&
      state.description === initial.description &&
      state.skills.length === 0
    );
  };

  const onContinue = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!dirty) return; // nothing edited: just open the builder
    if (builderIsEmpty()) {
      applyDraft();
      return;
    }
    event.preventDefault();
    setConfirming(true);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success(c.copied);
    } catch {
      toast.error(c.copyError);
    }
  };

  const radio = <V extends string>(group: string, value: V, current: V, set: (v: V) => void, label: string) => (
    <label key={value} className={CHIP}>
      <input
        type="radio"
        name={id(group)}
        value={value}
        checked={current === value}
        onChange={() => {
          set(value);
          touched();
        }}
        className="sr-only"
      />
      {label}
    </label>
  );

  return (
    <div>
      <div className="rounded-sm border border-line-strong bg-surface shadow-hard-lg">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-strong px-3 py-2.5 sm:px-4">
          <p className="flex items-center gap-2 font-mono text-xs leading-5 text-ink-soft">
            <span aria-hidden="true" className={`inline-block size-2 ${dirty ? 'bg-accent' : 'bg-line-strong'}`} />
            {c.file}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onCopy} className={`${BTN_GHOST} px-3 py-2 text-xs`}>
              {c.copy}
            </button>
            <Link href="/builder" onClick={onContinue} className={`${BTN_PRIMARY} px-3.5 py-2 text-xs`}>
              {c.continue}
            </Link>
          </div>
        </div>

        {confirming ? (
          <div
            role="group"
            aria-labelledby={id('confirm-title')}
            aria-describedby={id('confirm-body')}
            className="flex flex-col gap-4 border-b border-line-strong bg-raised px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <p id={id('confirm-title')} className="font-display text-3xl leading-tight">
                {c.replaceTitle}
              </p>
              <p id={id('confirm-body')} className="mt-1 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
                {c.replaceBody}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                ref={replaceRef}
                type="button"
                onClick={() => {
                  applyDraft();
                  router.push('/builder');
                }}
                className={`${BTN_PRIMARY} py-2 text-xs`}
              >
                {c.replace}
              </button>
              <button type="button" onClick={() => router.push('/builder')} className={`${BTN_GHOST} py-2 text-xs`}>
                {c.keep}
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="min-w-0 lg:border-r lg:border-line-strong">
            {/* Front matter: the form, written as the YAML header of the file */}
            <div className="px-4 py-5 sm:px-6 sm:py-6">
              <p aria-hidden="true" className="font-mono text-sm leading-6 text-muted">
                ---
              </p>
              <div className="my-2 grid grid-cols-[minmax(4.75rem,auto)_minmax(0,1fr)] items-start gap-x-4 gap-y-3">
                <label htmlFor={id('name')} className={KEY}>
                  {c.fields.name}:
                </label>
                <input
                  id={id('name')}
                  value={values.name}
                  onChange={(event) => {
                    setName(event.target.value);
                    touched();
                  }}
                  maxLength={48}
                  autoComplete="name"
                  spellCheck={false}
                  className={FIELD}
                />

                <label htmlFor={id('role')} className={KEY}>
                  {c.fields.role}:
                </label>
                <input
                  id={id('role')}
                  value={values.role}
                  onChange={(event) => {
                    setRole(event.target.value);
                    touched();
                  }}
                  maxLength={72}
                  autoComplete="organization-title"
                  className={FIELD}
                />

                <label htmlFor={id('bio')} className={KEY}>
                  {c.fields.bio}:
                </label>
                <textarea
                  id={id('bio')}
                  value={values.bio}
                  onChange={(event) => {
                    setBio(event.target.value.replace(/\n/g, ' '));
                    touched();
                  }}
                  maxLength={160}
                  rows={2}
                  className={`${FIELD} resize-none leading-6`}
                />

                <span id={id('stack')} className={KEY}>
                  {c.fields.stack}:
                </span>
                <div role="group" aria-labelledby={id('stack')} className="flex flex-wrap gap-1.5 pt-0.5">
                  {DEMO_SKILLS.map((slug) => (
                    <label key={slug} className={CHIP}>
                      <input type="checkbox" checked={skills.includes(slug)} onChange={() => toggleSkill(slug)} className="sr-only" />
                      {getSkillBySlug(slug)?.name ?? slug}
                    </label>
                  ))}
                </div>

                <span id={id('align')} className={KEY}>
                  {c.fields.align}:
                </span>
                <div role="radiogroup" aria-labelledby={id('align')} className="flex flex-wrap gap-1.5 pt-0.5">
                  {radio<Align>('align', 'left', alignment, setAlignment, c.fields.left)}
                  {radio<Align>('align', 'center', alignment, setAlignment, c.fields.center)}
                </div>

                <span id={id('badges')} className={KEY}>
                  {c.fields.badges}:
                </span>
                <div role="radiogroup" aria-labelledby={id('badges')} className="flex flex-wrap gap-1.5 pt-0.5">
                  {BADGE_STYLES.map((style) => radio<BadgeStyle>('badges', style, badgeStyle, setBadgeStyle, style))}
                </div>
              </div>
              <p aria-hidden="true" className="font-mono text-sm leading-6 text-muted">
                ---
              </p>
            </div>

            {/* Phones: one pane at a time */}
            <div role="group" aria-label={c.views.label} className="flex border-t border-line-strong lg:hidden">
              {(['proof', 'markdown'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={view === option}
                  onClick={() => setView(option)}
                  className="flex-1 border-r border-line-strong px-4 py-2.5 font-mono text-xs text-ink-soft last:border-r-0 aria-pressed:bg-ink aria-pressed:text-canvas"
                >
                  {c.views[option]}
                </button>
              ))}
            </div>

            <div className={`${view === 'markdown' ? 'block' : 'hidden'} border-t border-line-strong lg:block lg:border-line`}>
              <p className="px-4 pt-3 font-mono text-[11px] leading-4 text-ink-soft sm:px-6">{c.sourceLabel}</p>
              <pre
                tabIndex={0}
                aria-label={c.sourceLabel}
                className="custom-scrollbar max-h-[24rem] overflow-auto px-4 pb-5 pt-3 sm:px-6"
              >
                <MarkdownSource markdown={markdown} />
              </pre>
            </div>
          </div>

          <div className={`${view === 'proof' ? 'block' : 'hidden'} min-w-0 border-t border-line-strong bg-grid lg:block lg:border-t-0`}>
            <div className="relative m-7 sm:m-10 lg:sticky lg:top-10 lg:m-12">
              <CropMarks />
              <div className="rounded-xs border border-line-strong bg-raised px-5 py-6 shadow-hard sm:px-8 sm:py-8">
                <ReadmeRender markdown={markdown} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 font-mono text-xs leading-5 text-ink-soft">{c.continueNote}</p>
    </div>
  );
}
