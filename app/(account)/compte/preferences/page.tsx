import type { Metadata } from 'next';
import { Bell, Mail, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Préférences',
  robots: { index: false, follow: false },
};

export default async function PreferencesPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="font-display text-noir text-2xl font-medium md:text-3xl">Préférences</h2>
        <p className="text-encre/65 mt-2 text-sm">
          Choisissez le rythme et la nature des correspondances que vous recevez.
        </p>
      </header>

      <section className="space-y-4">
        <PreferenceRow
          icon={Mail}
          title="Newsletter éditoriale"
          description="Une lettre mensuelle — rituels, portraits, conseils sexologue. Jamais plus de deux fois par mois."
          enabled
        />
        <PreferenceRow
          icon={ShoppingBag}
          title="Nouveautés produits"
          description="Avant-premières des nouvelles pièces et collections capsule."
          enabled={false}
        />
        <PreferenceRow
          icon={Bell}
          title="Alertes promotions"
          description="Soldes saisonnières et offres exclusives — uniquement si vous le souhaitez."
          enabled={false}
        />
      </section>

      <p className="text-encre/55 text-xs">
        Vos préférences sont sauvegardées immédiatement. Vous pouvez vous désabonner à tout moment
        via un lien en bas de chaque e-mail.
      </p>
    </div>
  );
}

function PreferenceRow({
  icon: Icon,
  title,
  description,
  enabled,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="border-encre/10 bg-ivoire flex items-start justify-between gap-6 border p-5">
      <div className="flex items-start gap-4">
        <Icon className="text-or-dark mt-1 size-4 shrink-0" aria-hidden="true" />
        <div>
          <h3 className="font-display text-noir text-base font-medium">{title}</h3>
          <p className="text-encre/70 mt-1.5 text-sm">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center">
        <input type="checkbox" defaultChecked={enabled} className="peer sr-only" />
        <span className="bg-encre/20 peer-checked:bg-or absolute inset-0 rounded-full transition-colors" />
        <span className="bg-ivoire shadow-card absolute top-0.5 left-0.5 size-5 rounded-full transition-transform peer-checked:translate-x-5" />
      </label>
    </div>
  );
}
