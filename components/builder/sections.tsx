import React from 'react';
import type { SectionId, LayoutId, CustomSection } from '@/store/useReadmeStore';
import { isCustomSectionId } from '@/store/useReadmeStore';
import type { Dict } from '@/hooks/useTranslation';
import type { IconName } from '@/components/ui';
import { BannerConfig } from '@/components/BannerConfig';
import { TypingConfig } from '@/components/TypingConfig';
import { BioForm } from '@/components/BioForm';
import { SkillSelector } from '@/components/SkillSelector';
import { StatStatsConfig } from '@/components/StatStatsConfig';
import { SocialLinksForm } from '@/components/SocialLinksForm';
import { GithubStatsConfig } from '@/components/GithubStatsConfig';
import { DonationsForm } from '@/components/DonationsForm';
import { ProjectShowcase } from '@/components/ProjectShowcase';
import { WakatimeConfig } from '@/components/WakatimeConfig';
import { SpotifyConfig } from '@/components/SpotifyConfig';
import { RssConfig } from '@/components/RssConfig';
import { FollowersConfig } from '@/components/FollowersConfig';
import { CustomSectionEditor } from '@/components/CustomSectionEditor';
import { cleanHelp, cleanLabel } from './labels';

export interface SectionMeta {
  icon: IconName;
  /** Name of the section type (outline, plate title, palette). */
  label: (t: Dict) => string;
  /** One-line explanation under the plate title. */
  help: (t: Dict) => string;
  /**
   * Markdown level of the heading the generator writes from
   * `sectionTitles[id]`. Omit when the generator ignores that title.
   */
  heading?: '##' | '###';
  /** The editor rendered inside the plate. */
  render: () => React.ReactNode;
}

/*
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ SECTION REGISTRY — the single place where a built-in section is wired    │
 * │ into the builder (outline, plate, heading fields in Style, palette).     │
 * │ Adding a SectionId to the store makes TypeScript ask for an entry here.  │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
export const SECTION_META: Record<SectionId, SectionMeta> = {
  banner: {
    icon: 'image',
    label: (t) => t.layout.banner,
    help: (t) => t.banner.help,
    render: () => <BannerConfig />,
  },
  typing: {
    icon: 'prompt',
    label: (t) => t.layout.typing,
    help: (t) => t.typing.help,
    render: () => <TypingConfig />,
  },
  bio: {
    icon: 'user',
    label: (t) => t.layout.bio,
    help: (t) => t.builder.help.bio,
    render: () => <BioForm />,
  },
  skills: {
    icon: 'layers',
    label: (t) => t.layout.skills,
    help: (t) => t.skills.help,
    heading: '###',
    render: () => <SkillSelector />,
  },
  statstats: {
    icon: 'pulse',
    label: (t) => t.layout.statstats,
    help: (t) => t.statstats.help,
    heading: '###',
    render: () => <StatStatsConfig />,
  },
  socials: {
    icon: 'at',
    label: (t) => t.layout.socials,
    help: (t) => t.socials.help,
    heading: '##',
    render: () => <SocialLinksForm />,
  },
  stats: {
    icon: 'chart',
    label: (t) => t.layout.stats,
    help: (t) => t.github.help,
    heading: '###',
    render: () => <GithubStatsConfig />,
  },
  donations: {
    icon: 'heart',
    label: (t) => t.layout.donations,
    help: (t) => t.donations.help,
    heading: '##',
    render: () => <DonationsForm />,
  },
  projects: {
    icon: 'pin',
    label: (t) => t.layout.projects,
    help: (t) => t.projects.help,
    heading: '##',
    render: () => <ProjectShowcase />,
  },
  wakatime: {
    icon: 'clock',
    label: (t) => t.layout.wakatime,
    help: (t) => t.wakatime.help,
    heading: '##',
    render: () => <WakatimeConfig />,
  },
  spotify: {
    icon: 'music',
    label: (t) => t.layout.spotify,
    help: (t) => t.spotify.help,
    heading: '##',
    render: () => <SpotifyConfig />,
  },
  rss: {
    icon: 'rss',
    label: (t) => t.layout.rss,
    help: (t) => t.rss.help,
    heading: '##',
    render: () => <RssConfig />,
  },
  followers: {
    icon: 'users',
    label: (t) => t.layout.followers,
    help: (t) => t.followers.help,
    heading: '###',
    render: () => <FollowersConfig />,
  },
};

export { cleanLabel, cleanHelp };

/** Everything the chrome needs to show any layout slot, built-in or free. */
export interface SlotInfo {
  id: LayoutId;
  label: string;
  help: string;
  icon: IconName;
  heading?: '##' | '###';
  isCustom: boolean;
}

export const getSlotInfo = (id: LayoutId, t: Dict, customSections: CustomSection[]): SlotInfo => {
  if (isCustomSectionId(id)) {
    const section = customSections.find((s) => s.id === id);
    return {
      id,
      label: section?.title.trim() ? cleanLabel(section.title) || section.title.trim() : t.free.untitled,
      help: cleanHelp(t.free.sectionHelp),
      icon: 'pilcrow',
      isCustom: true,
    };
  }
  const meta = SECTION_META[id];
  return {
    id,
    label: cleanLabel(meta.label(t)),
    help: cleanHelp(meta.help(t)),
    icon: meta.icon,
    heading: meta.heading,
    isCustom: false,
  };
};

/** Renders the editor for a layout slot (free sections get the free editor). */
export const renderSlotEditor = (id: LayoutId) =>
  isCustomSectionId(id) ? <CustomSectionEditor id={id} /> : SECTION_META[id].render();
