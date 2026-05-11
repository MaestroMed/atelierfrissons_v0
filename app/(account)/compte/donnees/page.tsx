import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Download,
  Trash2,
  ShieldCheck,
  Mail,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Fleuron } from '@/components/layout/Fleuron';
import { GdprActionsForm } from '@/components/account/GdprActionsForm';

export const metadata: Metadata = {
  title: 'Mes données — RGPD',
  description:
    'Exercice de vos droits RGPD : accès, portabilité, effacement, opposition. Atelier Frisson respecte vos droits.',
  alternates: { canonical: '/compte/donnees' },
  robots: { index: false, follow: false },
};

const RIGHTS = [
  {
    icon: FileText,
    title: 'Accès & portabilité (art. 15 + 20)',
    body: 'Recevez un export complet de vos données — commandes, adresses, préférences, historique de points fidélité. Format JSON ou CSV au choix.',
    cta: 'Demander mon export',
    actionKind: 'export' as const,
  },
  {
    icon: ShieldCheck,
    title: 'Rectification (art. 16)',
    body: 'Modifiez vos informations personnelles depuis vos préférences. Pour des données plus sensibles (date de naissance, etc.), contactez le DPO.',
    cta: 'Modifier mes infos',
    actionKind: 'rectify' as const,
  },
  {
    icon: Mail,
    title: 'Opposition (art. 21)',
    body: 'Désabonnez-vous des communications marketing en un clic depuis vos préférences emails. Désopt-in instantané, pas de délai.',
    cta: 'Préférences emails',
    actionKind: 'optout' as const,
  },
  {
    icon: Trash2,
    title: 'Effacement (art. 17)',
    body: 'Supprimez définitivement votre compte. Délai de grâce de 30 jours pendant lequel vous pouvez annuler. Au-delà : effacement irréversible.',
    cta: 'Supprimer mon compte',
    actionKind: 'erase' as const,
  },
] as const;

export default function DonneesPage() {
  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* HERO */}
      <section className="bg-noir text-ivoire relative isolate overflow-hidden p-8 md:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_30%_30%,rgba(201,163,107,0.18)_0%,transparent_55%)]"
        />
        <div className="relative">
          <Fleuron variant="crown" size="md" color="or" className="mb-4 opacity-80" />
          <p className="ui-caps text-or text-[11px] tracking-[0.22em]">
            RGPD · Vos droits
          </p>
          <h2 className="font-display mt-4 text-4xl leading-tight font-medium md:text-5xl">
            Vos données{' '}
            <span className="font-italic-editorial text-or">vous appartiennent.</span>
          </h2>
          <p className="text-ivoire/80 mt-6 max-w-2xl text-base leading-relaxed">
            Atelier Frisson est responsable de traitement (RGPD art. 4§7). Voici les
            quatre droits que vous pouvez exercer depuis cette page — chacun en deux clics, sans
            justification à fournir.
          </p>
        </div>
      </section>

      {/* 4 droits — affichage informatif */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {RIGHTS.map((right) => (
          <article
            key={right.title}
            className="bg-ivoire-light border-encre/10 flex h-full flex-col gap-4 border p-6 md:p-7"
          >
            <right.icon
              className={
                right.actionKind === 'erase'
                  ? 'text-rouge size-5 stroke-[1.5]'
                  : 'text-or-dark size-5 stroke-[1.5]'
              }
              aria-hidden="true"
            />
            <h3 className="font-display text-noir text-xl leading-tight font-medium">
              {right.title}
            </h3>
            <p className="font-italic-editorial text-encre/80 text-sm leading-relaxed">
              {right.body}
            </p>
            {right.actionKind === 'rectify' ? (
              <Link
                href="/compte/preferences"
                className="ui-caps text-or-dark hover:text-or mt-auto inline-flex items-center gap-2 text-[10px] underline underline-offset-4"
              >
                {right.cta}
              </Link>
            ) : right.actionKind === 'optout' ? (
              <Link
                href="/compte/preferences#emails"
                className="ui-caps text-or-dark hover:text-or mt-auto inline-flex items-center gap-2 text-[10px] underline underline-offset-4"
              >
                {right.cta}
              </Link>
            ) : null}
          </article>
        ))}
      </section>

      {/* Actions concrètes (formulaires) */}
      <GdprActionsForm />

      {/* Contact DPO */}
      <section className="border-encre/10 bg-ivoire-light flex flex-col gap-3 border p-6 md:p-8">
        <header className="flex items-center gap-3">
          <Mail className="text-or-dark size-5" aria-hidden="true" strokeWidth={1.5} />
          <h2 className="font-display text-noir text-2xl font-medium">
            Délégué à la protection des données
          </h2>
        </header>
        <p className="text-encre/75 text-sm leading-relaxed">
          Pour toute question sur le traitement de vos données personnelles, ou pour exercer un
          droit qui n'est pas accessible via cette page (ex : transfert vers un autre responsable),
          contactez directement le DPO de la maison :
        </p>
        <ul className="text-encre/85 mt-2 flex flex-col gap-2 text-sm">
          <li className="flex items-center gap-3">
            <Mail className="text-or-dark size-4 shrink-0" aria-hidden="true" />
            <a
              href="mailto:dpo@atelierfrisson.fr"
              className="hover:text-or-dark underline underline-offset-4"
            >
              dpo@atelierfrisson.fr
            </a>
            <span className="text-encre/55 text-xs">— réponse sous 30 jours (max légal RGPD)</span>
          </li>
          <li className="flex items-center gap-3">
            <FileText className="text-or-dark size-4 shrink-0" aria-hidden="true" />
            <Link
              href="/dpo"
              className="hover:text-or-dark underline underline-offset-4"
            >
              Page DPO complète + procédures
            </Link>
          </li>
        </ul>
        <p className="text-encre/60 mt-3 border-t border-encre/10 pt-3 text-xs leading-relaxed">
          En cas de désaccord persistant, vous pouvez aussi déposer une plainte auprès de la{' '}
          <a
            href="https://www.cnil.fr/"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-or-dark underline underline-offset-2"
          >
            CNIL
          </a>{' '}
          (Commission nationale de l'informatique et des libertés).
        </p>
      </section>

      {/* Note réglementaire */}
      <section className="border-encre/10 flex items-start gap-3 border-l-2 border-l-or-dark/60 pl-5">
        <AlertTriangle
          className="text-or-dark mt-0.5 size-4 shrink-0"
          aria-hidden="true"
          strokeWidth={1.5}
        />
        <p className="text-encre/70 text-xs leading-relaxed">
          Conformément à l'art. 12§3 RGPD, nous nous engageons à répondre à toute demande dans un
          délai d'<strong>un mois maximum</strong>. Les exports DSAR sont délivrés en 15 minutes.
          Les effacements respectent un délai de grâce de 30 jours révocable. Aucune donnée n'est
          jamais transférée hors UE.
        </p>
      </section>
    </div>
  );
}
