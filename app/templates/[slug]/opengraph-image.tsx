import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { TEMPLATES, getTemplate } from '@/lib/templates';

/**
 * Social card for each template page: the template's own palette, its name in
 * Instrument Serif and its one-line description. Generated at build time.
 */

export const alt = 'GitHub profile README template, by Ultimate README Gen';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return TEMPLATES.map((template) => ({ slug: template.id }));
}

const fontDir = join(process.cwd(), 'assets', 'og');
const [serif, serifItalic, mono] = await Promise.all([
  readFile(join(fontDir, 'InstrumentSerif-Regular.ttf')),
  readFile(join(fontDir, 'InstrumentSerif-Italic.ttf')),
  readFile(join(fontDir, 'JetBrainsMono-Regular.ttf')),
]);

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplate(slug) ?? TEMPLATES[0];
  const { bg, ink, accent, soft } = template.palette;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: bg,
          color: ink,
          padding: '56px 72px',
          fontFamily: 'Instrument Serif',
          borderLeft: `24px solid ${accent}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'JetBrains Mono', fontSize: 22 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 6,
              background: '#c8f542',
              color: '#0b0b0c',
              fontSize: 28,
            }}
          >
            #
          </div>
          <span>README Gen</span>
          <span style={{ marginLeft: 12, opacity: 0.6, fontSize: 18 }}>/templates/{template.id}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: 3, color: accent === bg ? ink : accent }}>
            GITHUB PROFILE README TEMPLATE
          </span>
          <span style={{ fontSize: 132, fontStyle: 'italic', lineHeight: 0.95, letterSpacing: -3, marginTop: 18 }}>
            {template.name.en}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 22, lineHeight: 1.5, marginTop: 26, maxWidth: 920, opacity: 0.85 }}>
            {template.description.en}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 18 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {[accent, soft, ink].map((color, i) => (
              <span key={i} style={{ display: 'flex', width: 34, height: 34, background: color, border: `2px solid ${ink}` }} />
            ))}
          </div>
          <span style={{ opacity: 0.7 }}>Free · live preview · copy-ready Markdown</span>
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
