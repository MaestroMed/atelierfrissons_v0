import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Bodoni_Moda, Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AgeGate } from '@/components/layout/AgeGate';
import { AGE_GATE_COOKIE } from '@/lib/auth/age-gate';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { Toaster } from '@/components/ui/sonner';
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
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-bodoni',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
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

  return (
    <html lang="fr" className={`${bodoni.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-ivoire text-encre flex min-h-dvh flex-col antialiased">
        <a
          href="#contenu-principal"
          className="focus:bg-noir focus:text-ivoire sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:px-4 focus:py-2"
        >
          Aller au contenu principal
        </a>
        <Header />
        <main id="contenu-principal" className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="bottom-center" />
        {!ageVerified ? <AgeGate /> : <CookieBanner />}
      </body>
    </html>
  );
}
