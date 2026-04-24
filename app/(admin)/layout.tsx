import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { requireAdmin } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: { template: '%s · Admin Atelier Frisson', default: 'Back-office' },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Admin layout — gate via requireAdmin() (redirect login si non auth).
 *
 * Sprint 4+ : ajouter check 2FA TOTP enrolled obligatoire (CLAUDE.md §8.1).
 * Pour l'instant : tout user authentifié peut accéder en dev.
 *
 * Layout : sidebar fixe gauche + content scrollable droite.
 * Pas de Header / Footer publics ici — environnement isolé.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="bg-ivoire-light flex min-h-dvh">
      <AdminSidebar email={user.email} />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
