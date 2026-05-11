import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, Shield, FileText, Clock, ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { Wordmark } from '@/components/layout/Wordmark';

export const metadata: Metadata = {
  title: 'DPO · Délégué à la protection des données',
  description:
    'Coordonnées et responsabilités du Délégué à la protection des données d\'Atelier Frisson. Conformité RGPD, ePrivacy, CNIL.',
  alternates: { canonical: '/dpo' },
};

const RESPONSIBILITIES = [
  {
    icon: Shield,
    title: 'Garant de la conformité',
    body: 'Veille au respect du RGPD et des recommandations CNIL dans toutes les opérations de la maison : marketing, paiement, logistique, support.',
  },
  {
    icon: FileText,
    title: 'Point de contact unique',
    body: 'Reçoit toutes les demandes d\'exercice de droits (accès, rectification, effacement, opposition, portabilité) et les traite dans le délai légal d\'un mois.',
  },
  {
    icon: Clock,
    title: 'Délais respectés',
    body: 'Réponse sous 24 h ouvrées pour accusé de réception, sous 30 jours maximum pour traitement complet conformément à l\'art. 12§3 RGPD.',
  },
];

const PROCEDURES = [
  {
    title: '1 · Demande d\'exercice de droit',
    body: 'Privilégiez la page <a href="/compte/donnees" class="underline underline-offset-4 hover:text-or-dark">Mes données</a> pour les actions automatisées (export, effacement). Pour les cas particuliers, écrivez à dpo@atelierfrisson.fr en précisant le droit invoqué.',
  },
  {
    title: '2 · Pièces justificatives',
    body: 'Pour vérifier votre identité, joignez une copie d\'une pièce d\'identité (passeport, carte d\'identité, permis). Documents masqués automatiquement après vérification, jamais conservés en clair.',
  },
  {
    title: '3 · Délai de traitement',
    body: 'Accusé de réception sous 24 h ouvrées. Traitement complet sous 30 jours (prolongeable à 60 jours pour les demandes complexes — vous serez informé(e)).',
  },
  {
    title: '4 · Recours CNIL',
    body: 'Si la réponse ne vous satisfait pas, vous pouvez déposer une plainte auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noreferrer noopener" class="underline underline-offset-4 hover:text-or-dark">CNIL</a> (autorité de contrôle française) dans un délai de trois ans.',
  },
];

const DATA_CATEGORIES = [
  { category: 'Identification', items: 'Nom, prénom, email, téléphone, date de naissance' },
  { category: 'Adresses', items: 'Adresses de livraison et facturation' },
  {
    category: 'Commandes',
    items:
      'Historique des commandes, panier, abonnement Box Mensuelle, points fidélité, parrainages',
  },
  {
    category: 'Communications',
    items: 'Préférences emails, consentements marketing, newsletter, SAV',
  },
  {
    category: 'Paiement',
    items: 'Empreinte de carte (4 derniers chiffres), provider PSP — JAMAIS le numéro complet',
  },
  {
    category: 'Audit',
    items: 'Logs sécurité (connexions, modifications de compte, audit RGPD)',
  },
  {
    category: 'Comportement',
    items: 'PostHog avec consentement uniquement (anonymisé sans consent)',
  },
];

export default function DpoPage() {
  return (
    <Container className="py-12 md:py-16">
      <BreadcrumbNav
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'DPO', href: '/dpo' },
        ]}
        className="mb-10"
      />

      {/* HERO */}
      <header className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
        <Fleuron variant="crown" size="md" color="or" className="mx-auto mb-5 opacity-80" />
        <p className="ui-caps text-or-dark text-xs tracking-[0.3em]">
          Conformité · RGPD · ePrivacy · CNIL
        </p>
        <h1 className="font-display text-noir mt-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-medium">
          Délégué à la protection{' '}
          <span className="font-italic-editorial text-or-dark">des données</span>
        </h1>
        <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
        <p className="font-italic-editorial text-encre/75 mt-6 text-base md:text-lg">
          Le DPO d'Atelier Frisson est l'interlocuteur unique pour toute question de protection
          des données personnelles.
        </p>
      </header>

      {/* COORDONNÉES */}
      <section className="bg-noir text-ivoire relative isolate mx-auto mb-14 max-w-3xl overflow-hidden p-8 md:mb-20 md:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.18)_0%,transparent_55%)]"
        />
        <div className="relative">
          <p className="ui-caps text-or text-[11px] tracking-[0.22em]">Coordonnées</p>
          <h2 className="font-display mt-3 text-3xl font-medium md:text-4xl">
            Le DPO de la maison
          </h2>
          <ul className="mt-8 flex flex-col gap-4 text-sm md:text-base">
            <li className="flex items-start gap-4">
              <Mail className="text-or mt-0.5 size-5 shrink-0" aria-hidden="true" strokeWidth={1.5} />
              <div>
                <p className="ui-caps text-or text-[10px] tracking-widest">Email (privilégié)</p>
                <a
                  href="mailto:dpo@atelierfrisson.fr"
                  className="text-ivoire mt-1 inline-block hover:text-or-light underline underline-offset-4"
                >
                  dpo@atelierfrisson.fr
                </a>
                <p className="text-ivoire/70 mt-1 text-xs">
                  Réponse sous 24 h ouvrées · traitement 30 jours max
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <MapPin className="text-or mt-0.5 size-5 shrink-0" aria-hidden="true" strokeWidth={1.5} />
              <div>
                <p className="ui-caps text-or text-[10px] tracking-widest">Courrier postal</p>
                <address className="not-italic text-ivoire mt-1 leading-relaxed">
                  DPO — Atelier Frisson
                  <br />
                  Numelite SASU
                  <br />
                  [Adresse complète à compléter]
                  <br />
                  Paris, France
                </address>
                <p className="text-ivoire/70 mt-1 text-xs">
                  Recommandé avec accusé de réception recommandé pour les demandes formelles
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* RESPONSABILITÉS */}
      <section className="mx-auto mb-14 max-w-5xl md:mb-20">
        <div className="mb-10 text-center">
          <p className="ui-caps text-or-dark">Mission</p>
          <h2 className="font-display text-noir mt-3 text-3xl font-medium md:text-4xl">
            Trois responsabilités
          </h2>
          <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
        </div>
        <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-3">
          {RESPONSIBILITIES.map((r, i) => (
            <li key={r.title} className="bg-ivoire flex flex-col gap-3 p-7 md:p-8">
              <span className="font-display tabular text-or-dark text-2xl font-medium">
                {String(i + 1).padStart(2, '0')}
              </span>
              <r.icon className="text-or-dark size-5 stroke-[1.5]" aria-hidden="true" />
              <h3 className="font-display text-noir text-lg font-medium leading-tight">
                {r.title}
              </h3>
              <p className="text-encre/75 text-sm leading-relaxed">{r.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* PROCÉDURES */}
      <section className="mx-auto mb-14 max-w-3xl md:mb-20">
        <div className="mb-10 text-center">
          <p className="ui-caps text-or-dark">Procédure</p>
          <h2 className="font-display text-noir mt-3 text-3xl font-medium md:text-4xl">
            Comment exercer un droit
          </h2>
          <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
        </div>
        <ol className="border-encre/10 divide-encre/8 divide-y border">
          {PROCEDURES.map((p) => (
            <li key={p.title} className="bg-ivoire-light flex flex-col gap-2 p-6 md:p-7">
              <h3 className="font-display text-noir text-lg font-medium">{p.title}</h3>
              <p
                className="text-encre/80 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: p.body }}
              />
            </li>
          ))}
        </ol>
      </section>

      {/* CATÉGORIES DE DONNÉES */}
      <section className="mx-auto mb-14 max-w-3xl md:mb-20">
        <div className="mb-10 text-center">
          <p className="ui-caps text-or-dark">Transparence</p>
          <h2 className="font-display text-noir mt-3 text-3xl font-medium md:text-4xl">
            Catégories de données traitées
          </h2>
          <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
        </div>
        <table className="border-encre/10 w-full border text-sm">
          <thead>
            <tr className="bg-ivoire-light">
              <th
                scope="col"
                className="border-encre/10 ui-caps text-encre/70 border-b border-r p-4 text-left text-[10px] tracking-widest"
              >
                Catégorie
              </th>
              <th
                scope="col"
                className="border-encre/10 ui-caps text-encre/70 border-b p-4 text-left text-[10px] tracking-widest"
              >
                Données concernées
              </th>
            </tr>
          </thead>
          <tbody>
            {DATA_CATEGORIES.map((row, i) => (
              <tr key={row.category} className={i % 2 === 0 ? 'bg-ivoire' : 'bg-ivoire-light'}>
                <td className="border-encre/10 border-r p-4 align-top">
                  <span className="font-display text-noir font-medium">{row.category}</span>
                </td>
                <td className="text-encre/85 p-4 leading-relaxed">{row.items}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-encre/65 mt-4 text-xs leading-relaxed">
          Liste exhaustive des traitements disponible dans la{' '}
          <Link
            href="/confidentialite"
            className="text-or-dark underline underline-offset-4 hover:text-or"
          >
            politique de confidentialité
          </Link>{' '}
          (registre RGPD art. 30).
        </p>
      </section>

      {/* RECOURS */}
      <section className="mx-auto max-w-3xl">
        <div className="border-encre/10 bg-ivoire-light flex flex-col gap-4 border p-6 md:p-8">
          <h2 className="font-display text-noir text-2xl font-medium">Recours auprès de la CNIL</h2>
          <p className="text-encre/80 text-sm leading-relaxed">
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une
            réclamation auprès de la Commission nationale de l'informatique et des libertés (art.
            77 RGPD).
          </p>
          <a
            href="https://www.cnil.fr/fr/plaintes"
            target="_blank"
            rel="noreferrer noopener"
            className="ui-caps text-or-dark hover:text-or inline-flex w-fit items-center gap-2 text-[10px] underline underline-offset-4"
          >
            cnil.fr/fr/plaintes
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="mt-20 text-center" aria-hidden="true">
        <Fleuron variant="crown" size="md" color="or" className="mx-auto opacity-80" />
        <Wordmark as="p" size="sm" color="noir" className="mt-3 opacity-70" />
      </section>
    </Container>
  );
}
