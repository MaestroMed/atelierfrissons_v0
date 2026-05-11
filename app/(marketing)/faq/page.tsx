import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'Questions fréquentes — Atelier Frisson',
  description:
    'Réponses aux questions sur la livraison, les retours, les paiements, la confidentialité, les abonnements Box Mensuelle et le programme parrainage.',
  alternates: { canonical: '/faq' },
};

interface FaqEntry {
  question: string;
  answer: string;
}

interface FaqGroup {
  title: string;
  anchor: string;
  entries: readonly FaqEntry[];
}

const FAQ: readonly FaqGroup[] = [
  {
    title: 'Livraison & emballage',
    anchor: 'livraison',
    entries: [
      {
        question: 'Comment se passe la livraison ?',
        answer:
          'Colissimo Suivi 48 h en France métropolitaine, Mondial Relay pour les points relais, DHL Express pour la Suisse et l\'Union européenne. Suivi inclus.',
      },
      {
        question: 'Y a-t-il une mention extérieure du contenu ?',
        answer:
          'Aucune. La boîte est neutre, signée à la main, sans logo Atelier Frisson visible à l\'extérieur. Le bordereau d\'expédition n\'indique que « Colis ».',
      },
      {
        question: 'À partir de quel montant la livraison est-elle offerte ?',
        answer: 'Dès 60 € en France et 80 € en Union européenne. En dessous, frais de port standard 6,90 €.',
      },
      {
        question: 'Délai d\'expédition ?',
        answer: 'Sous 48 h ouvrées depuis notre entrepôt UE (Pologne). Livraison Colissimo en 48 h supplémentaires en France.',
      },
    ],
  },
  {
    title: 'Retours & garantie',
    anchor: 'retours',
    entries: [
      {
        question: 'Puis-je retourner un objet ?',
        answer:
          'Pour des raisons d\'hygiène (article L221-28 5° du Code de la consommation), les objets descellés ne sont pas retournables. En revanche, tout objet dont l\'emballage scellé n\'a pas été ouvert peut être retourné dans les 14 jours suivant la réception, sans justification, contre remboursement intégral.',
      },
      {
        question: 'Qu\'en est-il de la lingerie ?',
        answer:
          'La lingerie peut être retournée dans son état d\'origine (avec étiquettes, jamais portée) sous 14 jours. Pour des raisons d\'hygiène, le retour devient impossible une fois la pièce essayée hors emballage.',
      },
      {
        question: 'Quelle garantie ?',
        answer:
          'Garantie 2 ans constructeur sur les objets motorisés (vibrateurs, masseurs). Garantie à vie sur les pièces signature (Velours).',
      },
    ],
  },
  {
    title: 'Paiement & sécurité',
    anchor: 'paiement',
    entries: [
      {
        question: 'Quels moyens de paiement acceptez-vous ?',
        answer:
          'Cartes bancaires Visa, Mastercard, American Express. Apple Pay et Google Pay sur mobile. Paiement chiffré PCI-DSS niveau 1 — vos données ne sont jamais stockées sur nos serveurs.',
      },
      {
        question: 'La trace bancaire mentionne-t-elle Atelier Frisson ?',
        answer:
          'L\'écriture sur votre relevé bancaire affiche « ATELIER FR » uniquement. Pas de mention du secteur ou du contenu de la commande.',
      },
      {
        question: 'Mon code de carte cadeau peut-il être utilisé en plusieurs fois ?',
        answer:
          'Oui. Le solde décrémente à chaque commande jusqu\'à épuisement. Vous pouvez aussi combiner avec un autre moyen de paiement.',
      },
    ],
  },
  {
    title: 'Confidentialité & données',
    anchor: 'confidentialite',
    entries: [
      {
        question: 'Mes données personnelles sont-elles partagées ?',
        answer:
          'Jamais. Aucune revente à des tiers. Hébergement Supabase région UE (Frankfurt). Vous pouvez exporter ou supprimer vos données à tout moment depuis votre compte.',
      },
      {
        question: 'Cookies utilisés ?',
        answer:
          'Strictement nécessaires uniquement par défaut. Cookies de mesure d\'audience et marketing avec votre consentement explicite uniquement (banner CNIL au premier accès).',
      },
      {
        question: 'Comment exercer mes droits RGPD ?',
        answer:
          'Depuis votre espace client → Mes données. Export complet en 15 minutes, suppression définitive avec délai de grâce de 30 jours.',
      },
    ],
  },
  {
    title: 'Box Mensuelle',
    anchor: 'box',
    entries: [
      {
        question: 'Combien de pièces dans chaque box ?',
        answer: '3 pour la Box Découverte, 4 pour la Premium, 5 pour la Trio. Renouvelables mensuellement.',
      },
      {
        question: 'Quelle est la durée d\'engagement ?',
        answer: 'Aucune. Vous pouvez annuler depuis votre compte en deux clics, à tout moment.',
      },
      {
        question: 'Puis-je sauter un mois ?',
        answer:
          'Oui, sans frais. Depuis votre compte, jusqu\'à 48 heures avant la date de prélèvement. La box du mois suivant reprend normalement.',
      },
      {
        question: 'Puis-je offrir la Box ?',
        answer:
          'Oui — choix de durée 3, 6 ou 12 mois, prélèvement immédiat, envoi à la date de votre choix. Aucun renouvellement automatique.',
      },
    ],
  },
  {
    title: 'Parrainage & fidélité',
    anchor: 'parrainage',
    entries: [
      {
        question: 'Comment fonctionne le parrainage ?',
        answer:
          '20 € de remise pour le filleul à sa première commande (≥ 60 €). 20 € de crédit pour le parrain, attribué J+14 après livraison effective.',
      },
      {
        question: 'Le programme fidélité : 1 € = combien de points ?',
        answer:
          '1 € dépensé = 1 point. 100 points = 5 € de remise. Anniversaire +50 points. Avis publié +20 points. Parrainage +200 points.',
      },
      {
        question: 'Les points expirent-ils ?',
        answer: '12 mois à compter de leur attribution. Notifications automatiques à J-30.',
      },
    ],
  },
  {
    title: 'Matières & entretien',
    anchor: 'matieres',
    entries: [
      {
        question: 'Qu\'est-ce que le silicone médical ISO 10993 ?',
        answer:
          'C\'est la norme internationale pour la biocompatibilité des dispositifs médicaux : absence de phthalates, BPA, additifs colorants instables. Voir notre article détaillé.',
      },
      {
        question: 'Quel lubrifiant utiliser avec mes objets ?',
        answer:
          'Toujours un lubrifiant à base d\'eau (comme Source). Jamais à base de silicone — il dégraderait la matière des objets en silicone médical.',
      },
      {
        question: 'Comment nettoyer après usage ?',
        answer:
          'Savon doux + eau tiède (≤ 40 °C) avant et après chaque usage. Séchage à l\'air libre. Trempage 5 min dans une solution antibactérienne sans alcool 1 fois par mois.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <Container className="py-12 md:py-16">
      <BreadcrumbNav
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'FAQ', href: '/faq' },
        ]}
        className="mb-10"
      />

      {/* HERO */}
      <header className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
        <Fleuron variant="crown" size="md" color="or" className="mx-auto mb-5 opacity-80" />
        <p className="ui-caps text-or-dark text-xs tracking-[0.3em]">Questions fréquentes</p>
        <h1 className="font-display text-noir mt-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-medium">
          Réponses{' '}
          <span className="font-italic-editorial text-or-dark">en clair</span>
        </h1>
        <Fleuron variant="divider" size="md" color="or" className="mx-auto mt-3 opacity-80" />
        <p className="font-italic-editorial text-encre/75 mt-6 text-base md:text-lg">
          Sept rubriques, vingt-deux questions, écrites pour répondre vraiment.
        </p>
      </header>

      {/* TOC */}
      <nav
        aria-label="Sommaire FAQ"
        className="border-encre/10 bg-ivoire-light mx-auto mb-14 max-w-3xl border p-6 md:mb-20 md:p-8"
      >
        <p className="ui-caps text-or-dark mb-4 text-[10px] tracking-widest">Sommaire</p>
        <ul className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
          {FAQ.map((group) => (
            <li key={group.anchor}>
              <a
                href={`#${group.anchor}`}
                className="text-encre/85 hover:text-or-dark inline-flex items-center gap-2 underline underline-offset-4 hover:underline-offset-2"
              >
                <span className="font-display tabular text-or-dark">·</span>
                {group.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* FAQ groups */}
      <div className="mx-auto max-w-3xl space-y-14 md:space-y-20">
        {FAQ.map((group) => (
          <section key={group.anchor} id={group.anchor} className="scroll-mt-20">
            <header className="mb-6 flex items-center gap-3">
              <Fleuron variant="divider" size="sm" color="or" className="opacity-70" />
              <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">
                {group.title}
              </h2>
            </header>
            <div className="border-encre/10 divide-encre/8 divide-y border">
              {group.entries.map((entry) => (
                <details
                  key={entry.question}
                  className="group bg-ivoire-light [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="text-noir font-display flex cursor-pointer items-center justify-between gap-4 p-5 text-base md:p-6 md:text-lg">
                    {entry.question}
                    <span
                      aria-hidden="true"
                      className="text-or ml-4 shrink-0 text-2xl leading-none transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-encre/80 px-5 pb-5 text-sm leading-relaxed md:px-6 md:pb-6 md:text-base">
                    {entry.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contact */}
      <section className="border-encre/10 bg-noir text-ivoire mx-auto mt-20 max-w-3xl border p-8 text-center md:p-12">
        <Fleuron variant="crown" size="md" color="or" className="mx-auto mb-4 opacity-80" />
        <h2 className="font-display text-3xl font-medium md:text-4xl">
          Une question{' '}
          <span className="font-italic-editorial text-or">qui n\'est pas là ?</span>
        </h2>
        <p className="text-ivoire/80 mt-4 text-sm md:text-base">
          Service client tenu par une seule personne — réponse sous 24 h ouvrées, jamais de
          chatbot.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="mailto:bonjour@atelierfrisson.fr"
            className="ui-caps-md bg-or text-noir hover:bg-or-light inline-flex items-center gap-2 px-6 py-3"
          >
            bonjour@atelierfrisson.fr
          </Link>
          <Link
            href="/dpo"
            className="ui-caps-md border-or/60 text-or hover:bg-or hover:text-noir inline-flex items-center gap-2 border px-6 py-3"
          >
            Question RGPD
          </Link>
        </div>
      </section>
    </Container>
  );
}
