import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Gift, Mars, Venus, VenusAndMars } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { getMockProductsByAudience } from '@/lib/mock/products';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Collections — Pour vous deux, pour elle, pour lui, cadeaux | Atelier Frisson',
  description:
    'Quatre collections : Pour Vous Deux (rituel partagé), Pour Elle, Pour Lui, Cadeaux (Saint-Valentin, anniversaire, mariage). Maison française.',
  alternates: { canonical: '/collections' },
  openGraph: {
    type: 'website',
    title: 'Collections — Atelier Frisson',
    description: 'Pour vous deux. Pour elle. Pour lui. Cadeaux.',
  },
};

const AUDIENCES = [
  {
    slug: 'couples',
    label: 'Pour Vous Deux',
    title: 'Pour Vous Deux',
    tagline: 'Le rituel partagé, sans intrusion visuelle.',
    href: '/collections/couples',
    icon: VenusAndMars,
    silhouette: 'nuit' as const,
    bg: 'bg-rouge text-ivoire',
    accent: 'text-or',
    border: 'border-or/40',
  },
  {
    slug: 'elle',
    label: 'Pour Elle',
    title: 'Pour Elle',
    tagline: 'Objets, lingerie soie, cosmétique signature.',
    href: '/collections/elle',
    icon: Venus,
    silhouette: 'jour' as const,
    bg: 'bg-ivoire text-encre',
    accent: 'text-or-dark',
    border: 'border-or-dark/40',
  },
  {
    slug: 'lui',
    label: 'Pour Lui',
    title: 'Pour Lui',
    tagline: 'Massagers calibrés, bandeau soie, oud Grasse.',
    href: '/collections/lui',
    icon: Mars,
    silhouette: 'nuit' as const,
    bg: 'bg-noir text-ivoire',
    accent: 'text-or',
    border: 'border-or/40',
  },
  {
    slug: 'cadeaux',
    label: 'Cadeaux',
    title: 'Cadeaux',
    tagline: 'Saint-Valentin, anniversaire, mariage.',
    href: '/collections/cadeaux',
    icon: Gift,
    silhouette: 'jour' as const,
    bg: 'bg-ivoire-light text-encre',
    accent: 'text-or-dark',
    border: 'border-or-dark/40',
  },
] as const;

export default function CollectionsOverviewPage() {
  const counts = {
    couples: getMockProductsByAudience('couples').length,
    elle: getMockProductsByAudience('elle').length,
    lui: getMockProductsByAudience('lui').length,
    cadeaux: getMockProductsByAudience('cadeaux').length,
  };

  return (
    <>
      {/* HERO ÉDITORIAL */}
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
              Quatre collections
              <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
            </p>
            <h1 className="font-display text-noir text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-medium">
              Pour vous deux.{' '}
              <span className="font-italic-editorial text-or-dark">Pour elle. Pour lui.</span>
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mt-2 opacity-80" />
            <p className="font-italic-editorial text-encre/75 text-base md:text-xl">
              Quatre audiences, une même exigence — silicone médical, soie tissée Italie, dentelle
              Caudry, parfumerie Grasse.
            </p>
          </header>
        </Container>
      </section>

      {/* GRID 2x2 PANEL */}
      <section aria-label="Quatre collections" className="grid grid-cols-1 md:grid-cols-2">
        {AUDIENCES.map((a) => (
          <AudiencePanel
            key={a.slug}
            label={a.label}
            title={a.title}
            tagline={a.tagline}
            count={counts[a.slug]}
            href={a.href}
            silhouette={a.silhouette}
            bg={a.bg}
            accent={a.accent}
            border={a.border}
            icon={a.icon}
          />
        ))}
      </section>

      {/* MANIFESTE */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container className="max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or-dark">Manifeste</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <p className="font-display text-noir mt-8 text-2xl leading-tight font-medium md:text-3xl lg:text-4xl">
              Le rituel intime se choisit comme une cravate de cérémonie —{' '}
              <span className="font-italic-editorial text-or-dark">par audience, par occasion, par matière.</span>{' '}
              Chez Atelier Frisson, ces choix sont organisés pour qu\'aucune commande ne se trompe.
            </p>
          </ScrollReveal>
        </Container>
      </section>

      <section className="bg-ivoire-light py-16 md:py-20" aria-hidden="true">
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

interface AudiencePanelProps {
  label: string;
  title: string;
  tagline: string;
  count: number;
  href: string;
  silhouette: 'jour' | 'nuit';
  bg: string;
  accent: string;
  border: string;
  icon: typeof Venus;
}

function AudiencePanel({
  label,
  title,
  tagline,
  count,
  href,
  silhouette,
  bg,
  accent,
  border,
  icon: Icon,
}: AudiencePanelProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group/panel relative isolate flex min-h-[60vh] flex-col items-center justify-center overflow-hidden p-10 text-center md:min-h-[70vh] md:p-14',
        bg,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-700 group-hover/panel:opacity-80 [background:radial-gradient(circle_at_50%_30%,rgba(201,163,107,0.12)_0%,transparent_60%)]"
      />
      <Icon className={cn('size-6 stroke-[1.4] mb-3 relative z-10', accent)} aria-hidden="true" />
      <ProductSilhouette
        variant={silhouette}
        animationDelayMs={0}
        className="relative z-10 h-[28vh] max-h-[300px] transition-transform duration-700 group-hover/panel:scale-105"
      />
      <div className="relative z-10 mt-8 flex flex-col items-center gap-3">
        <p className={cn('ui-caps text-[10px]', accent)}>{count} pièces</p>
        <h2 className="font-display text-3xl font-medium md:text-4xl lg:text-5xl">{title}</h2>
        <p className={cn('font-italic-editorial max-w-md text-base md:text-lg', accent)}>
          {tagline}
        </p>
        <span
          className={cn(
            'ui-caps mt-3 inline-flex items-center gap-2.5 border px-6 py-3 transition-all duration-300 group-hover/panel:gap-3.5',
            border,
            accent,
          )}
        >
          Découvrir {label}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
