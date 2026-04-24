import type { Metadata } from 'next';
import { Building, Phone, FileText, Plug } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const metadata: Metadata = {
  title: 'Paramètres',
};

const SECTIONS = [
  {
    icon: Building,
    title: 'Informations société',
    description: 'Raison sociale, SIRET, RCS, TVA intra, capital social.',
    fields: [
      'SASU Atelier Frisson (en cours d\u2019immatriculation)',
      'SIRET — à venir',
      'TVA intra — à venir',
    ],
  },
  {
    icon: Phone,
    title: 'Coordonnées contact',
    description: 'Adresse, téléphone, email, horaires service client.',
    fields: ['contact@atelierfrisson.fr', 'Réponse sous 24h ouvrées'],
  },
  {
    icon: FileText,
    title: 'Conformité légale',
    description: 'Mentions légales, hébergeur, directeur publication, DPO.',
    fields: ['Hébergement : Vercel Pro (UE)', 'CDN : Cloudflare', 'Conformité Arcom + RGPD'],
  },
  {
    icon: Plug,
    title: 'Intégrations',
    description: 'Clés API, webhooks, providers tiers.',
    fields: [
      'Supabase EU — à configurer',
      'Stripe TEST (dev only)',
      'CCBill prod — après K-Bis',
      'Resend, Klaviyo, Mux, PostHog, Sentry, Upstash',
    ],
  },
] as const;

export default async function AdminParametresPage() {
  return (
    <>
      <AdminPageHeader
        title="Paramètres"
        description="Configuration globale du site — informations société, contact, légal, intégrations."
      />
      <div className="space-y-6 px-8 py-10 md:px-12">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="border-encre/10 bg-ivoire hover:border-or border p-6 transition-colors md:p-8"
          >
            <header className="flex items-start gap-4">
              <s.icon className="text-or-dark mt-1 size-5" aria-hidden="true" />
              <div>
                <h2 className="font-display text-noir text-xl font-medium">{s.title}</h2>
                <p className="text-encre/65 mt-1 text-sm">{s.description}</p>
              </div>
            </header>
            <ul className="text-encre/85 mt-4 space-y-2 text-sm">
              {s.fields.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span aria-hidden="true" className="bg-or mt-2 size-1 shrink-0 rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
