import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sun, Moon, Sparkle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { getMockProductsByCollection } from '@/lib/mock/products';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Collections JOUR & NUIT — deux temps du rituel',
  description:
    'Deux collections, deux temps du rituel : JOUR pour la légèreté, NUIT pour la profondeur. Chacune en silicone médical certifié, chacune un manifesto.',
  alternates: { canonical: '/collections' },
  openGraph: {
    type: 'website',
    title: 'Collections JOUR × NUIT — Atelier Frisson',
    description:
      'Le rituel a deux temps. Nous avons composé deux collections pour les accompagner.',
  },
};

const CHOOSING_MATRIX = [
  {
    icon: Sun,
    moment: 'Pour le matin lent',
    answer: 'JOUR',
    href: '/collections/jour',
    description:
      'Si vous voulez ouvrir la journée avec une douceur claire — silhouettes ivoire, vibrations discrètes, formats compacts.',
    tone: 'jour' as const,
  },
  {
    icon: Moon,
    moment: 'Pour le soir attentif',
    answer: 'NUIT',
    href: '/collections/nuit',
    description:
      'Si vous voulez clore la journée avec une présence dense — finitions laquées, courbes pleines, intensités modulables.',
    tone: 'nuit' as const,
  },
  {
    icon: Sparkle,
    moment: 'Pour les rituels à deux',
    answer: 'NUIT',
    href: '/collections/nuit',
    description:
      'La collection NUIT a été pensée aussi pour la complicité — chaque pièce est conçue pour être tenue, partagée, transmise.',
    tone: 'nuit' as const,
  },
] as const;

export default function CollectionsOverviewPage() {
  const jourCount = getMockProductsByCollection('jour').length;
  const nuitCount = getMockProductsByCollection('nuit').length;

  return (
    <>
      {/* ─── HERO ÉDITORIAL ────────────────────────────────────────── */}
      <section className="bg-ivoire-light relative isolate overflow-hidden py-16 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(255,255,255,0.7)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(201,163,107,0.1)_0%,transparent_60%)]"
        />
        <Container className="relative">
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
            ]}
            className="mb-12"
          />
          <header className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <p className="ui-caps text-or-dark inline-flex items-center gap-3 text-xs">
              <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
              Deux collections
              <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
            </p>
            <h1 className="font-display text-noir text-[clamp(3.5rem,8vw,7rem)] leading-[0.95] font-medium">
              JOUR <span className="font-italic-editorial text-or-dark text-[0.7em]">×</span> NUIT
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mt-2 opacity-80" />
            <p className="font-italic-editorial text-encre/75 text-base md:text-xl">
              Le rituel a deux temps. Nous avons composé deux collections pour les accompagner.
            </p>
          </header>
        </Container>
      </section>

      {/* ─── SPLIT VISUEL FULL-BLEED ────────────────────────────────── */}
      <section aria-label="Collections principales" className="grid grid-cols-1 md:grid-cols-2">
        <CollectionPanel
          variant="jour"
          title="Collection JOUR"
          tagline="Pour la légèreté, le rituel rapide, le moment volé."
          count={jourCount}
          href="/collections/jour"
          ambientWord="MATINS"
        />
        <CollectionPanel
          variant="nuit"
          title="Collection NUIT"
          tagline="Pour la profondeur, le geste lent, la complicité."
          count={nuitCount}
          href="/collections/nuit"
          ambientWord="NUITS"
        />
      </section>

      {/* ─── MANIFESTE ──────────────────────────────────────────────── */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container className="max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or-dark">Manifeste</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <p className="font-display text-noir mt-8 text-2xl leading-tight font-medium md:text-3xl lg:text-4xl">
              Chaque objet existe en deux temps.{' '}
              <span className="font-italic-editorial text-or-dark">
                Le matin et le soir. Le vif et le profond.
              </span>{' '}
              Chez Atelier Frisson, ces deux temps ont chacun leur collection — pour que vos rituels
              ne s’y trompent pas.
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* ─── MATRICE CHOIX ─────────────────────────────────────────── */}
      <section aria-labelledby="choosing-heading" className="bg-ivoire-light py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">L’aide au choix</p>
              <h2
                id="choosing-heading"
                className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl"
              >
                Comment{' '}
                <span className="font-italic-editorial text-or-dark">choisir entre les deux</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
              <p className="font-italic-editorial text-encre/70 max-w-xl text-base md:text-lg">
                Trois questions, trois réponses. Chacune mène vers la collection qui vous ressemble.
              </p>
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-3">
            {CHOOSING_MATRIX.map((row, i) => {
              const isNuit = row.tone === 'nuit';
              const Icon = row.icon;
              return (
                <ScrollReveal key={row.moment} delay={i * 80} as="div">
                  <li>
                    <Link
                      href={row.href}
                      className={cn(
                        'group/choice flex h-full flex-col gap-5 p-7 transition-colors md:p-10',
                        isNuit
                          ? 'bg-noir text-ivoire hover:bg-rouge'
                          : 'bg-ivoire text-encre hover:bg-ivoire-dark/40',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex size-12 items-center justify-center rounded-full border',
                          isNuit ? 'border-or/40 text-or' : 'border-or/40 text-or-dark',
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="size-5" strokeWidth={1.5} />
                      </span>
                      <p className={cn('ui-caps text-[10px]', isNuit ? 'text-or' : 'text-or-dark')}>
                        Si c’est…
                      </p>
                      <h3 className="font-display text-2xl leading-tight font-medium md:text-3xl">
                        {row.moment}
                      </h3>
                      <p
                        className={cn(
                          'text-sm leading-relaxed',
                          isNuit ? 'text-ivoire/80' : 'text-encre/80',
                        )}
                      >
                        {row.description}
                      </p>
                      <span
                        className={cn(
                          'ui-caps mt-auto inline-flex items-center gap-2 transition-all group-hover/choice:gap-3',
                          isNuit ? 'text-or' : 'text-or-dark',
                        )}
                      >
                        Voir la collection {row.answer}
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                </ScrollReveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ─── ÉPILOGUE WORDMARK ──────────────────────────────────────── */}
      <section className="bg-ivoire py-16 md:py-20" aria-hidden="true">
        <div className="flex flex-col items-center gap-3 text-center">
          <Fleuron variant="crown" size="md" color="or" className="opacity-80" />
          <Wordmark as="p" size="sm" color="noir" className="opacity-70" />
          <p className="font-italic-editorial text-encre/55 text-xs">
            Maison du rituel intime — Paris
          </p>
        </div>
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
  ambientWord: string;
}

function CollectionPanel({
  variant,
  title,
  tagline,
  count,
  href,
  ambientWord,
}: CollectionPanelProps) {
  const isJour = variant === 'jour';
  return (
    <Link
      href={href}
      className={cn(
        'group/panel relative isolate flex min-h-[80vh] flex-col items-center justify-center overflow-hidden p-12 text-center md:min-h-[90vh] md:p-16',
        isJour ? 'bg-ivoire text-encre' : 'bg-rouge text-ivoire',
      )}
    >
      {/* Glow ambient */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-700 group-hover/panel:opacity-80',
          isJour
            ? '[background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7)_0%,transparent_55%)]'
            : '[background:radial-gradient(circle_at_70%_30%,rgba(255,220,180,0.18)_0%,transparent_60%)]',
        )}
      />
      {/* Mot d'ambiance en filigrane */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center select-none',
          'font-display leading-none font-medium tracking-tighter',
          'text-[clamp(8rem,22vw,18rem)]',
          isJour ? 'text-noir/[0.04]' : 'text-or/[0.07]',
        )}
      >
        {ambientWord}
      </div>

      <ProductSilhouette
        variant={variant}
        animationDelayMs={0}
        className="relative z-10 h-[40vh] max-h-[420px] transition-transform duration-700 group-hover/panel:scale-105 motion-safe:animate-[float-panel_8s_ease-in-out_infinite]"
      />
      <style>{`
        @keyframes float-panel {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
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
