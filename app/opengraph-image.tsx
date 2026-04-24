import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Atelier Frisson — Maison du rituel intime';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph image dynamique — générée à chaque build via next/og.
 * Split visuel JOUR/NUIT avec wordmark or centré, tagline italique.
 * Utilisée par défaut sur toutes les pages qui n'override pas leur OG image.
 */
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: '#0A0706',
        position: 'relative',
      }}
    >
      {/* Split JOUR */}
      <div
        style={{
          display: 'flex',
          width: '50%',
          height: '100%',
          background: '#F2EADF',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            fontFamily: 'serif',
            fontSize: '18px',
            letterSpacing: '6px',
            color: 'rgba(10,7,6,0.7)',
          }}
        >
          JOUR
        </div>
      </div>

      {/* Split NUIT */}
      <div
        style={{
          display: 'flex',
          width: '50%',
          height: '100%',
          background: '#8B1424',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            fontFamily: 'serif',
            fontSize: '18px',
            letterSpacing: '6px',
            color: 'rgba(242,234,223,0.85)',
          }}
        >
          NUIT
        </div>
      </div>

      {/* Wordmark overlay centre */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          textAlign: 'center',
        }}
      >
        {/* Fleuron haut */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#C9A36B',
            opacity: 0.85,
          }}
        >
          <span style={{ width: '80px', height: '1px', background: '#C9A36B' }} />
          <span style={{ fontSize: '12px' }}>◆</span>
          <span style={{ width: '80px', height: '1px', background: '#C9A36B' }} />
        </div>

        <div
          style={{
            fontFamily: 'serif',
            fontSize: '110px',
            fontWeight: 600,
            letterSpacing: '8px',
            color: '#C9A36B',
            textShadow: '0 2px 20px rgba(10,7,6,0.4)',
            lineHeight: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>ATELIER</div>
          <div>FRISSON</div>
        </div>

        <div
          style={{
            fontFamily: 'serif',
            fontStyle: 'italic',
            fontSize: '26px',
            color: '#C9A36B',
            marginTop: '16px',
          }}
        >
          Pour tous les rituels. Pour tous les moments.
        </div>

        {/* Fleuron bas */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#C9A36B',
            opacity: 0.6,
            marginTop: '24px',
          }}
        >
          <span style={{ width: '60px', height: '1px', background: '#C9A36B' }} />
          <span style={{ fontSize: '10px' }}>◆</span>
          <span style={{ width: '60px', height: '1px', background: '#C9A36B' }} />
        </div>

        <div
          style={{
            fontSize: '14px',
            letterSpacing: '4px',
            color: '#C9A36B',
            opacity: 0.7,
            marginTop: '8px',
          }}
        >
          MAISON DU RITUEL INTIME · PARIS
        </div>
      </div>
    </div>,
    { ...size },
  );
}
