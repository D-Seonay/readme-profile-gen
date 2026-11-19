'use client';

import React from 'react';
import { toast } from 'sonner';
import { useReadmeStore } from '@/store/useReadmeStore';
import { TEMPLATES, templateBlocks, type ProfileTemplate, type ThumbBlock } from '@/lib/templates';
import { Button, Hint, useEngineText } from './ui';

const W = 120;
const H = 150;
const PAD = 8;

/** Hauteur relative de chaque type de bloc dans la vignette. */
const BLOCK_HEIGHT: Record<ThumbBlock['kind'], number> = {
  banner: 22, footer: 12, heading: 9, typing: 6, text: 10, badges: 8, icons: 12, cards: 18, graph: 18,
  table: 14, list: 12, quote: 13, avatars: 8,
};

/** Position verticale de chaque bloc, mis à l'échelle pour tenir dans la vignette. */
const placeBlocks = (blocks: ThumbBlock[]) => {
  const total = blocks.reduce((sum, b) => sum + BLOCK_HEIGHT[b.kind] + 4, 0);
  const scale = Math.min(1, (H - PAD * 2) / Math.max(total, 1));
  const placed: { block: ThumbBlock; top: number; h: number }[] = [];
  for (const block of blocks) {
    const prev = placed[placed.length - 1];
    placed.push({ block, top: prev ? prev.top + prev.h + 4 * scale : PAD, h: BLOCK_HEIGHT[block.kind] * scale });
  }
  return placed;
};

/**
 * Vignette schématique d'un modèle, dessinée en SVG à partir de sa définition :
 * bannières, titres, rangées de badges, grilles d'icônes, cartes, graphes, tableaux…
 */
export const TemplateThumbnail = ({ template }: { template: ProfileTemplate }) => {
  const { bg, ink, accent, soft } = template.palette;
  const centered = template.style.alignment === 'center';
  const inner = W - PAD * 2;
  const x0 = (width: number) => (centered ? (W - width) / 2 : PAD);

  const shapes = placeBlocks(templateBlocks(template)).map(({ block, top, h }, i) => {
    const key = `${block.kind}-${i}`;
    switch (block.kind) {
      case 'banner':
        return <path key={key} d={`M0 ${top - PAD} H${W} V${top + h * 0.7} Q${W * 0.75} ${top + h * 1.15} ${W / 2} ${top + h * 0.75} T0 ${top + h * 0.8} Z`} fill={accent} opacity={0.9} />;
      case 'footer':
        return <path key={key} d={`M0 ${top + h * 0.4} Q${W / 4} ${top} ${W / 2} ${top + h * 0.35} T${W} ${top + h * 0.3} V${H} H0 Z`} fill={accent} opacity={0.85} />;
      case 'heading':
        return <rect key={key} x={x0(inner * 0.62)} y={top} width={inner * 0.62} height={h * 0.75} rx={1.5} fill={ink} />;
      case 'typing':
        return (
          <g key={key}>
            <rect x={x0(inner * 0.5)} y={top + h * 0.2} width={inner * 0.45} height={h * 0.6} rx={1} fill={accent} opacity={0.7} />
            <rect x={x0(inner * 0.5) + inner * 0.47} y={top} width={1.5} height={h} fill={accent} />
          </g>
        );
      case 'text':
        return (
          <g key={key} fill={ink} opacity={0.35}>
            <rect x={x0(inner)} y={top} width={inner} height={h * 0.3} rx={1} />
            <rect x={x0(inner * 0.8)} y={top + h * 0.55} width={inner * 0.8} height={h * 0.3} rx={1} />
          </g>
        );
      case 'badges': {
        const count = 5;
        const bw = (inner * 0.8) / count;
        const start = x0(inner * 0.8);
        return (
          <g key={key}>
            {Array.from({ length: count }, (_, j) => (
              <rect key={j} x={start + j * bw} y={top} width={bw - 2} height={h * 0.8} rx={1.5} fill={j % 2 ? soft : accent} opacity={j % 2 ? 1 : 0.8} />
            ))}
          </g>
        );
      }
      case 'icons': {
        const count = 8;
        const size = Math.min(h * 0.42, inner / count - 2);
        const start = x0(count * (size + 2));
        return (
          <g key={key}>
            {Array.from({ length: count * 2 }, (_, j) => (
              <rect key={j} x={start + (j % count) * (size + 2)} y={top + Math.floor(j / count) * (size + 2)} width={size} height={size} rx={1.5} fill={j % 3 ? soft : accent} />
            ))}
          </g>
        );
      }
      case 'cards':
        return (
          <g key={key}>
            <rect x={PAD} y={top} width={inner * 0.48} height={h} rx={2} fill={soft} stroke={ink} strokeOpacity={0.15} />
            <rect x={PAD + inner * 0.52} y={top} width={inner * 0.48} height={h} rx={2} fill={soft} stroke={ink} strokeOpacity={0.15} />
            <rect x={PAD + 4} y={top + 4} width={inner * 0.25} height={2} fill={accent} />
            <rect x={PAD + inner * 0.52 + 4} y={top + 4} width={inner * 0.2} height={2} fill={accent} />
          </g>
        );
      case 'graph':
        return (
          <g key={key}>
            <rect x={PAD} y={top} width={inner} height={h} rx={2} fill={soft} />
            <polyline points={Array.from({ length: 9 }, (_, j) => `${PAD + 4 + j * ((inner - 8) / 8)},${top + h - 3 - ((j * 37) % 11) * (h / 14)}`).join(' ')} fill="none" stroke={accent} strokeWidth={1.4} />
          </g>
        );
      case 'table':
        return (
          <g key={key} fill={ink}>
            {[0, 1, 2].map((r) => (
              <g key={r} opacity={r === 0 ? 0.6 : 0.25}>
                <rect x={x0(inner)} y={top + r * (h / 3)} width={inner * 0.28} height={h / 3 - 2} rx={1} />
                <rect x={x0(inner) + inner * 0.33} y={top + r * (h / 3)} width={inner * 0.3} height={h / 3 - 2} rx={1} />
                <rect x={x0(inner) + inner * 0.68} y={top + r * (h / 3)} width={inner * 0.32} height={h / 3 - 2} rx={1} />
              </g>
            ))}
          </g>
        );
      case 'list':
        return (
          <g key={key}>
            {[0, 1, 2].map((r) => (
              <g key={r}>
                <circle cx={x0(inner * 0.7) + 1.5} cy={top + r * (h / 3) + h / 7} r={1.3} fill={accent} />
                <rect x={x0(inner * 0.7) + 5} y={top + r * (h / 3)} width={inner * (0.65 - r * 0.08)} height={h / 3 - 3} rx={1} fill={ink} opacity={0.3} />
              </g>
            ))}
          </g>
        );
      case 'quote':
        return (
          <g key={key}>
            <rect x={x0(inner * 0.8)} y={top} width={inner * 0.8} height={h} rx={3} fill={soft} />
            <text x={x0(inner * 0.8) + 4} y={top + h * 0.75} fontSize={h * 0.9} fill={accent} fontFamily="Georgia, serif">“</text>
          </g>
        );
      case 'avatars':
        return (
          <g key={key}>
            {Array.from({ length: 6 }, (_, j) => (
              <circle key={j} cx={x0(6 * (h + 2)) + j * (h + 2) + h / 2} cy={top + h / 2} r={h / 2.2} fill={j % 2 ? soft : accent} opacity={0.85} />
            ))}
          </g>
        );
      default:
        return null;
    }
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-hidden className="block h-auto w-full" preserveAspectRatio="xMidYMid meet">
      <rect width={W} height={H} fill={bg} />
      {shapes}
    </svg>
  );
};

/** Galerie des modèles : vignette, description et application annulable (toast avec bouton « Annuler »). */
export const TemplateGallery = () => {
  const applyTemplate = useReadmeStore((s) => s.applyTemplate);
  const undo = useReadmeStore((s) => s.undo);
  const { e, language } = useEngineText();

  const apply = (template: ProfileTemplate) => {
    if (!applyTemplate(template.id)) return;
    toast.success(`${e.templates.applied} · ${template.name[language]}`, {
      action: { label: e.templates.undo, onClick: () => undo() },
    });
  };

  return (
    <div className="space-y-4">
      <Hint>{e.templates.keepsIdentity}</Hint>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((template) => (
          <li key={template.id} className="group flex flex-col overflow-hidden rounded-sm border border-line bg-surface transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-hard">
            <div className="border-b border-line">
              <TemplateThumbnail template={template} />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="space-y-1">
                <h4 className="font-display text-xl italic leading-tight text-ink">{template.name[language]}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {template.tags[language].map((tag) => (
                    <span key={tag} className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted">{tag}</span>
                  ))}
                </div>
              </div>
              <p className="flex-1 text-xs leading-relaxed text-ink-soft">{template.description[language]}</p>
              <Button variant="primary" onClick={() => apply(template)} aria-label={`${e.templates.apply} — ${template.name[language]}`}>
                {e.templates.apply}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
