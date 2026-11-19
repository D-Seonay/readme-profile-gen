// Sections structurées : expérience, "en ce moment", dépôts / gists épinglés.
import type {
  CurrentlyItem, CurrentlyKind, CurrentlyStyle, ExperienceItem, ExperienceStyle, Language, PinnedItem, PinnedStyle,
} from '@/store/types';
import { enc, htmlAttr, mdAlt, mdCell, mdLinkText, safeLink } from '../markdown';
import { query } from './services';

/** Libellés du README généré pour les sections structurées, par langue. */
export const STRUCTURED_TEXT: Record<Language, {
  present: string;
  period: string;
  role: string;
  org: string;
  currently: Record<CurrentlyKind, string>;
}> = {
  en: {
    present: 'Present',
    period: 'Period',
    role: 'Role',
    org: 'Organisation',
    currently: {
      working: '🔭 Working on',
      learning: '🌱 Learning',
      reading: '📚 Reading',
      listening: '🎧 Listening to',
      watching: '📺 Watching',
      playing: '🎮 Playing',
      building: '🛠️ Building',
      writing: '✍️ Writing',
      custom: '✨ Currently',
    },
  },
  fr: {
    present: 'Aujourd’hui',
    period: 'Période',
    role: 'Poste',
    org: 'Organisation',
    currently: {
      working: '🔭 Je travaille sur',
      learning: '🌱 J’apprends',
      reading: '📚 Je lis',
      listening: '🎧 J’écoute',
      watching: '📺 Je regarde',
      playing: '🎮 Je joue à',
      building: '🛠️ Je construis',
      writing: '✍️ J’écris',
      custom: '✨ En ce moment',
    },
  },
};

const linkOr = (text: string, url: string) => {
  const href = safeLink(url);
  const label = mdLinkText(text);
  return href && label ? `[${label}](${href})` : label;
};

// --- Expérience ---

export const formatPeriod = (item: Pick<ExperienceItem, 'start' | 'end'>, language: Language) => {
  const start = item.start.trim();
  const end = item.end.trim() || STRUCTURED_TEXT[language].present;
  return start ? `${start} – ${end}` : item.end.trim();
};

export const renderExperience = (items: ExperienceItem[] | undefined, style: ExperienceStyle | undefined, language: Language) => {
  const rows = (items ?? []).filter((e) => e.role.trim() || e.org.trim());
  if (rows.length === 0) return '';
  const text = STRUCTURED_TEXT[language] ?? STRUCTURED_TEXT.en;

  if (style === 'list') {
    return rows.map((e) => {
      const head = [e.role.trim() ? `**${mdLinkText(e.role)}**` : '', linkOr(e.org, e.link)].filter(Boolean).join(' · ');
      const period = formatPeriod(e, language);
      const line = `- ${head}${period ? ` — *${period}*` : ''}`;
      const description = e.description.trim();
      return description ? `${line}  \n  ${description.replace(/\r?\n/g, '  \n  ')}` : line;
    }).join('\n');
  }

  const lines = [
    `| ${text.period} | ${text.role} | ${text.org} |`,
    '| :-- | :-- | :-- |',
    ...rows.map((e) => {
      const role = e.role.trim() ? `**${mdCell(e.role)}**` : '';
      const description = e.description.trim() ? `<br><sub>${mdCell(e.description)}</sub>` : '';
      const org = e.org.trim() ? (safeLink(e.link) ? `[${mdCell(mdLinkText(e.org))}](${safeLink(e.link)})` : mdCell(e.org)) : '';
      return `| ${mdCell(formatPeriod(e, language))} | ${role}${description} | ${org} |`;
    }),
  ];
  return lines.join('\n');
};

// --- En ce moment ---

export const currentlyLabel = (item: Pick<CurrentlyItem, 'kind' | 'label'>, language: Language) =>
  item.label.trim() || (STRUCTURED_TEXT[language] ?? STRUCTURED_TEXT.en).currently[item.kind];

export const renderCurrently = (items: CurrentlyItem[] | undefined, style: CurrentlyStyle | undefined, language: Language) => {
  const rows = (items ?? []).filter((c) => c.value.trim());
  if (rows.length === 0) return '';

  if (style === 'list') {
    return rows.map((c) => `- ${currentlyLabel(c, language)} **${linkOr(c.value, c.link)}**`).join('\n');
  }

  // Tableau horizontal : jusqu'à 4 colonnes par tableau pour rester lisible sur mobile.
  const tables: string[] = [];
  for (let i = 0; i < rows.length; i += 4) {
    const chunk = rows.slice(i, i + 4);
    tables.push([
      `| ${chunk.map((c) => mdCell(currentlyLabel(c, language))).join(' | ')} |`,
      `| ${chunk.map(() => ':-:').join(' | ')} |`,
      `| ${chunk.map((c) => mdCell(linkOr(c.value, c.link))).join(' | ')} |`,
    ].join('\n'));
  }
  return tables.join('\n\n');
};

// --- Épinglés ---

interface PinnedContext {
  githubUsername: string;
  statsBase: string;
  theme: string;
  isRow: boolean;
}

const pinnedOwner = (item: PinnedItem, ctx: PinnedContext) => (item.owner.trim() || ctx.githubUsername.trim());

/** Lien GitHub de l'élément épinglé, ou '' s'il est incomplet. */
export const pinnedLink = (item: PinnedItem, ctx: Pick<PinnedContext, 'githubUsername'>) => {
  const owner = item.owner.trim() || ctx.githubUsername.trim();
  const name = item.name.trim();
  if (!name) return '';
  if (item.kind === 'gist') return `https://gist.github.com/${owner ? `${enc(owner)}/` : ''}${enc(name)}`;
  return owner ? `https://github.com/${enc(owner)}/${enc(name)}` : '';
};

/** Carte github-readme-stats (pin / gist) de l'élément épinglé. */
export const pinnedCardUrl = (item: PinnedItem, ctx: PinnedContext) => {
  const owner = pinnedOwner(item, ctx);
  const name = item.name.trim();
  const theme: [string, string][] = [['theme', ctx.theme], ['hide_border', 'true']];
  if (item.kind === 'gist') return `${ctx.statsBase}/api/gist?${query([['id', name], ...theme])}`;
  const params: [string, string][] = [['username', owner], ['repo', name], ...theme];
  if (owner.toLowerCase() !== ctx.githubUsername.trim().toLowerCase()) params.push(['show_owner', 'true']);
  return `${ctx.statsBase}/api/pin/?${query(params)}`;
};

const pinnedLabel = (item: PinnedItem, ctx: PinnedContext) => {
  const owner = pinnedOwner(item, ctx);
  if (item.kind === 'gist') return `gist ${item.name.trim().slice(0, 8)}`;
  return owner.toLowerCase() === ctx.githubUsername.trim().toLowerCase() ? item.name.trim() : `${owner}/${item.name.trim()}`;
};

export const renderPinned = (items: PinnedItem[] | undefined, style: PinnedStyle | undefined, ctx: PinnedContext) => {
  const rows = (items ?? []).filter((p) => pinnedLink(p, ctx));
  if (rows.length === 0) return '';

  if (style === 'list') {
    return rows.map((p) => {
      const description = p.description.trim().replace(/\s*\r?\n\s*/g, ' ');
      return `- [**${mdLinkText(pinnedLabel(p, ctx))}**](${pinnedLink(p, ctx)})${description ? ` — ${description}` : ''}`;
    }).join('\n');
  }

  if (style === 'grid') {
    const cells = rows.map((p) => {
      const description = p.description.trim();
      return [
        '    <td width="50%" valign="top">',
        `      <a href="${htmlAttr(pinnedLink(p, ctx))}"><img alt="${htmlAttr(pinnedLabel(p, ctx))}" src="${htmlAttr(pinnedCardUrl(p, ctx))}" /></a>`,
        ...(description ? [`      <p>${htmlAttr(description).replace(/\r?\n/g, '<br>')}</p>`] : []),
        '    </td>',
      ].join('\n');
    });
    const trs: string[] = [];
    for (let i = 0; i < cells.length; i += 2) trs.push(`  <tr>\n${cells.slice(i, i + 2).join('\n')}\n  </tr>`);
    return `<table>\n${trs.join('\n')}\n</table>`;
  }

  // Cartes empilées (ou côte à côte en orientation horizontale), description sous chaque carte.
  const blocks = rows.map((p) => {
    const card = `[![${mdAlt(pinnedLabel(p, ctx))}](${pinnedCardUrl(p, ctx)})](${pinnedLink(p, ctx)})`;
    const description = p.description.trim();
    return description ? `${card}\n\n${description}` : card;
  });
  const hasDescriptions = rows.some((p) => p.description.trim());
  return blocks.join(ctx.isRow && !hasDescriptions ? ' ' : '\n\n');
};
