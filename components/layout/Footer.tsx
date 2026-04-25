import Link from 'next/link';
import { MapPin, Mail } from 'lucide-react';
import { Container } from './Container';
import { Fleuron } from './Fleuron';
import { Wordmark } from './Wordmark';
import { NewsletterForm } from './NewsletterForm';
import { FOOTER_COLUMNS, SOCIAL_LINKS } from './navigation-data';
import { InstagramIcon, PinterestIcon } from '@/components/shared/SocialIcons';

/**
 * Footer Atelier Frisson — multi-section éditoriale noire.
 *
 * Structure :
 *   1. Bandeau newsletter (headline Bodoni + input inline)
 *   2. Filet or
 *   3. 4 colonnes de liens (Maison / Rituels / Service / Légal)
 *   4. Wordmark XL avec fleuron en couronne
 *   5. Baseline légale : SIRET (placeholder), Arcom, RGPD, RCS
 *   6. Copyright + signature éditoriale en italique
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-noir text-ivoire relative isolate" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Pied de page Atelier Frisson
      </h2>

      {/* ── Bandeau newsletter ───────────────────────────────────────── */}
      <Container as="section" className="py-16 lg:py-20" aria-label="Newsletter">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[3fr_2fr] lg:items-end lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className="ui-caps text-or">Le Journal</p>
            <h3 className="font-display text-ivoire text-4xl font-medium md:text-5xl">
              Recevez nos rituels{' '}
              <span className="font-italic-editorial text-or">en avant-première</span>
            </h3>
            <p className="text-ivoire/70 max-w-lg text-base">
              Une lettre éditoriale — un rituel, une rencontre, un guide. Jamais plus de deux fois
              par mois. Jamais de promotion forcée.
            </p>
          </div>
          <NewsletterForm source="footer" />
        </div>
      </Container>

      {/* ── Filet or ───────────────────────────────────────────────── */}
      <div aria-hidden="true" className="filet-or mx-auto w-[min(1200px,90%)] opacity-60" />

      {/* ── 4 colonnes de liens ────────────────────────────────────── */}
      <Container as="nav" aria-label="Plan du site" className="py-14 lg:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-14">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="ui-caps text-or">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-ivoire/75 hover:text-or text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* ── Filet or + wordmark final ──────────────────────────────── */}
      <div aria-hidden="true" className="filet-or mx-auto w-[min(1200px,90%)] opacity-60" />

      <Container as="section" className="py-16" aria-label="Atelier Frisson">
        <div className="flex flex-col items-center gap-6">
          <Fleuron variant="crown" size="lg" color="or" />
          <Wordmark
            as="p"
            size="lg"
            color="or"
            layout="inline"
            className="text-center tracking-[0.1em]"
          />
          <p className="font-italic-editorial text-ivoire/65">Maison du rituel intime — Paris</p>

          {/* Coordonnées atelier */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs">
            <span className="ui-caps text-ivoire/55 inline-flex items-center gap-2">
              <MapPin className="text-or/70 size-3" aria-hidden="true" strokeWidth={1.5} />
              Atelier Paris 12<sup className="text-[8px]">e</sup>
              <span className="text-ivoire/35"> · sur RDV</span>
            </span>
            <a
              href="mailto:contact@atelierfrisson.fr"
              className="ui-caps text-ivoire/55 hover:text-or inline-flex items-center gap-2 transition-colors"
            >
              <Mail className="text-or/70 size-3" aria-hidden="true" strokeWidth={1.5} />
              contact@atelierfrisson.fr
            </a>
          </div>

          <Fleuron variant="divider" size="lg" color="or" className="mt-4 opacity-50" />

          {/* Social + réservation majeurs */}
          <div className="mt-6 flex flex-col items-center gap-5 md:flex-row md:gap-10">
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-ivoire/60 hover:text-or transition-colors"
                >
                  {s.icon === 'instagram' ? (
                    <InstagramIcon className="size-4" />
                  ) : (
                    <PinterestIcon className="size-4" />
                  )}
                </a>
              ))}
            </div>
            <p className="ui-caps border-ivoire/20 text-ivoire/60 inline-flex items-center gap-2 rounded-sm border px-3 py-1.5">
              <span aria-hidden="true" className="bg-or inline-block size-1.5 rounded-full" />
              Site réservé aux personnes majeures
            </p>
          </div>
        </div>
      </Container>

      {/* ── Baseline légale ───────────────────────────────────────── */}
      <div className="border-ivoire/10 border-t">
        <Container
          as="div"
          className="text-ivoire/50 flex flex-col gap-4 py-6 text-xs lg:flex-row lg:items-center lg:justify-between"
        >
          <p>
            © {year} Atelier Frisson —{' '}
            <span className="font-italic-editorial">tous droits réservés</span>
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              SIRET <span className="tabular text-ivoire/40">À venir (SASU en création)</span>
            </li>
            <li>
              RCS <span className="tabular text-ivoire/40">Paris — en cours</span>
            </li>
            <li>TVA intra — à venir</li>
            <li>Hébergement : Vercel Inc. — CDN Cloudflare</li>
          </ul>
          <p className="font-italic-editorial text-ivoire/60">Conception éditoriale — Paris</p>
        </Container>
      </div>
    </footer>
  );
}
