import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

/**
 * App icon — sert /icon.png et est utilisé pour le favicon + apple-touch-icon.
 * Wordmark AF doré sur fond noir velours, très simple.
 */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0A0706',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#C9A36B',
        }}
      >
        <span style={{ width: '60px', height: '2px', background: '#C9A36B' }} />
        <span style={{ fontSize: '24px' }}>◆</span>
        <span style={{ width: '60px', height: '2px', background: '#C9A36B' }} />
      </div>
      <div
        style={{
          fontFamily: 'serif',
          fontSize: '220px',
          fontWeight: 700,
          letterSpacing: '12px',
          color: '#C9A36B',
          lineHeight: 1,
        }}
      >
        AF
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#C9A36B',
          opacity: 0.7,
        }}
      >
        <span style={{ width: '60px', height: '2px', background: '#C9A36B' }} />
        <span style={{ fontSize: '24px' }}>◆</span>
        <span style={{ width: '60px', height: '2px', background: '#C9A36B' }} />
      </div>
    </div>,
    { ...size },
  );
}
