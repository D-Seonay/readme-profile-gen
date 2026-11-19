/** Public facts about the site, shared by metadata, sitemap, robots, the OG image and the landing page. */
export const SITE_URL = 'https://readme-profile-gen.matheodelaunay.studio';
export const SITE_NAME = 'Ultimate README Gen';

export const REPO_URL = 'https://github.com/D-Seonay/readme-profile-gen';
export const ISSUES_URL = `${REPO_URL}/issues/new`;

export const AUTHOR = {
  name: 'Seonay',
  handle: 'D-Seonay',
  url: 'https://matheodelaunay.studio',
  github: 'https://github.com/D-Seonay',
} as const;

/** The home page title: the query people type, then the brand. Under 60 characters. */
export const SITE_TITLE = 'Free GitHub Profile README Generator | Ultimate README Gen';

/** The meta description: what it is, what it does, why it’s easy. Under 160 characters. */
export const SITE_DESCRIPTION =
  'Free GitHub profile README generator: auto-fill from your username, add badges, stats cards and 10 templates, preview live, copy the Markdown. No sign-up.';

/** The social cards’ headline: the hero claim. */
export const SOCIAL_TITLE = 'Your GitHub profile is a Markdown file. Ultimate README Gen writes it.';

export const KEYWORDS = [
  'github profile readme generator',
  'github profile readme',
  'github readme generator',
  'readme generator',
  'github profile readme templates',
  'readme.md generator',
  'markdown generator',
  'github stats cards',
  'github readme stats',
  'shields.io badges',
  'github badges',
  'github profile design',
  'developer portfolio',
  'générateur readme github',
];

/** Absolute URL for a site path. */
export const absoluteUrl = (path = '/') => new URL(path, SITE_URL).toString();
