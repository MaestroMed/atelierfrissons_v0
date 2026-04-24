import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { getMockProductsByCollection } from '@/lib/mock/products';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Collections JOUR & NUIT',
  description:
    'Deux collections, deux temps du rituel : JOUR pour la légèreté, NUIT pour la profondeur. Chacune en silicone médical certifié.',
  alternates: { canonical: '/collections' },
};

export default function CollectionsOverviewPage() {
  const jourCount = getMockProductsByCollection('jour').length;
  const nuitCount = getMockProductsByCollection('nuit').length;

  return (
    <>
      <section className="bg-ivoire-light py-12 md:py-16">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
            ]}
            className="mb-8"
          />
          <header className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="ui-caps text-or-dark">Deux collections</p>
            <h1 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
              JOUR <span className="font-italic-editorial text-or-dark">×</span> NUIT
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mt-1 opacity-80" />
            <p className="font-italic-editorial text-encre/75 text-base md:text-lg">
              Le rituel a deux temps. Nous avons composé deux collections pour les accompagner.
            </p>
          </header>
        </Container>
      </section>

      {/* Split visuel collection JOUR / NUIT */}
      <section aria-label="Collections principales" className="grid grid-cols-1 md:grid-cols-2">
        <CollectionPanel
          variant="jour"
          title="Collection JOUR"
          tagline="Pour la légèreté, le rituel rapide, le moment volé."
          count={jourCount}
          href="/collections/jour"
        />
        <CollectionPanel
          variant="nuit"
          title="Collection NUIT"
          tagline="Pour la profondeur, le geste lent, la complicité."
          count={nuitCount}
          href="/collections/nuit"
        />
      </section>

      {/* Manifeste */}
      <section className="bg-ivoire py-20 md:py-24">
        <Container className="max-w-3xl text-center">
          <p className="ui-caps text-or-dark">Manifeste</p>
          <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
          <p className="font-display text-noir mt-8 text-2xl leading-tight font-medium md:text-3xl">
            Chaque objet existe en deux temps.{' '}
            <span className="font-italic-editorial text-or-dark">
              Le matin et le soir. Le vif et le profond.
            </span>{' '}
            Chez Atelier Frisson, ces deux temps ont chacun leur collection — pour que vos rituels
            ne s’y trompent pas.
          </p>
          <Wordmark as="p" size="sm" color="or" className="mt-10 opacity-70" />
        </Container>
      </section>
    </>
  );
}

interface CollectionPanelProps {
  variant: 'jour' | 'nuit';
  title: string;
  tagline: string;
  count: number;
  href: string;
}

function CollectionPanel({ variant, title, tagline, count, href }: CollectionPanelProps) {
  const isJour = variant === 'jour';
  return (
    <Link
      href={href}
      className={cn(
        'group/panel relative isolate flex min-h-[70vh] flex-col items-center justify-center overflow-hidden p-12 text-center md:min-h-[80vh] md:p-16',
        isJour ? 'bg-ivoire text-encre' : 'bg-rouge text-ivoire',
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-700 group-hover/panel:opacity-80',
          isJour
            ? '[background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7)_0%,transparent_55%)]'
            : '[background:radial-gradient(circle_at_70%_30%,rgba(255,220,180,0.18)_0%,transparent_60%)]',
        )}
      />
      <ProductSilhouette
        variant={variant}
        animationDelayMs={0}
        className="relative z-10 h-[40vh] max-h-[420px] transition-transform duration-700 group-hover/panel:scale-105"
      />
      <div className="relative z-10 mt-10 flex flex-col items-center gap-4">
        <p className="ui-caps text-or">{count} objets composés</p>
        <h2 className="font-display text-4xl font-medium md:text-5xl lg:text-6xl">{title}</h2>
        <p
          className={cn(
            'font-italic-editorial max-w-md text-lg md:text-xl',
            isJour ? 'text-encre/75' : 'text-ivoire/85',
          )}
        >
          {tagline}
        </p>
        <span
          className={cn(
            'ui-caps mt-4 inline-flex items-center gap-3 border px-7 py-3.5 transition-all duration-300',
            isJour
              ? 'border-noir text-noir group-hover/panel:bg-noir group-hover/panel:text-ivoire'
              : 'border-or text-or group-hover/panel:bg-or group-hover/panel:text-noir',
          )}
        >
          Découvrir la collection
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
