import type { Metadata } from 'next';
import { Search, Plus, FileWarning, Globe } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: 'SEO',
};

export default async function AdminSeoPage() {
  return (
    <>
      <AdminPageHeader
        title="SEO"
        description="Redirections 301/302, sitemap, meta fallbacks, monitoring Search Console."
        actions={
          <button
            type="button"
            className="ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-4 py-2.5 transition-colors"
          >
            <Plus className="size-4" aria-hidden="true" />
            Nouvelle redirection
          </button>
        }
      />
      <div className="space-y-10 px-8 py-10 md:px-12">
        <section>
          <h2 className="ui-caps text-or-dark mb-4">Indexation</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Pages indexées" value="—" hint="GSC non branché" />
            <StatCard label="Erreurs crawl" value="—" hint="404, 5xx, redirect chains" />
            <StatCard label="Sitemap status" value="OK" subline="/sitemap.xml regen 24h" />
            <StatCard label="Robots.txt" value="OK" subline="GPTBot/CCBot bloqués" />
          </div>
        </section>

        <section>
          <h2 className="ui-caps text-or-dark mb-4">Redirections</h2>
          <EmptyState
            icon={Search}
            title="Aucune redirection configurée"
            description="Créez des 301/302 par chemin (from/to) avec compteur de hits. Indispensable pour les migrations URL et le rebrand."
          />
        </section>

        <section>
          <h2 className="ui-caps text-or-dark mb-4">Audit on-page</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <SeoAuditCard icon={FileWarning} label="Pages sans description" value="0" status="ok" />
            <SeoAuditCard icon={Globe} label="Pages sans canonical" value="0" status="ok" />
            <SeoAuditCard
              icon={FileWarning}
              label="Title trop long ( &gt; 60c )"
              value="0"
              status="ok"
            />
          </div>
        </section>
      </div>
    </>
  );
}

function SeoAuditCard({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: typeof Search;
  label: string;
  value: string;
  status: 'ok' | 'warning' | 'error';
}) {
  const tone =
    status === 'ok'
      ? 'border-af-success/30 bg-af-success/5'
      : status === 'warning'
        ? 'border-af-warning/30 bg-af-warning/5'
        : 'border-rouge-light/30 bg-rouge-light/5';
  return (
    <div className={`flex items-start gap-4 border p-5 ${tone}`}>
      <Icon className="text-encre/65 mt-0.5 size-5" aria-hidden="true" />
      <div>
        <p className="ui-caps text-encre/65">{label}</p>
        <p className="font-display tabular text-noir mt-1 text-2xl font-medium">{value}</p>
      </div>
    </div>
  );
}
