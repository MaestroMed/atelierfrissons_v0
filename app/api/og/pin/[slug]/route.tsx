import { ImageResponse } from 'next/og';
import { findMockProductBySlug } from '@/lib/mock/products';
import { findMockBundleBySlug } from '@/lib/mock/bundles';

export const runtime = 'edge';

const COLLECTION_LABEL: Record<string, string> = {
  couples: 'POUR VOUS DEUX',
  elle: 'POUR ELLE',
  lui: 'POUR LUI',
  cadeaux: 'CADEAU',
  jour: 'COLLECTION JOUR',
  nuit: 'COLLECTION NUIT',
  inaugurale: 'COLLECTION INAUGURALE',
  signature: 'PIÈCE SIGNATURE',
};

const PALETTE: Record<string, { bg: string; accent: string; ink: string }> = {
  couples: { bg: '#8B1424', accent: '#C9A36B', ink: '#F2EADF' },
  elle: { bg: '#F2EADF', accent: '#8B1424', ink: '#1C1A17' },
  lui: { bg: '#0A0706', accent: '#C9A36B', ink: '#F2EADF' },
  cadeaux: { bg: '#F2EADF', accent: '#8B1424', ink: '#1C1A17' },
  jour: { bg: '#F2EADF', accent: '#8B1424', ink: '#1C1A17' },
  nuit: { bg: '#0A0706', accent: '#C9A36B', ink: '#F2EADF' },
  default: { bg: '#F2EADF', accent: '#8B1424', ink: '#1C1A17' },
};

/**
 * OG image Pinterest portrait 1000×1500 — par produit ou par bundle.
 *
 * Endpoint : `GET /api/og/pin/[slug]?type=product` ou `?type=bundle`.
 * Format Pinterest 2:3 portrait, parfait pour Rich Pins. Couleur de fond
 * adaptée à l'audience (rouge laqué pour couples, ivoire pour elle/cadeaux,
 * noir velours pour lui).
 *
 * Usage côté Server Component :
 *   ```tsx
 *   <meta property="og:image" content={`/api/og/pin/${slug}?type=product`} />
 *   ```
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const type = url.searchParams.get('type') ?? 'product';

  let title = 'Atelier Frisson';
  let tagline = 'Le rituel intime à deux';
  let topLabel = 'ATELIER FRISSON';
  let priceLabel = '';
  let collection: string = 'default';

  if (type === 'bundle') {
    const bundle = findMockBundleBySlug(slug);
    if (bundle) {
      title = bundle.name;
      tagline = bundle.tagline ?? 'Coffret prêt-à-offrir';
      topLabel = 'COFFRET ATELIER FRISSON';
      priceLabel = `À partir de ${(bundle.priceCents / 100).toFixed(0)} €`;
      collection = bundle.occasion === 'mariage' ? 'couples' : 'cadeaux';
    }
  } else {
    const product = findMockProductBySlug(slug);
    if (product) {
      title = product.name;
      tagline = product.tagline ?? '';
      collection = product.collection ?? 'default';
      topLabel = COLLECTION_LABEL[collection] ?? 'ATELIER FRISSON';
      priceLabel = `${(product.priceCents / 100).toFixed(0)} €`;
    }
  }

  const palette = PALETTE[collection] ?? PALETTE['default']!;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: palette.bg,
        position: 'relative',
        padding: '80px',
      }}
    >
      {/* Top label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: palette.accent,
        }}
      >
        <span style={{ width: '36px', height: '1px', background: palette.accent, opacity: 0.85 }} />
        <span
          style={{
            fontFamily: 'serif',
            fontSize: '18px',
            letterSpacing: '6px',
            opacity: 0.95,
          }}
        >
          {topLabel}
        </span>
      </div>

      {/* Center : product/bundle name + tagline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          textAlign: 'center',
          padding: '0 40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: palette.accent,
            opacity: 0.85,
          }}
        >
          <span style={{ width: '60px', height: '1px', background: palette.accent }} />
          <span style={{ fontSize: '14px' }}>◆</span>
          <span style={{ width: '60px', height: '1px', background: palette.accent }} />
        </div>

        <div
          style={{
            fontFamily: 'serif',
            fontWeight: 600,
            fontSize: title.length > 14 ? '120px' : '160px',
            color: palette.ink,
            lineHeight: 1,
            letterSpacing: '-2px',
            textShadow: collection === 'lui' || collection === 'couples'
              ? '0 2px 20px rgba(10,7,6,0.4)'
              : '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontFamily: 'serif',
            fontStyle: 'italic',
            fontSize: '36px',
            color: palette.accent,
            maxWidth: '720px',
            lineHeight: 1.25,
          }}
        >
          {tagline}
        </div>

        {priceLabel ? (
          <div
            style={{
              fontFamily: 'serif',
              fontSize: '28px',
              fontWeight: 500,
              color: palette.ink,
              opacity: 0.9,
              marginTop: '8px',
            }}
          >
            {priceLabel}
          </div>
        ) : null}
      </div>

      {/* Bottom : wordmark */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: palette.accent,
            opacity: 0.5,
          }}
        >
          <span style={{ width: '40px', height: '1px', background: palette.accent }} />
          <span style={{ fontSize: '10px' }}>◆</span>
          <span style={{ width: '40px', height: '1px', background: palette.accent }} />
        </div>
        <div
          style={{
            fontFamily: 'serif',
            fontSize: '28px',
            fontWeight: 600,
            letterSpacing: '8px',
            color: palette.accent,
          }}
        >
          ATELIER FRISSON
        </div>
        <div
          style={{
            fontFamily: 'serif',
            fontStyle: 'italic',
            fontSize: '14px',
            color: palette.accent,
            opacity: 0.7,
          }}
        >
          atelierfrisson.fr
        </div>
      </div>
    </div>,
    {
      width: 1000,
      height: 1500,
    },
  );
}
