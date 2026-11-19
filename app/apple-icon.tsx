import { ImageResponse } from 'next/og';

/** Home-screen icon: the favicon's Markdown hash on its lime slug, as a 180px PNG. */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#c8f542' }}>
        <svg width="180" height="180" viewBox="0 0 32 32">
          <path
            d="M12.6 7.5 10.4 24.5M21.6 7.5 19.4 24.5M7.5 12.8h17.6M6.9 19.2h17.6"
            fill="none"
            stroke="#0b0b0c"
            strokeWidth="2.8"
            strokeLinecap="square"
          />
        </svg>
      </div>
    ),
    size,
  );
}
