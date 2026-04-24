import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { Wordmark } from '@/components/layout/Wordmark';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'À propos — la maison Atelier Frisson',
  description:
    'Atelier Frisson est une maison française dédiée au rituel intime. Conception Paris, silicone médical certifié, livraison discrète.',
  alternates: { canonical: '/a-propos' },
};

export default function AProposPage() {
  return (
    <>
      <section className="bg-ivoire-light py-12 md:py-16">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'À propos', href: '/a-propos' },
            ]}
            className="mb-8"
          />
          <header className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="ui-caps text-or-dark">La maison</p>
            <h1 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
              Atelier Frisson
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            <p className="font-italic-editorial text-encre/75 text-base md:text-lg">
              Une maison française dédiée au rituel intime contemporain.
            </p>
          </header>
        </Container>
      </section>

      <Container className="py-14 md:py-20" width="narrow">
        <article className="text-encre/85 space-y-16 text-base leading-relaxed md:text-lg">
          <section>
            <h2 className="font-display text-noir text-3xl font-medium md:text-4xl">
              Le manifeste
            </h2>
            <Fleuron variant="divider" size="sm" color="or" className="mt-4 opacity-70" />
            <p className="mt-6">
              Atelier Frisson conçoit des objets de bien-être intime{' '}
              <em>comme des rituels contemporains</em>. La maison privilégie la précision du geste,
              la douceur des matières, et une présence éditoriale silencieuse.
            </p>
            <p className="mt-4">
              Nous ne vendons pas des accessoires. Nous accompagnons des moments — ceux qu’on
              s’offre seul·e ou à deux, sans bruit, sans urgence, dans la cohérence d’un soin
              personnel exigeant.
            </p>
          </section>

          <section id="fondatrice">
            <h2 className="font-display text-noir text-3xl font-medium md:text-4xl">
              La fondatrice
            </h2>
            <Fleuron variant="divider" size="sm" color="or" className="mt-4 opacity-70" />
            <p className="mt-6">
              <strong>Odelie</strong> a fondé Atelier Frisson après quinze années passées dans
              l’univers du parfum de niche et du wellness premium. Sa conviction : il n’existait
              pas, en France, de marque qui traite l’objet de rituel intime avec la même attention
              que Dior une crème, Aesop un savon, ou Byredo un parfum.
            </p>
            <p className="mt-4">
              Atelier Frisson est l’aboutissement de cette intuition — un projet qui réunit
              designers industrielles, sexologues cliniciennes, pharmaciennes en officine et
              ateliers de confection français.
            </p>
          </section>

          <section id="engagements">
            <h2 className="font-display text-noir text-3xl font-medium md:text-4xl">
              Nos engagements
            </h2>
            <Fleuron variant="divider" size="sm" color="or" className="mt-4 opacity-70" />
            <ul className="mt-6 space-y-4">
              {[
                {
                  t: 'Silicone médical certifié',
                  d: 'Tous nos objets sont en silicone médical ISO 10993 classe IIa. Certificats fournisseurs disponibles sur demande.',
                },
                {
                  t: 'Conception française',
                  d: 'R&D, design industriel, direction éditoriale et service client basés à Paris. Fabrication UE prioritaire.',
                },
                {
                  t: 'Discrétion absolue',
                  d: 'Emballage neutre signé à la main, trace bancaire sans mention du secteur, e-mail expéditeur générique.',
                },
                {
                  t: 'Vie privée',
                  d: 'Aucun tracking publicitaire. Pas de revente de données. Application mobile (Laque Minuit) sans cloud, sans télémétrie.',
                },
                {
                  t: 'Co-écriture experte',
                  d: 'Articles éditoriaux et guides piliers co-rédigés avec sexologues cliniciennes, gynécologues et pharmaciens D.E.',
                },
                {
                  t: 'Garantie 2 ans (à vie sur la pièce signature)',
                  d: 'Service client sous 24h ouvrées. Échange ou remboursement intégral en cas de défaut technique.',
                },
              ].map((e) => (
                <li key={e.t} className="flex items-start gap-4">
                  <span className="bg-or mt-2 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                  <span>
                    <strong className="font-display text-noir">{e.t}.</strong>{' '}
                    <span className="text-encre/80">{e.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section id="presse">
            <h2 className="font-display text-noir text-3xl font-medium md:text-4xl">
              Presse & partenariats
            </h2>
            <Fleuron variant="divider" size="sm" color="or" className="mt-4 opacity-70" />
            <p className="mt-6">
              Pour toute demande presse, dossier de marque, ou demande de partenariat éditorial,
              écrivez à{' '}
              <a
                href="mailto:contact@atelierfrisson.fr"
                className="text-or-dark hover:text-or underline underline-offset-4"
              >
                contact@atelierfrisson.fr
              </a>{' '}
              avec mention <em>« Presse »</em> en objet — réponse sous 24 heures.
            </p>
          </section>
        </article>

        <section className="border-encre/10 mt-20 flex flex-col items-center gap-6 border-t pt-16 text-center">
          <Fleuron variant="crown" size="lg" color="or" className="opacity-80" />
          <Wordmark as="p" size="md" color="or" />
          <p className="font-italic-editorial text-encre/65">Maison du rituel intime — Paris</p>
          <Link
            href="/boutique"
            className="ui-caps border-noir text-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-3 border px-7 py-3.5 transition-colors"
          >
            Découvrir la collection
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </Container>
    </>
  );
}
