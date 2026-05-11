import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Mail, Stamp, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { buildOrganizationSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'L’atelier — Atelier Frisson',
  description:
    'Maison française du rituel intime à deux. Pour les couples 30-50 ans qui choisissent leurs objets comme une cravate de cérémonie. Livraison discrète, fournisseurs EU.',
  alternates: { canonical: '/a-propos' },
  openGraph: {
    type: 'website',
    title: 'L’atelier Atelier Frisson — Paris',
    description:
      'Maison française du rituel intime à deux. Pour les couples 30-50 ans, livraison discrète, sourcing EU.',
  },
};

// ─── Engagements pivot V2 ──────────────────────────────────────────────
const ENGAGEMENTS = [
  {
    icon: Stamp,
    title: 'Le geste signé',
    body: 'Boîte écrin ivoire, ruban de soie oxblood, sceau cire à la main, carte cotton letterpress. Aucune mention extérieure du contenu — la confidentialité commence dès la livraison.',
  },
  {
    icon: ShieldCheck,
    title: 'Matières nobles, sourcing assumé',
    body: 'Silicone médical certifié ISO 10993, soie 22 momme tissée Italie, dentelle Leavers de Caudry, parfumerie grassoise. Pas de short-cut, pas de white-label déguisé.',
  },
  {
    icon: Truck,
    title: 'Livraison discrète France & UE',
    body: 'Colissimo Suivi 48 h en France, Mondial Relay en point relais, DHL Express en Suisse. Trace bancaire sans mention du secteur, email expéditeur générique.',
  },
  {
    icon: Sparkles,
    title: 'Vie privée respectée',
    body: 'Aucun tracking publicitaire intrusif. Pas de revente de données, jamais. Cookie banner CNIL, désinscription en un clic, droit d\'accès et d\'effacement RGPD garantis.',
  },
] as const;

// ─── Texte fondatrice (honnête, pas de fausse presse) ───────────────────
const FOUNDER_NOTE = `J\'ai créé Atelier Frisson parce qu\'il manquait, en France, une marque qui s\'adresse aux couples 30-50 ans avec autant de soin qu\'une maison de parfumerie traite ses sillages. Ni l\'embarras des sex-shops, ni la promesse criée des plateformes adulte généralistes. Une maison qui assume ce que c\'est — un rituel intime à deux — et qui le dit sans détour, mais avec élégance.`;

const ODELIE_BIO = `Odelie a fondé la maison fin 2025 après quinze ans dans le wellness premium et le parfum de niche. Direction de la maison, sélection des fournisseurs, écriture éditoriale.`;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />

      {/* HERO ÉDITORIAL */}
      <section className="bg-ivoire-light relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(255,255,255,0.7)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(201,163,107,0.12)_0%,transparent_60%)]"
        />
        <Container className="relative py-16 md:py-24">
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'L’atelier', href: '/a-propos' },
            ]}
            className="mb-12"
          />
          <div className="mx-auto max-w-3xl text-center">
            <Fleuron variant="crown" size="md" color="or" className="mx-auto mb-5 opacity-80" />
            <p className="ui-caps text-or-dark text-xs tracking-[0.3em]">
              Maison française · Paris
            </p>
            <h1 className="font-display text-noir mt-4 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-medium">
              L’atelier{' '}
              <span className="font-italic-editorial text-or-dark">Atelier Frisson</span>
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
            <p className="font-italic-editorial text-encre/75 mt-6 text-lg md:text-xl">
              Le rituel intime à deux — choisi comme une cravate de cérémonie.
            </p>
          </div>
        </Container>
      </section>

      {/* MANIFESTE — note fondatrice */}
      <section id="manifeste" className="bg-ivoire py-20 md:py-28">
        <Container className="max-w-3xl text-center">
          <ScrollReveal>
            <p className="ui-caps text-or-dark">Note de la fondatrice</p>
            <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-5 opacity-80" />
            <blockquote className="font-display text-noir mt-8 text-2xl leading-snug font-medium md:text-3xl lg:text-4xl">
              <span className="font-italic-editorial text-or-dark">«&nbsp;</span>
              {FOUNDER_NOTE}
              <span className="font-italic-editorial text-or-dark">&nbsp;»</span>
            </blockquote>
            <p className="ui-caps text-or-dark mt-10 text-[11px] tracking-[0.22em]">
              Odelie · Fondatrice
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* FONDATRICE — bloc */}
      <section id="fondatrice" className="bg-ivoire-light py-20 md:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <ScrollReveal>
              <figure className="bg-or/15 border-or/20 relative aspect-[4/5] overflow-hidden border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Fleuron variant="crown" size="lg" color="or" className="opacity-60" />
                </div>
                <figcaption className="font-italic-editorial text-or-dark absolute bottom-6 left-6 text-sm">
                  Odelie — Atelier Frisson, Paris.
                </figcaption>
              </figure>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <p className="ui-caps text-or-dark">La fondatrice</p>
              <h2 className="font-display text-noir mt-4 text-3xl font-medium md:text-4xl lg:text-5xl">
                Odelie ·{' '}
                <span className="font-italic-editorial text-or-dark">15 ans dans le premium</span>
              </h2>
              <Fleuron variant="divider" size="sm" color="or" className="mt-4 opacity-70" />
              <p className="text-encre/80 mt-6 text-base leading-relaxed md:text-lg">
                {ODELIE_BIO}
              </p>
              <p className="text-encre/75 mt-4 text-base leading-relaxed">
                La maison est volontairement opérée à petite échelle : un atelier de
                conception à Paris, une logistique partenaire en Pologne, une confection
                lingerie à Roubaix, une parfumerie à Grasse. Pas de vente sous distributeur, pas
                de marketplaces tierces — toutes les commandes passent ici.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ENGAGEMENTS — 4 piliers */}
      <section id="engagements" className="bg-ivoire py-20 md:py-28">
        <Container>
          <ScrollReveal>
            <header className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
              <p className="ui-caps text-or-dark">Quatre engagements</p>
              <h2 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
                Ce que la maison{' '}
                <span className="font-italic-editorial text-or-dark">tient pour acquis</span>
              </h2>
              <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            </header>
          </ScrollReveal>

          <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-2">
            {ENGAGEMENTS.map((eng, i) => (
              <ScrollReveal key={eng.title} delay={i * 80} as="div">
                <li className="bg-ivoire flex h-full flex-col gap-4 p-7 md:p-9">
                  <span className="font-display tabular text-or-dark text-3xl font-medium">
                    {`0${i + 1}`.slice(-2)}
                  </span>
                  <eng.icon
                    className="text-or-dark size-5 stroke-[1.5]"
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-noir text-xl leading-tight font-medium md:text-2xl">
                    {eng.title}
                  </h3>
                  <p className="font-italic-editorial text-encre/80 text-base leading-relaxed">
                    {eng.body}
                  </p>
                  <Fleuron variant="divider" size="sm" color="or" className="mt-auto opacity-50" />
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* CONTACT — bloc presse + service */}
      <section id="presse" className="bg-noir text-ivoire relative isolate overflow-hidden py-20 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(139,20,36,0.18)_0%,transparent_60%)]"
        />
        <Container className="relative">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <p className="ui-caps text-or">Service & confidence</p>
              <h2 className="font-display mt-4 text-3xl font-medium md:text-4xl">
                Une question ?
              </h2>
              <p className="text-ivoire/80 mt-5 text-base leading-relaxed">
                Le service client est tenu par une seule personne — réponse sous 24 h ouvrées,
                jamais de chatbot. Les questions les plus intimes méritent les réponses les plus
                précises.
              </p>
              <ul className="mt-6 flex flex-col gap-3 text-sm">
                <li className="text-ivoire/85 flex items-center gap-3">
                  <Mail className="text-or size-4 shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:bonjour@atelierfrisson.fr"
                    className="hover:text-or transition-colors"
                  >
                    bonjour@atelierfrisson.fr
                  </a>
                </li>
                <li className="text-ivoire/85 flex items-center gap-3">
                  <MapPin className="text-or size-4 shrink-0" aria-hidden="true" />
                  Paris · 6ᵉ arrondissement (siège)
                </li>
              </ul>
            </div>

            <div>
              <p className="ui-caps text-or">Contact presse</p>
              <h2 className="font-display mt-4 text-3xl font-medium md:text-4xl">
                Presse · Influence · Partenariats
              </h2>
              <p className="text-ivoire/80 mt-5 text-base leading-relaxed">
                Pour les médias, magazines, podcasts ou créatrices de contenu qui souhaitent
                couvrir la maison ou tester un coffret — un kit presse + visuels HD est
                disponible sur demande.
              </p>
              <ul className="mt-6 flex flex-col gap-3 text-sm">
                <li className="text-ivoire/85 flex items-center gap-3">
                  <Mail className="text-or size-4 shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:presse@atelierfrisson.fr"
                    className="hover:text-or transition-colors"
                  >
                    presse@atelierfrisson.fr
                  </a>
                </li>
                <li className="text-ivoire/85 flex items-center gap-3">
                  <Sparkles className="text-or size-4 shrink-0" aria-hidden="true" />
                  Réponse sous 48 h ouvrées
                </li>
              </ul>
            </div>
          </div>

          <div className="border-or/15 mt-16 flex flex-col items-center gap-4 border-t pt-12 text-center">
            <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            <p className="font-italic-editorial text-or text-lg md:text-xl">
              Pour vous deux. Pour elle. Pour lui.
            </p>
            <Link
              href="/boutique"
              className="ui-caps-md mt-4 inline-flex items-center gap-3 border-or/60 text-or hover:bg-or hover:text-noir border px-8 py-3 transition-colors"
            >
              Découvrir la boutique
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* WORDMARK SIGNATURE */}
      <section className="bg-ivoire py-12 text-center" aria-hidden="true">
        <Fleuron variant="crown" size="md" color="or" className="mx-auto opacity-80" />
        <Wordmark as="p" size="sm" color="noir" className="mt-3 opacity-70" />
        <p className="font-italic-editorial text-encre/55 mt-2 text-xs">
          Maison du rituel intime — Paris
        </p>
      </section>
    </>
  );
}
