import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Mail, Sparkle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Timeline, type TimelineMilestone } from '@/components/marketing/Timeline';
import { TeamGrid, type TeamMember } from '@/components/marketing/TeamGrid';
import { PressQuotes, type PressQuote } from '@/components/marketing/PressQuotes';
import { JsonLd } from '@/components/shared/JsonLd';
import { buildOrganizationSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'La Maison — Atelier Frisson',
  description:
    'La maison française du rituel intime. Manifeste, fondatrice, équipe, jalons depuis la création. Conception Paris, silicone médical certifié, livraison discrète.',
  alternates: { canonical: '/a-propos' },
  openGraph: {
    type: 'website',
    title: 'La Maison Atelier Frisson — Paris',
    description:
      "Une maison française dédiée au rituel intime. Conçue pour ce que les autres marques n'osent pas dire avec autant d'élégance.",
  },
};

// ─── Données éditoriales ────────────────────────────────────────────────
const TIMELINE: readonly TimelineMilestone[] = [
  {
    date: 'Hiver 2024',
    title: 'L’intuition initiale',
    body: 'Odelie note dans un carnet une phrase qui deviendra la maison : <em>« Pourquoi un objet de rituel intime mériterait moins d’attention qu’une crème de Dior ? »</em>',
    glyph: '✦',
  },
  {
    date: 'Mars 2025',
    title: 'Première équipe',
    body: 'Rencontre avec une designer industrielle (ex-Aesop) et une sexologue clinicienne parisienne. Le triangle fondateur est posé : <strong>matière, geste, parole</strong>.',
    glyph: '✧',
  },
  {
    date: 'Septembre 2025',
    title: 'Validation des matières',
    body: 'Six mois de tests laboratoire pour sélectionner un silicone médical ISO&nbsp;10993 classe&nbsp;IIa. Rejet de cinq fournisseurs avant de retenir un atelier polonais certifié pharmaceutique.',
    glyph: '✦',
  },
  {
    date: 'Janvier 2026',
    title: 'Direction artistique',
    body: 'La palette JOUR / NUIT est validée — ivoire crème, rouge laqué Dior, or champagne, noir velours. La typographie Bodoni Moda devient signature. Le monogramme AF est dessiné.',
    glyph: '✧',
  },
  {
    date: 'Avril 2026',
    title: 'Naissance d’Atelier Frisson',
    body: 'La maison ouvre ses portes au public — six objets composés, un magazine éditorial, une équipe co-écrite avec sexologues et pharmaciennes D.E. <strong>Le rituel commence ici.</strong>',
    glyph: '✦',
  },
] as const;

const TEAM: readonly TeamMember[] = [
  {
    role: 'Fondatrice & direction',
    initials: 'O.',
    tone: 'or',
    description:
      'Quinze ans dans le parfum de niche et le wellness premium. Odelie a fondé la maison avec une intuition simple : <em>traiter l’intime avec la même rigueur que la haute parfumerie.</em>',
  },
  {
    role: 'Direction artistique',
    initials: 'M.L.',
    tone: 'noir',
    description:
      'Ex-Aesop, ex-Byredo. Pilote la cohérence visuelle de la maison — du monogramme au papier de la carte signée.',
  },
  {
    role: 'Sexologue clinicienne',
    initials: 'S.A.',
    tone: 'rouge',
    description:
      'Co-auteure du <em>« Désir n’a pas d’horaire »</em> (Stock, 2024). Relit chaque article et chaque communication pour s’assurer du juste mot, du juste ton.',
  },
  {
    role: 'Pharmacienne D.E.',
    initials: 'L.V.',
    tone: 'or',
    description:
      'Spécialisée en cosmétologie et matériaux médicaux. Valide les certifications fournisseurs et les protocoles d’hygiène — chaque lot, chaque référence.',
  },
  {
    role: 'Design industriel',
    initials: 'C.T.',
    tone: 'noir',
    description:
      'Ergonomie, courbes, densité, finitions. Travaille en main avec l’atelier de moulage à Cracovie — six prototypes par référence avant validation.',
  },
  {
    role: 'Service & confidence',
    initials: 'I.B.',
    tone: 'rouge',
    description:
      'Réponse sous 24&nbsp;heures, e-mails relus avec soin. Les questions les plus intimes méritent les réponses les plus précises.',
  },
] as const;

const PRESS: readonly PressQuote[] = [
  {
    source: 'Madame Figaro',
    context: 'Sélection beauté du printemps',
    quote:
      'Une maison française qui réussit le pari rare de traiter le wellness intime avec la même délicatesse qu’une parfumerie de niche.',
  },
  {
    source: 'ELLE Beauté',
    context: 'Édition mai 2026',
    quote:
      'On retient surtout le silence dans le packaging — pas un logo qui dépasse, pas une promesse qui crie. C’est précisément ce qu’on attendait.',
  },
  {
    source: 'Vogue France',
    context: 'L’élégance du rituel',
    quote:
      'Ce qui frappe, ce n’est pas l’objet. C’est l’écriture autour. Atelier Frisson aurait pu être un magazine avant d’être une marque.',
  },
] as const;

const ENGAGEMENTS = [
  {
    title: 'Silicone médical certifié',
    body: 'Tous nos objets en silicone médical ISO&nbsp;10993 classe&nbsp;IIa. Certificats fournisseurs disponibles sur simple demande.',
  },
  {
    title: 'Conception française',
    body: 'R&D, design, direction éditoriale et service basés à Paris. Fabrication UE prioritaire, atelier polonais certifié pharmaceutique.',
  },
  {
    title: 'Discrétion absolue',
    body: 'Emballage neutre signé à la main. Trace bancaire sans mention du secteur. E-mail expéditeur générique — la confidentialité, dès la livraison.',
  },
  {
    title: 'Respect de la vie privée',
    body: 'Aucun tracking publicitaire. Aucune revente de données. Application Laque Minuit sans cloud, sans télémétrie — juste vous, l’objet, le moment.',
  },
  {
    title: 'Co-écriture experte',
    body: 'Articles et guides co-rédigés avec sexologues cliniciennes, gynécologues et pharmaciens D.E. Sources scientifiques systématiquement citées.',
  },
  {
    title: 'Garantie 2 ans · à vie sur la signature',
    body: 'Service client sous 24&nbsp;heures ouvrées. Échange ou remboursement intégral en cas de défaut technique. Aucune question sur l’usage.',
  },
] as const;

export default function AProposPage() {
  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />

      {/* ─── HERO IMMERSIF ──────────────────────────────────────────── */}
      <section
        aria-labelledby="apropos-hero-title"
        className="bg-noir text-ivoire relative flex min-h-[80dvh] flex-col items-center justify-center overflow-hidden"
      >
        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.15)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(139,20,36,0.18)_0%,transparent_60%)]"
        />
        {/* Grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:3px_3px] mix-blend-overlay"
        />

        <Container className="relative z-10">
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'La Maison', href: '/a-propos' },
            ]}
            className="[&_*]:text-ivoire/65 mb-12"
          />
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <p className="ui-caps text-or/80 inline-flex items-center gap-3 text-xs">
              <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
              Maison française · Paris
              <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
            </p>
            <Wordmark as="p" size="md" color="or" />
            <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            <h1
              id="apropos-hero-title"
              className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] font-medium md:text-[clamp(3.5rem,6vw,6rem)]"
            >
              Une maison <span className="font-italic-editorial text-or">qui sait se taire.</span>
            </h1>
            <p className="font-italic-editorial text-ivoire/75 max-w-2xl text-lg md:text-xl">
              Ce site n’est pas une boutique. C’est l’adresse d’un atelier, d’une équipe, d’une
              direction artistique — et d’une promesse tenue chaque matin et chaque soir, depuis
              avril 2026.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── MANIFESTE ──────────────────────────────────────────────── */}
      <section className="bg-ivoire py-20 md:py-28">
        <Container className="max-w-4xl">
          <ScrollReveal>
            <p className="ui-caps text-or-dark text-center">Le manifeste</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <h2
              id="manifeste-heading"
              className="font-display text-noir mt-8 text-center text-3xl leading-tight font-medium md:text-4xl lg:text-5xl"
            >
              Atelier Frisson conçoit des objets de bien-être intime{' '}
              <span className="font-italic-editorial text-or-dark">
                comme des rituels contemporains.
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="text-encre/85 mx-auto mt-10 max-w-2xl space-y-6 text-base leading-relaxed md:text-lg">
              <p>
                La maison privilégie la précision du geste, la douceur des matières, et une présence
                éditoriale silencieuse. Chaque pièce est pensée comme un objet de soin — fabriquée
                en silicone médical certifié, livrée dans un emballage neutre signé de la main.
              </p>
              <p>
                Nous ne vendons pas des accessoires. <strong>Nous accompagnons des moments</strong>
                &nbsp;— ceux qu’on s’offre seul·e ou à deux, sans bruit, sans urgence, dans la
                cohérence d’un soin personnel exigeant.
              </p>
              <p className="font-italic-editorial text-or-dark text-xl md:text-2xl">
                Pour les matins lents. Pour les nuits attentives. Pour le simple plaisir d’être à
                soi.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ─── PORTRAIT FONDATRICE (layout magazine) ──────────────────── */}
      <section
        id="fondatrice"
        aria-labelledby="founder-heading"
        className="bg-ivoire-light py-20 md:py-28"
      >
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <ScrollReveal>
              <figure className="bg-noir text-ivoire relative aspect-[3/4] overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_30%,rgba(201,163,107,0.18)_0%,transparent_55%)]"
                />
                <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
                  <Fleuron variant="crown" size="md" color="or" className="opacity-80" />
                  <p className="ui-caps text-or/80 text-[10px]">Portrait éditorial</p>
                  <p className="font-display text-or text-5xl font-medium">O.</p>
                  <p className="font-italic-editorial text-ivoire/85 max-w-xs text-base leading-relaxed">
                    Fondatrice & direction
                    <br />
                    Paris, avril 2026
                  </p>
                  <Fleuron variant="divider" size="sm" color="or" className="opacity-50" />
                </div>
              </figure>
            </ScrollReveal>

            <div className="flex flex-col gap-6">
              <ScrollReveal>
                <p className="ui-caps text-or-dark">La fondatrice</p>
                <h2
                  id="founder-heading"
                  className="font-display text-noir mt-3 text-3xl font-medium md:text-4xl lg:text-5xl"
                >
                  Odelie — quinze ans à observer{' '}
                  <span className="font-italic-editorial text-or-dark">
                    ce que les marques n’osent pas dire.
                  </span>
                </h2>
                <Fleuron variant="divider" size="md" color="or" className="mt-5 opacity-70" />
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <div className="text-encre/85 space-y-5 text-base leading-relaxed md:text-lg">
                  <p>
                    Odelie a fondé Atelier Frisson après quinze années passées dans l’univers du
                    parfum de niche et du wellness premium. Sa conviction est simple : il n’existait
                    pas, en France, de maison qui traite l’objet de rituel intime avec la même
                    attention que Dior une crème, Aesop un savon, ou Byredo un parfum.
                  </p>
                  <p>
                    <em>
                      « Le wellness intime est resté coincé entre le médical clinique et le sextoy
                      vulgaire. Il manquait une troisième voie — éditoriale, exigeante, libre. »
                    </em>
                  </p>
                  <p>
                    Atelier Frisson est l’aboutissement de cette intuition — un projet qui réunit
                    designers industrielles, sexologues cliniciennes, pharmaciennes en officine et
                    ateliers de confection français. Une équipe choisie pour son{' '}
                    <strong>silence élégant</strong> autant que pour ses compétences.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── TIMELINE ────────────────────────────────────────────────── */}
      <section aria-labelledby="timeline-heading" className="bg-ivoire py-20 md:py-28">
        <Container className="max-w-4xl">
          <ScrollReveal>
            <header className="mb-14 flex flex-col items-center gap-4 text-center md:mb-20">
              <p className="ui-caps text-or-dark inline-flex items-center gap-3 text-xs">
                <Sparkle className="size-3" aria-hidden="true" strokeWidth={1.5} />
                Les jalons
                <Sparkle className="size-3" aria-hidden="true" strokeWidth={1.5} />
              </p>
              <h2
                id="timeline-heading"
                className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl"
              >
                Comment la maison{' '}
                <span className="font-italic-editorial text-or-dark">est née</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
              <p className="font-italic-editorial text-encre/70 max-w-xl text-base md:text-lg">
                Cinq dates qui dessinent une trajectoire — de l’intuition d’hiver 2024 à l’ouverture
                publique d’avril 2026.
              </p>
            </header>
          </ScrollReveal>

          <Timeline milestones={TIMELINE} />
        </Container>
      </section>

      {/* ─── ENGAGEMENTS ─────────────────────────────────────────────── */}
      <section
        id="engagements"
        aria-labelledby="engagements-heading"
        className="bg-ivoire-light py-20 md:py-28"
      >
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">Les engagements</p>
              <h2
                id="engagements-heading"
                className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl"
              >
                Six promesses{' '}
                <span className="font-italic-editorial text-or-dark">tenues à la lettre</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3">
            {ENGAGEMENTS.map((e, i) => (
              <ScrollReveal key={e.title} delay={i * 60} as="div">
                <li className="bg-ivoire flex flex-col gap-4 p-7 md:p-9">
                  <p className="ui-caps text-or-dark text-[10px]">{`0${i + 1}`.slice(-2)}</p>
                  <h3 className="font-display text-noir text-xl leading-tight font-medium md:text-2xl">
                    {e.title}
                  </h3>
                  <p
                    className="text-encre/80 text-sm leading-relaxed md:text-base"
                    dangerouslySetInnerHTML={{ __html: e.body }}
                  />
                  <Fleuron variant="divider" size="sm" color="or" className="mt-auto opacity-50" />
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ─── ÉQUIPE ──────────────────────────────────────────────────── */}
      <section aria-labelledby="team-heading" className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">L’équipe</p>
              <h2
                id="team-heading"
                className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl"
              >
                Six personnes,{' '}
                <span className="font-italic-editorial text-or-dark">une seule attention</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
              <p className="font-italic-editorial text-encre/70 max-w-2xl text-base md:text-lg">
                Anonymisée par choix — les médecins, sexologues et pharmaciennes qui composent la
                maison consultent en discrétion. Leurs initiales suffisent.
              </p>
            </header>
          </ScrollReveal>

          <TeamGrid members={TEAM} />
        </Container>
      </section>

      {/* ─── PRESSE ─────────────────────────────────────────────────── */}
      <section
        id="presse"
        aria-labelledby="press-heading"
        className="bg-noir text-ivoire relative isolate overflow-hidden py-20 md:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_25%_30%,rgba(201,163,107,0.1)_0%,transparent_55%)]"
        />
        <Container className="relative z-10">
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or/80">Ils en parlent</p>
              <h2
                id="press-heading"
                className="font-display text-4xl font-medium md:text-5xl lg:text-6xl"
              >
                Ce qu’écrivent <span className="font-italic-editorial text-or">les magazines</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
              <p className="font-italic-editorial text-ivoire/70 max-w-xl text-base md:text-lg">
                Sélection — les retours qui nous ont marquées depuis l’ouverture de la maison.
              </p>
            </header>
          </ScrollReveal>
          <PressQuotes quotes={PRESS} />
        </Container>
      </section>

      {/* ─── L'ATELIER (visite + contact) ───────────────────────────── */}
      <section aria-labelledby="atelier-heading" className="bg-ivoire-light py-20 md:py-28">
        <Container>
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <figure className="bg-rouge text-ivoire flex aspect-[4/5] flex-col items-center justify-center gap-5 p-10 text-center">
                <Fleuron variant="crown" size="md" color="or" className="opacity-90" />
                <p className="ui-caps text-or/80 text-[10px]">Atelier Frisson — Paris</p>
                <p className="font-display text-3xl leading-tight font-medium md:text-4xl">
                  Le 12<sup className="text-or text-base">e</sup>,
                  <br />
                  <span className="font-italic-editorial text-or">discrètement</span>
                </p>
                <Fleuron variant="divider" size="sm" color="or" className="opacity-50" />
                <p className="font-italic-editorial text-ivoire/75 text-sm">
                  Sur rendez-vous uniquement,
                  <br />
                  pour la presse et les partenaires.
                </p>
              </figure>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="flex flex-col gap-6">
                <p className="ui-caps text-or-dark">L’atelier</p>
                <h2
                  id="atelier-heading"
                  className="font-display text-noir text-3xl font-medium md:text-4xl lg:text-5xl"
                >
                  L’adresse n’est pas{' '}
                  <span className="font-italic-editorial text-or-dark">un secret</span>.
                </h2>
                <Fleuron variant="divider" size="md" color="or" className="opacity-70" />
                <p className="text-encre/85 text-base leading-relaxed md:text-lg">
                  La maison conserve un atelier dans le 12<sup>e</sup> arrondissement de Paris —
                  R&amp;D, direction artistique, service client. Ouvert sur rendez-vous pour la
                  presse, les partenaires éditoriaux et les commandes spéciales.
                </p>

                <dl className="text-encre/80 mt-2 flex flex-col gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-or-dark mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="ui-caps text-encre/55 text-[10px]">Atelier (sur RDV)</dt>
                      <dd className="text-encre">Paris 12 — France</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="text-or-dark mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="ui-caps text-encre/55 text-[10px]">Presse & partenariats</dt>
                      <dd>
                        <a
                          href="mailto:contact@atelierfrisson.fr?subject=Presse"
                          className="text-or-dark hover:text-or underline underline-offset-4 transition-colors"
                        >
                          contact@atelierfrisson.fr
                        </a>{' '}
                        <span className="text-encre/55 text-xs">· réponse sous 24h</span>
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ─── ÉPILOGUE / CTA ─────────────────────────────────────────── */}
      <section className="bg-noir text-ivoire relative isolate overflow-hidden py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,rgba(201,163,107,0.15)_0%,transparent_60%)]"
        />
        <Container className="relative z-10 max-w-3xl text-center">
          <ScrollReveal>
            <Fleuron variant="crown" size="md" color="or" className="mx-auto opacity-90" />
            <Wordmark as="p" size="md" color="or" className="mt-5" />
            <p className="font-italic-editorial text-ivoire/65 mt-3 text-sm">
              Maison du rituel intime — Paris
            </p>
            <h2 className="font-display mt-10 text-3xl leading-tight font-medium md:text-4xl lg:text-5xl">
              Le reste se passe <span className="font-italic-editorial text-or">à l’intérieur</span>
              .
            </h2>
            <p className="text-ivoire/75 mt-6 text-base md:text-lg">
              Vous savez tout. Le prochain pas vous appartient.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/boutique"
                className="ui-caps bg-or text-noir hover:bg-or-light inline-flex items-center gap-3 px-8 py-4 transition-colors"
              >
                Découvrir la collection
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/rituel-inaugural"
                className="ui-caps text-ivoire/75 hover:text-or inline-flex items-center gap-3 underline underline-offset-4 transition-colors"
              >
                Vivre l’expérience éditoriale
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
