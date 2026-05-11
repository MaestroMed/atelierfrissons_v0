import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Atelier Frisson — Pour vous deux, pour elle, pour lui';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph image dynamique — pivot V2 « Couples 30-50 ».
 * Trois panneaux audience (Elle / Vous Deux / Lui) avec wordmark or centré.
 *
 * Utilisée par défaut sur toutes les pages qui n'override pas leur OG image.
 * Format Twitter / Facebook / LinkedIn 1200×630.
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
      {/* Panel Pour Elle (gauche) */}
      <div
        style={{
          display: 'flex',
          width: '28%',
          height: '100%',
          background: '#F2EADF',
          position: 'relative',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '32px',
            left: '32px',
            fontFamily: 'serif',
            fontSize: '14px',
            letterSpacing: '5px',
            color: 'rgba(10,7,6,0.7)',
          }}
        >
          POUR ELLE
        </div>
      </div>

      {/* Panel Pour Vous Deux (centre, rouge) */}
      <div
        style={{
          display: 'flex',
          width: '44%',
          height: '100%',
          background: '#8B1424',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'serif',
            fontSize: '14px',
            letterSpacing: '5px',
            color: '#C9A36B',
          }}
        >
          POUR VOUS DEUX
        </div>
      </div>

      {/* Panel Pour Lui (droite, noir) */}
      <div
        style={{
          display: 'flex',
          width: '28%',
          height: '100%',
          background: '#0A0706',
          position: 'relative',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '32px',
            right: '32px',
            fontFamily: 'serif',
            fontSize: '14px',
            letterSpacing: '5px',
            color: 'rgba(201,163,107,0.85)',
          }}
        >
          POUR LUI
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
          gap: '14px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#C9A36B',
            opacity: 0.85,
          }}
        >
          <span style={{ width: '70px', height: '1px', background: '#C9A36B' }} />
          <span style={{ fontSize: '12px' }}>◆</span>
          <span style={{ width: '70px', height: '1px', background: '#C9A36B' }} />
        </div>

        <div
          style={{
            fontFamily: 'serif',
            fontSize: '96px',
            fontWeight: 600,
            letterSpacing: '6px',
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
            fontSize: '24px',
            color: '#C9A36B',
            marginTop: '12px',
          }}
        >
          Le rituel intime à deux.
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#C9A36B',
            opacity: 0.5,
            marginTop: '20px',
          }}
        >
          <span style={{ width: '50px', height: '1px', background: '#C9A36B' }} />
          <span style={{ fontSize: '10px' }}>◆</span>
          <span style={{ width: '50px', height: '1px', background: '#C9A36B' }} />
        </div>

        <div
          style={{
            fontSize: '12px',
            letterSpacing: '4px',
            color: '#C9A36B',
            opacity: 0.7,
            marginTop: '6px',
          }}
        >
          MAISON DU RITUEL INTIME · PARIS
        </div>
      </div>
    </div>,
    { ...size },
  );
}
