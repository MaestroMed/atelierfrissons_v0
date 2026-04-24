import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { requireSession } from '@/lib/auth/session';

export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession('/compte');

  return (
    <Container className="py-10 md:py-14">
      <BreadcrumbNav
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Mon compte', href: '/compte' },
        ]}
        className="mb-8"
      />
      <header className="mb-10 flex flex-col items-start gap-3 md:mb-14">
        <p className="ui-caps text-or-dark">Espace personnel</p>
        <h1 className="font-display text-noir text-4xl font-medium md:text-5xl">
          Bonjour <span className="font-italic-editorial text-or-dark">·</span>
        </h1>
        <Fleuron variant="divider" size="md" color="or" className="opacity-70" />
      </header>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
        <AccountSidebar email={user.email} />
        <main>{children}</main>
      </div>
    </Container>
  );
}
