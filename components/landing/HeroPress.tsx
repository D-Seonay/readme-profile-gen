'use client';

import type { CSSProperties } from 'react';
import { generateMarkdown } from '@/utils/generateMarkdown';
import { useLandingCopy } from './i18n';
import { highlightLine } from './MarkdownSource';
import { CropMarks, ColorBar, RegMark } from './Ornaments';
import { ReadmeBlock } from './ReadmeRender';
import { heroReadme } from './samples';

/**
 * The hero "press": the builder's real output for a sample profile is typed
 * line by line on the left, and each block is printed on the proof as soon as
 * its last line is set. Pure CSS animation on server-rendered markup: the text
 * is in the HTML, nothing waits for JavaScript, and with reduced motion the
 * finished proof is shown at once.
 */

const START = 0.3; // seconds before the first keystroke
const PER_CHAR = 0.007;
const MIN_LINE = 0.12;
const MAX_LINE = 0.26;
const GAP = 0.035;
const VISIBLE_CHARS = 46;

interface TimedLine {
  text: string;
  number: number;
  start: number;
  duration: number;
  steps: number;
}

interface TimedBlock {
  markdown: string;
  lines: TimedLine[];
  printAt: number;
}

function schedule(markdown: string) {
  let clock = START;
  let number = 1;
  const blocks: TimedBlock[] = markdown.split('\n\n').map((markdownBlock) => {
    const lines = markdownBlock.split('\n').map((text) => {
      const visible = Math.min(text.length, VISIBLE_CHARS);
      const duration = Math.min(MAX_LINE, Math.max(MIN_LINE, visible * PER_CHAR));
      const line: TimedLine = { text, number: number++, start: clock, duration, steps: Math.max(3, visible) };
      clock += duration + GAP;
      return line;
    });
    number++; // the blank line between blocks
    const printAt = clock;
    clock += 0.06;
    return { markdown: markdownBlock, lines, printAt };
  });
  return { blocks, end: clock };
}

const vars = (values: Record<string, string | number>) => values as CSSProperties;
const seconds = (value: number) => `${value.toFixed(2)}s`;

export function HeroPress() {
  const { copy, language } = useLandingCopy();
  const markdown = generateMarkdown(heroReadme(language, copy.samples));
  const { blocks, end } = schedule(markdown);

  return (
    <figure className="relative">
      <div className="grid grid-cols-12 items-start">
        {/* Source: decorative duplicate of the proof below, hidden from assistive tech */}
        <div
          aria-hidden="true"
          className="col-span-12 col-start-1 row-start-1 min-w-0 rotate-[0.6deg] rounded-sm border border-line-strong bg-surface shadow-hard sm:col-span-9 sm:col-start-1 lg:col-span-8 lg:col-start-1"
        >
          <div className="flex items-center justify-between border-b border-line px-3 py-2 font-mono text-[11px] leading-4 text-ink-soft">
            <span>{copy.hero.source}</span>
            <span>markdown</span>
          </div>
          <pre className="overflow-hidden px-3 py-3 font-mono text-[11.5px] leading-[1.6rem] sm:text-[12px]">
            <code className="block">
              {blocks.map((block, b) => (
                <span key={b} className="block">
                  {block.lines.map((line) => (
                    <span key={line.number} className="flex">
                      <span className="w-7 shrink-0 select-none text-right text-muted">{line.number}</span>
                      <span
                        data-anim=""
                        className="ml-3 block min-w-0 animate-type truncate text-ink-soft"
                        style={vars({
                          '--type-delay': seconds(line.start),
                          '--type-duration': seconds(line.duration),
                          '--type-steps': line.steps,
                        })}
                      >
                        {highlightLine(line.text)}
                      </span>
                    </span>
                  ))}
                  {b < blocks.length - 1 ? (
                    <span className="flex">
                      <span className="w-7 shrink-0 select-none text-right text-muted">{block.lines.at(-1)!.number + 1}</span>
                    </span>
                  ) : (
                    <span
                      data-anim=""
                      className="ml-10 inline-block animate-print"
                      style={vars({ '--print-delay': seconds(end) })}
                    >
                      <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-accent" />
                    </span>
                  )}
                </span>
              ))}
            </code>
          </pre>
        </div>

        {/* Proof: what GitHub shows */}
        <div className="relative z-10 col-span-12 row-start-2 mx-3 -mt-10 min-w-0 -rotate-[1.2deg] sm:col-span-9 sm:col-start-4 sm:row-start-1 sm:mx-0 sm:mt-28 lg:col-span-8 lg:col-start-5 lg:mt-24">
          <CropMarks />
          <div className="rounded-xs border border-line-strong bg-raised shadow-hard-lg">
            <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] leading-4 text-ink-soft">
              <span>{copy.hero.proof}</span>
              <RegMark className="size-4" />
            </div>
            <div className="px-5 pb-5 pt-1 text-[13.5px] sm:px-7 sm:text-[14px]">
              {blocks.map((block, b) => (
                <div
                  key={b}
                  data-anim=""
                  className="animate-print [&>*:first-child]:mt-0 [&>p:first-child]:mt-4"
                  style={vars({ '--print-delay': seconds(block.printAt) })}
                >
                  <ReadmeBlock markdown={block.markdown} />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-line px-4 py-2">
              <ColorBar />
              <span className="font-mono text-[11px] leading-4 text-ink-soft">{'1/1'}</span>
            </div>
          </div>
          <span
            aria-hidden="true"
            data-anim=""
            className="absolute -right-2 -top-5 animate-stamp-in sm:-right-6"
            style={vars({ '--stamp-delay': seconds(end + 0.1) })}
          >
            <span className="block -rotate-[9deg] rounded-sm border-2 border-hot px-3 py-1 font-display text-2xl italic leading-none text-hot outline-1 outline-offset-2 outline-hot [outline-style:solid]">
              {copy.hero.stamp}
            </span>
          </span>
        </div>
      </div>
      <figcaption className="mt-8 max-w-[52ch] font-mono text-xs leading-5 text-ink-soft sm:mt-10 lg:ml-auto lg:text-right">
        {copy.hero.caption}
      </figcaption>
    </figure>
  );
}
