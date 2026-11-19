import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/**
 * The social card, in the Atelier style: the hero's claim set in Instrument
 * Serif on ink, with a Markdown plate and its printed proof. Generated at
 * build time; fonts are read from assets/og (SIL OFL, licences alongside).
 */

export const alt = 'Your GitHub profile is a Markdown file. Ultimate README Gen writes it for you.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Satori can't read CSS variables: these mirror the Atelier tokens of the ink theme.
const C = {
  canvas: '#0b0b0c',
  surface: '#131315',
  line: '#2a2a30',
  lineStrong: '#45454d',
  ink: '#f2efe8',
  inkSoft: '#c2beb4',
  muted: '#86837b',
  accent: '#c8f542',
  accentInk: '#0b0b0c',
  hot: '#ff5c39',
  paper: '#f3efe6',
  paperInk: '#16150f',
  paperLine: '#ddd6c7',
};

const fontDir = join(process.cwd(), 'assets', 'og');
const [serif, serifItalic, mono] = await Promise.all([
  readFile(join(fontDir, 'InstrumentSerif-Regular.ttf')),
  readFile(join(fontDir, 'InstrumentSerif-Italic.ttf')),
  readFile(join(fontDir, 'JetBrainsMono-Regular.ttf')),
]);

function SourceLine({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 18, fontSize: 19, lineHeight: '32px' }}>
      <span style={{ color: C.muted, width: 18, textAlign: 'right' }}>{n}</span>
      <span style={{ display: 'flex', color: C.inkSoft }}>{children}</span>
    </div>
  );
}

function Badge({ label, bg, fg = '#ffffff' }: { label: string; bg: string; fg?: string }) {
  return (
    <span
      style={{
        display: 'flex',
        background: bg,
        color: fg,
        fontFamily: 'JetBrains Mono',
        fontSize: 15,
        letterSpacing: 2,
        padding: '6px 12px',
      }}
    >
      {label}
    </span>
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: C.canvas,
          backgroundImage: 'radial-gradient(circle, rgba(242,239,232,0.08) 1.2px, transparent 1.4px)',
          backgroundSize: '24px 24px',
          color: C.ink,
          padding: '48px 64px',
          fontFamily: 'Instrument Serif',
        }}
      >
        {/* Masthead */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 6,
              background: C.accent,
              color: C.accentInk,
              fontFamily: 'JetBrains Mono',
              fontSize: 28,
            }}
          >
            #
          </div>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: -0.5 }}>README</span>
          <span style={{ fontStyle: 'italic', fontSize: 32, marginLeft: -4 }}>Gen</span>
          <span style={{ marginLeft: 18, fontFamily: 'JetBrains Mono', fontSize: 16, color: C.muted }}>you/you/README.md</span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', marginTop: 46, position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: -2,
              top: 20,
              fontFamily: 'JetBrains Mono',
              fontSize: 38,
              color: C.accent,
            }}
          >
            #
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 48, lineHeight: 0.9, letterSpacing: -2 }}>
            <span style={{ fontSize: 98 }}>Your GitHub profile</span>
            <span style={{ fontSize: 98, fontStyle: 'italic' }}>is a Markdown file.</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 36,
            marginLeft: 50,
            fontFamily: 'JetBrains Mono',
            fontSize: 19,
            lineHeight: 1.5,
            color: C.inkSoft,
          }}
        >
          <span>Fields in, README.md out.</span>
          <span>Badges, stats, sections, live preview.</span>
        </div>

        {/* Markdown plate */}
        <div
          style={{
            position: 'absolute',
            right: 232,
            bottom: 96,
            display: 'flex',
            flexDirection: 'column',
            width: 400,
            background: C.surface,
            border: `1px solid ${C.lineStrong}`,
            boxShadow: `6px 6px 0 0 ${C.lineStrong}`,
            transform: 'rotate(1.5deg)',
            fontFamily: 'JetBrains Mono',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 14px',
              borderBottom: `1px solid ${C.line}`,
              fontSize: 14,
              color: C.inkSoft,
            }}
          >
            <span>README.md</span>
            <span>markdown</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 14px 14px' }}>
            <SourceLine n={1}>
              <span style={{ color: C.accent }}>#&nbsp;</span>
              <span style={{ color: C.ink }}>Hello, I&apos;m you</span>
            </SourceLine>
            <SourceLine n={2}>
              <span style={{ color: C.accent }}>##&nbsp;</span>
              <span style={{ color: C.ink }}>Open-source developer</span>
            </SourceLine>
            <SourceLine n={3}>
              <span style={{ color: C.accent }}>![</span>
              <span style={{ color: C.ink }}>Rust</span>
              <span style={{ color: C.accent }}>](</span>
              <span>img.shields.io/…</span>
              <span style={{ color: C.accent }}>)</span>
            </SourceLine>
            <SourceLine n={4}>
              <span style={{ color: C.accent }}>---</span>
            </SourceLine>
          </div>
        </div>

        {/* Printed proof, on paper */}
        <div
          style={{
            position: 'absolute',
            right: 56,
            bottom: 44,
            display: 'flex',
            flexDirection: 'column',
            width: 360,
            background: C.paper,
            color: C.paperInk,
            border: `1px solid ${C.paperInk}`,
            boxShadow: `8px 8px 0 0 ${C.accent}`,
            transform: 'rotate(-3deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 14px',
              borderBottom: `1px solid ${C.paperLine}`,
              fontFamily: 'JetBrains Mono',
              fontSize: 13,
              color: '#45423a',
            }}
          >
            <span>On your profile</span>
            <span>1/1</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '14px 20px 20px' }}>
            <span style={{ fontSize: 40, lineHeight: 1.05, paddingBottom: 8, borderBottom: `1px solid ${C.paperLine}` }}>
              Hello, I&apos;m you
            </span>
            <span style={{ fontSize: 26, fontStyle: 'italic', marginTop: 10 }}>Open-source developer</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
              <Badge label="TYPESCRIPT" bg="#3178C6" />
              <Badge label="REACT" bg="#61DAFB" fg="#0b0b0c" />
              <Badge label="RUST" bg="#000000" />
            </div>
          </div>
        </div>

        {/* Stamp */}
        <div
          style={{
            position: 'absolute',
            right: 44,
            bottom: 266,
            display: 'flex',
            padding: '4px 14px',
            border: `3px solid ${C.hot}`,
            borderRadius: 4,
            color: C.hot,
            fontStyle: 'italic',
            fontSize: 34,
            transform: 'rotate(-10deg)',
          }}
        >
          Proof
        </div>

        {/* Footer line */}
        <div
          style={{
            position: 'absolute',
            left: 64,
            bottom: 44,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: 'JetBrains Mono',
            fontSize: 17,
            color: C.muted,
          }}
        >
          <span
            style={{
              display: 'flex',
              background: C.accent,
              color: C.accentInk,
              padding: '6px 12px',
              fontSize: 17,
              transform: 'rotate(-2deg)',
            }}
          >
            Free, no sign-up
          </span>
          <span>readme-profile-gen.matheodelaunay.studio</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 },
        { name: 'Instrument Serif', data: serifItalic, style: 'italic', weight: 400 },
        { name: 'JetBrains Mono', data: mono, style: 'normal', weight: 400 },
      ],
    },
  );
}
