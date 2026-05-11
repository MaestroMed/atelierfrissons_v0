import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Copy, Gift, Mail, Sparkles, Users } from 'lucide-react';
import { Fleuron } from '@/components/layout/Fleuron';
import { ReferralCodeCopy } from '@/components/account/ReferralCodeCopy';

export const metadata: Metadata = {
  title: 'Programme parrainage — 20 € pour vous, 20 € pour eux',
  description:
    'Partagez votre code de parrainage Atelier Frisson : 20 € de remise pour la personne parrainée, 20 € de crédit pour vous dès sa première commande.',
  alternates: { canonical: '/compte/parrainage' },
};

/**
 * Mock data — sera remplacé par lecture DB `referrals` table en Sprint P3.
 * Pour le pivot, le code est généré à partir de l'email pour cohérence stable.
 */
function generateMockReferralCode(): string {
  // Stub déterministe (sera remplacé par génération vraie via session)
  return 'AF-MEHDI-A4F2';
}

const HOW_IT_WORKS = [
  {
    icon: Mail,
    label: 'Vous partagez votre code',
    body: 'Par message, par email, ou via votre lien personnalisé. Vous pouvez le donner autant de fois que vous voulez.',
  },
  {
    icon: Gift,
    label: 'Ils obtiennent −20 €',
    body: 'À leur première commande de 60 € minimum, votre code applique une remise immédiate de 20 € au panier.',
  },
  {
    icon: Sparkles,
    label: 'Vous gagnez 20 € de crédit',
    body: 'Crédité automatiquement sur votre compte dans les 14 jours suivant la livraison de leur commande (délai de retour).',
  },
] as const;

const FAQ = [
  {
    q: 'Combien de personnes puis-je parrainer ?',
    a: 'Aucune limite officielle. Au-delà de 30 parrainages effectifs sur 12 mois, nous vous contacterons pour vous proposer un statut "ambassadrice" avec des conditions différentes.',
  },
  {
    q: 'Puis-je cumuler le crédit avec d\'autres remises ?',
    a: 'Oui. Le crédit parrainage se combine avec le code newsletter (−10 % 1ère commande), avec les promotions saisonnières, et avec les soldes. Il ne se combine pas avec les cartes cadeaux (logique différente).',
  },
  {
    q: 'Et si la personne parrainée annule sa commande ?',
    a: 'Le crédit n\'est validé qu\'après le délai de retour de 14 jours. Si la commande est annulée ou retournée, le crédit n\'est pas attribué.',
  },
  {
    q: 'Le crédit a-t-il une date d\'expiration ?',
    a: '12 mois à compter de la date d\'attribution. Vous pouvez l\'utiliser sur n\'importe quelle commande, hors carte cadeau.',
  },
];

export default function ParrainagePage() {
  const code = generateMockReferralCode();
  const shareUrl = `https://atelierfrisson.fr/?ref=${code}`;

  // Mock stats — remplacer par query DB
  const stats = {
    totalShared: 4,
    completed: 2,
    pending: 1,
    creditCents: 4000,
  };

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* HERO bloc */}
      <section className="bg-noir text-ivoire relative isolate overflow-hidden p-8 md:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_75%_70%,rgba(139,20,36,0.18)_0%,transparent_60%)]"
        />
        <div className="relative">
          <Fleuron variant="crown" size="md" color="or" className="mb-4 opacity-80" />
          <p className="ui-caps text-or text-[11px] tracking-[0.22em]">Programme parrainage</p>
          <h2 className="font-display mt-4 text-4xl leading-tight font-medium md:text-5xl lg:text-6xl">
            20 € pour vous,{' '}
            <span className="font-italic-editorial text-or">20 € pour eux.</span>
          </h2>
          <p className="text-ivoire/80 mt-6 max-w-xl text-base leading-relaxed md:text-lg">
            Partagez votre code à votre cercle proche. Pour chaque première commande déclenchée
            par votre code, vous recevez 20 € de crédit, ils reçoivent 20 € de remise.
          </p>
        </div>
      </section>

      {/* Code + lien */}
      <section className="border-encre/10 bg-ivoire-light flex flex-col gap-6 border p-6 md:p-10">
        <div className="flex flex-col gap-2">
          <p className="ui-caps text-or-dark text-[11px] tracking-widest">Votre code</p>
          <ReferralCodeCopy code={code} shareUrl={shareUrl} />
        </div>

        <div className="border-encre/10 grid grid-cols-2 gap-px border md:grid-cols-4">
          <Stat label="Codes partagés" value={String(stats.totalShared)} />
          <Stat label="Commandes générées" value={String(stats.completed)} accent />
          <Stat label="En attente" value={String(stats.pending)} />
          <Stat
            label="Crédit cumulé"
            value={`${(stats.creditCents / 100).toFixed(0)} €`}
            accent
          />
        </div>
      </section>

      {/* Comment ça marche */}
      <section>
        <header className="mb-6 flex items-center gap-3">
          <Users className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">
            Comment ça marche
          </h2>
        </header>
        <ul className="bg-or/15 grid grid-cols-1 gap-px md:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step.label} className="bg-ivoire flex flex-col gap-3 p-6 md:p-7">
              <span className="font-display tabular text-or-dark text-2xl font-medium">
                {`0${i + 1}`.slice(-2)}
              </span>
              <step.icon className="text-or-dark size-5 stroke-[1.5]" aria-hidden="true" />
              <h3 className="font-display text-noir text-base font-medium">{step.label}</h3>
              <p className="text-encre/70 text-sm leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA partage rapide */}
      <section className="bg-ivoire-light border-encre/10 border p-6 text-center md:p-10">
        <Fleuron variant="divider" size="sm" color="or" className="mx-auto opacity-80" />
        <h2 className="font-display text-noir mt-4 text-2xl font-medium md:text-3xl">
          Partager maintenant
        </h2>
        <p className="text-encre/70 mt-3 text-sm md:text-base">
          Choisissez le canal qui vous convient — votre code est inclus automatiquement.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:?subject=${encodeURIComponent('Atelier Frisson — 20 € pour ta première commande')}&body=${encodeURIComponent(`Voilà mon code parrainage Atelier Frisson : ${code}\n\nIl te donne 20 € de remise sur ta première commande de 60 € minimum.\n${shareUrl}`)}`}
            className="ui-caps-md bg-noir text-ivoire hover:bg-rouge inline-flex items-center gap-2 px-6 py-3 transition-colors"
          >
            <Mail className="size-4" aria-hidden="true" />
            Par email
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Voilà mon code parrainage Atelier Frisson : ${code} — il te donne 20 € de remise sur ta première commande. ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ui-caps-md border-noir/30 text-noir hover:border-noir inline-flex items-center gap-2 border px-6 py-3 transition-colors"
          >
            Par WhatsApp
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <Link
            href="/boutique"
            className="ui-caps-md text-encre/65 hover:text-or-dark inline-flex items-center gap-2 underline underline-offset-4"
          >
            Voir la boutique
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <header className="mb-4 flex items-center gap-3">
          <Copy className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">
            Questions fréquentes
          </h2>
        </header>
        <div className="space-y-2">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group border-encre/10 border-b py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="text-noir font-display flex cursor-pointer items-center justify-between text-base">
                {item.q}
                <span
                  aria-hidden="true"
                  className="text-or ml-4 text-2xl leading-none transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-encre/80 mt-3 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-ivoire flex flex-col gap-1 p-5 text-center">
      <p className="ui-caps text-encre/55 text-[10px] tracking-widest">{label}</p>
      <p
        className={
          accent
            ? 'font-display text-or-dark text-2xl tabular-nums font-medium'
            : 'font-display text-noir text-2xl tabular-nums font-medium'
        }
      >
        {value}
      </p>
    </div>
  );
}
