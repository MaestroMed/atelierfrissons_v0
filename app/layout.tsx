import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Bodoni_Moda, Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AgeGate } from '@/components/layout/AgeGate';
import { AGE_GATE_COOKIE } from '@/lib/auth/age-gate';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { getCartSnapshot } from '@/lib/cart/store';
import { getMockFeaturedProducts } from '@/lib/mock/products';
import { Toaster } from '@/components/ui/sonner';
import { JsonLd } from '@/components/shared/JsonLd';
import { BackToTop } from '@/components/shared/BackToTop';
import dynamic from 'next/dynamic';
import { MarketingPixels } from '@/components/analytics/MarketingPixels';
import { CursorFollower } from '@/components/shared/CursorFollower';

/**
 * Code-splitting des helpers UI rarement utilisés au first paint :
 *   - CommandPalette : ouvert uniquement par Cmd+K (~95 % des sessions ne l'utilisent pas)
 *   - CompareBar : seulement visible si user a sélectionné des produits à comparer
 *
 * Économie ~25 KB sur le bundle initial. SSR désactivé car ces deux composants
 * sont purement interactifs et n'ont pas de contenu critique pour le SEO.
 */
const CommandPalette = dynamic(
  () => import('@/components/shared/CommandPalette').then((m) => m.CommandPalette),
  { ssr: false },
);
const CompareBar = dynamic(
  () => import('@/components/shop/CompareBar').then((m) => m.CompareBar),
  { ssr: false },
);
import { buildOrganizationSchema, buildWebsiteSchema } from '@/lib/seo/structured-data';
import './globals.css';

/**
 * Typographies Atelier Frisson.
 *
 * - Bodoni Moda : display (titres éditoriaux, wordmark, italiques)
 * - Inter       : sans-serif (body, UI, labels, chiffres tabular)
 *
 * Chargées via next/font/google avec `display: swap` pour éviter le FOIT.
 * Les variables CSS sont référencées dans `app/globals.css` (--font-bodoni / --font-inter).
 */
/**
 * Optimisation Bodoni : on ne preload que les weights réellement utilisés
 * dans le LCP critique. 400 + 600 (italic + roman) couvrent le wordmark hero +
 * les titres. 500/700 chargés à la demande quand atteints au scroll.
 *
 * Critique LCP : sans ce filtrage, les 8 fichiers Bodoni (4 weights × 2 styles)
 * étaient préloadés et bloquaient ~80 KB sur le first paint.
 */
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-bodoni',
  preload: true,
  fallback: ['Didot', 'Garamond', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

/**
 * Bodoni weights additionnels (500, 700) : chargés à la demande.
 * Pas inclus dans le bundle initial car non utilisés au-dessus de la ligne de
 * flottaison sur la homepage et les pages produit.
 */
const bodoniHeavy = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['500', '700'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-bodoni-heavy',
  preload: false, // → chargé async par le navigateur quand classe utilisée
  fallback: ['Didot', 'Garamond', 'serif'],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'], // 300/600 pas utilisés au-dessus du fold — chargés à la demande
  style: ['normal'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

const interHeavy = Inter({
  subsets: ['latin'],
  weight: ['300', '600'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-inter-heavy',
  preload: false,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://atelierfrisson.fr';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Atelier Frisson — Maison du rituel intime',
    template: '%s · Atelier Frisson',
  },
  description:
    'Atelier Frisson conçoit des objets de bien-être intime comme des rituels contemporains. Maison française, silicone médical, livraison discrète.',
  applicationName: 'Atelier Frisson',
  generator: 'Next.js 16',
  keywords: [
    'bien-être intime',
    'rituel',
    'maison française',
    'silicone médical',
    'wellness',
    'soin de soi',
    'atelier',
    'objet de rituel',
  ],
  authors: [{ name: 'Atelier Frisson', url: siteUrl }],
  creator: 'Atelier Frisson',
  publisher: 'Atelier Frisson',
  category: 'wellness',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Atelier Frisson',
    title: 'Atelier Frisson — Maison du rituel intime',
    description:
      'Objets de bien-être intime en silicone médical. Maison française, livraison discrète, emballage neutre.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Atelier Frisson — Maison du rituel intime',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atelier Frisson — Maison du rituel intime',
    description: 'Objets de bien-être intime en silicone médical. Maison française.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/',
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2EADF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0706' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const ageVerified = cookieStore.get(AGE_GATE_COOKIE)?.value === '1';
  const cartSnapshot = await getCartSnapshot();
  // Pre-compute upsell candidates côté server (featured produits, 6 max)
  // — le drawer filtrera ceux déjà dans le panier à chaque rendu.
  const upsellCandidates = getMockFeaturedProducts(6).map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    priceCents: p.priceCents,
    collection: p.collection,
  }));

  return (
    <html
      lang="fr"
      className={`${bodoni.variable} ${bodoniHeavy.variable} ${inter.variable} ${interHeavy.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={buildOrganizationSchema()} />
        <JsonLd data={buildWebsiteSchema()} />
      </head>
      <body className="bg-ivoire text-encre flex min-h-dvh flex-col antialiased">
        <a
          href="#contenu-principal"
          className="focus:bg-noir focus:text-ivoire sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:px-4 focus:py-2"
        >
          Aller au contenu principal
        </a>
        <Header cartCount={cartSnapshot.itemCount} />
        <main id="contenu-principal" className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer initialSnapshot={cartSnapshot} upsellCandidates={upsellCandidates} />
        <CompareBar />
        <BackToTop />
        <CommandPalette />
        <Toaster position="bottom-center" />
        {!ageVerified ? <AgeGate /> : <CookieBanner />}
        <MarketingPixels />
        <CursorFollower />
      </body>
    </html>
  );
}
