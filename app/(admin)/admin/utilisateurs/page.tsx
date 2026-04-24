import type { Metadata } from 'next';
import { ShieldCheck, Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'Utilisateurs admin',
};

export default async function AdminUtilisateursPage() {
  return (
    <>
      <AdminPageHeader
        title="Utilisateurs admin"
        description="Comptes admin avec rôles owner / manager / support / contributor. 2FA TOTP obligatoire."
        actions={
          <button
            type="button"
            className="ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-4 py-2.5 transition-colors"
          >
            <Plus className="size-4" aria-hidden="true" />
            Inviter un admin
          </button>
        }
      />
      <div className="space-y-8 px-8 py-10 md:px-12">
        <div className="border-or/30 bg-or/5 border p-5">
          <h3 className="font-display text-noir flex items-center gap-2 text-lg font-medium">
            <ShieldCheck className="text-or-dark size-4" aria-hidden="true" />
            Sécurité
          </h3>
          <p className="text-encre/75 mt-2 text-sm">
            <strong>2FA TOTP obligatoire</strong> pour tous les comptes admin (CLAUDE.md §8.1).
            Sessions limitées à 7 jours, rate limit 3 tentatives/15min puis lock 1h. Alerte email à
            chaque connexion depuis une IP nouvelle.
          </p>
        </div>

        <EmptyState
          icon={ShieldCheck}
          title="Vous êtes seul·e admin pour le moment"
          description="Le bootstrap initial créera votre compte owner avec accès complet. Sprint 4 livre l'interface d'invitation, gates 2FA, et journal des connexions."
        />
      </div>
    </>
  );
}
