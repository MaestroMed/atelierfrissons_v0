import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Apple touch icon — 180x180 requis par iOS Safari. */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0A0706',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'serif',
          fontSize: '90px',
          fontWeight: 700,
          letterSpacing: '4px',
          color: '#C9A36B',
        }}
      >
        AF
      </div>
    </div>,
    { ...size },
  );
}
