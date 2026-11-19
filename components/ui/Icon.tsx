import React from 'react';
import { cx } from './cx';

/*
 * One drawn icon set for the whole builder: 24px grid, 1.75 stroke, round
 * joins. Stroke icons inherit `currentColor`; a few brand marks are filled.
 */
const STROKE = {
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="1.5" />
      <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" />
    </>
  ),
  download: <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />,
  upload: <path d="M12 19.5V8.5m0 0L7.5 13M12 8.5l4.5 4.5M5 4.5h14" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-up': <path d="m6 15 6-6 6 6" />,
  'chevron-left': <path d="m15 6-6 6 6 6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  'arrow-right': <path d="M5 12h14m-5-5 5 5-5 5" />,
  'arrow-left': <path d="M19 12H5m5-5-5 5 5 5" />,
  'corner-down-left': <path d="M19 5v7a3 3 0 0 1-3 3H6m0 0 4-4m-4 4 4 4" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  code: <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4" />,
  external: <path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />,
  trash: <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l.8 12.1a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />,
  undo: (
    <>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </>
  ),
  rotate: (
    <>
      <path d="M4 4v5h5" />
      <path d="M5.1 15a7.5 7.5 0 1 0 1.3-7.6L4 9" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.6v.01" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6M12 16.9v.01" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19L12 3.5Z" />
      <path d="M12 10v4.5M12 17.4v.01" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="1.5" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7.5 14h9" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
  book: <path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v13c4.5 0 6.5.5 8 2m0-13c1.5-1.5 3.5-2 8-2v13c-4.5 0-6.5.5-8 2m0-13v13" />,
  'panel-left': (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M9.5 4.5v15" />
    </>
  ),
  'panel-right': (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M14.5 4.5v15" />
    </>
  ),
  bug: (
    <>
      <rect x="7.5" y="8" width="9" height="12" rx="4.5" />
      <path d="M12 12v5M9.5 5.5 11 8M14.5 5.5 13 8M4 12.5h3.5M16.5 12.5H20M5 18l2.7-1.4M19 18l-2.7-1.4M5 7.5l2.6 1.7M19 7.5l-2.6 1.7" />
    </>
  ),
  languages: (
    <>
      <path d="M4 5.5h9M8.5 3.5v2M6.2 5.5c.6 3 2.5 5.4 5.3 6.5M11 5.5c-.6 3.6-3 6.5-6.5 8" />
      <path d="m12.5 20 3.5-8.5 3.5 8.5M13.7 17.2h4.6" />
    </>
  ),
  file: (
    <>
      <path d="M6.5 3.5h7l4 4v13h-11v-17Z" />
      <path d="M13.5 3.5v4h4" />
    </>
  ),
  braces: <path d="M8 4.5c-2 0-2.5 1-2.5 2.5v2c0 1.5-1 2.5-2 3 1 .5 2 1.5 2 3v2c0 1.5.5 2.5 2.5 2.5M16 4.5c2 0 2.5 1 2.5 2.5v2c0 1.5 1 2.5 2 3-1 .5-2 1.5-2 3v2c0 1.5-.5 2.5-2.5 2.5" />,
  hash: <path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" />,
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.6 3.5 5.4 3.5 8.5s-1.1 5.9-3.5 8.5c-2.4-2.6-3.5-5.4-3.5-8.5s1.1-5.9 3.5-8.5Z" />
    </>
  ),
  'align-left': <path d="M4 6h16M4 10h10M4 14h16M4 18h10" />,
  'align-center': <path d="M4 6h16M7 10h10M4 14h16M7 18h10" />,
  rows: (
    <>
      <rect x="4" y="4" width="16" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="16" height="6.5" rx="1" />
    </>
  ),
  columns: (
    <>
      <rect x="4" y="4" width="6.5" height="16" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="16" rx="1" />
    </>
  ),
  /* Sections */
  flag: <path d="M5.5 21V4.5m0 0h11l-2 4 2 4h-11" />,
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="1" />
      <path d="m3.5 16 4.5-4.5 4 4 2.5-2.5 6 6" />
      <circle cx="15.5" cy="9.5" r="1.5" />
    </>
  ),
  prompt: <path d="m5 7.5 4.5 4.5L5 16.5M11.5 17H19" />,
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 9 4.5-9 4.5L3 8l9-4.5Z" />
      <path d="m3 12 9 4.5 9-4.5M3 16l9 4.5 9-4.5" />
    </>
  ),
  at: (
    <>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M15.6 12v1.4a2.7 2.7 0 0 0 5.4 0V12a9 9 0 1 0-3.6 7.2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16" />
      <path d="M8.5 16v-4M12.5 16V8M16.5 16v-6" />
    </>
  ),
  pulse: <path d="M3 12h4l2.5-6.5 5 13L17 12h4" />,
  heart: <path d="M12 19.5s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 6.7a4.3 4.3 0 0 1 7.5 2.8c0 5.6-7.5 10-7.5 10Z" />,
  pin: <path d="M9 3.5h6M10 3.5v6L6.5 13h11L14 9.5v-6M12 13v7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5.5l11-2V16" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  rss: (
    <>
      <path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8" />
      <circle cx="6" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.3" />
      <path d="M3 19.5a6 6 0 0 1 12 0M15.5 5.4a3.3 3.3 0 0 1 0 6.3M17.5 13.7a6 6 0 0 1 3.5 5.8" />
    </>
  ),
  pilcrow: <path d="M13 4v16M17 4v16M19.5 4H10.5a4.5 4.5 0 0 0 0 9H13" />,
  grip: (
    <>
      <circle cx="9" cy="6" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
  more: (
    <>
      <circle cx="6" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
} as const;

const FILL = {
  github: (
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  ),
  linkedin: (
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  ),
  'x-mark': (
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  ),
} as const;

export type IconName = keyof typeof STROKE | keyof typeof FILL;

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export const Icon = ({ name, size = 16, className, strokeWidth = 1.75, ...rest }: IconProps) => {
  const isFill = name in FILL;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFill ? 'currentColor' : 'none'}
      stroke={isFill ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cx('shrink-0', className)}
      {...rest}
    >
      {isFill ? FILL[name as keyof typeof FILL] : STROKE[name as keyof typeof STROKE]}
    </svg>
  );
};
