import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'Glossaire — vocabulaire wellness intime',
  description:
    '40+ termes du bien-être intime expliqués en français — anatomie, matières, technologies, sexualité.',
  alternates: { canonical: '/glossaire' },
};

interface GlossaireEntry {
  term: string;
  category: 'Anatomie' | 'Matériaux' | 'Technologie' | 'Pratique' | 'Santé';
  definition: string;
}

const GLOSSAIRE: readonly GlossaireEntry[] = [
  // Anatomie
  {
    term: 'Clitoris',
    category: 'Anatomie',
    definition:
      'Organe érectile féminin, comprenant une partie externe (gland) et une structure interne ramifiée mesurant 9 à 11 cm.',
  },
  {
    term: 'Vulve',
    category: 'Anatomie',
    definition:
      'Ensemble des organes génitaux externes féminins (grandes lèvres, petites lèvres, gland du clitoris, vestibule).',
  },
  {
    term: 'Périnée',
    category: 'Anatomie',
    definition:
      'Ensemble des muscles qui soutiennent les organes du petit bassin. Sa tonicité influence le plaisir.',
  },
  {
    term: 'Point G',
    category: 'Anatomie',
    definition:
      'Zone érogène située sur la paroi antérieure du vagin, à 4-5 cm de l’entrée. Sa nature exacte fait l’objet de débats scientifiques.',
  },
  {
    term: 'Vagin',
    category: 'Anatomie',
    definition:
      'Conduit musculaire élastique reliant la vulve à l’utérus. Sa muqueuse est l’une des plus perméables du corps humain.',
  },

  // Matériaux
  {
    term: 'Silicone médical',
    category: 'Matériaux',
    definition:
      'Polymère biocompatible certifié ISO 10993, utilisé pour les implants et dispositifs médicaux. Hypoallergénique, sans phthalates.',
  },
  {
    term: 'Phthalates',
    category: 'Matériaux',
    definition:
      'Plastifiants utilisés dans certains plastiques industriels. Perturbateurs endocriniens suspectés — interdits dans le silicone médical.',
  },
  {
    term: 'BPA',
    category: 'Matériaux',
    definition:
      'Bisphénol A, perturbateur endocrinien présent dans certains plastiques. Absent du silicone médical certifié.',
  },
  {
    term: 'ABS',
    category: 'Matériaux',
    definition:
      'Plastique acrylonitrile butadiène styrène, dur et brillant. Moins doux que le silicone, parfois utilisé pour les coques de moteurs.',
  },
  {
    term: 'IPX7',
    category: 'Matériaux',
    definition:
      'Norme d’étanchéité — résistance à l’immersion temporaire (30 min jusqu’à 1 m de profondeur).',
  },
  {
    term: 'IPX8',
    category: 'Matériaux',
    definition:
      'Norme d’étanchéité supérieure — immersion prolongée. Compatible avec un usage en bain.',
  },
  {
    term: 'OEKO-TEX',
    category: 'Matériaux',
    definition:
      'Label certifiant l’absence de substances nocives dans les textiles (utilisé pour les étuis et emballages).',
  },

  // Technologie
  {
    term: 'Vibrations pulsées',
    category: 'Technologie',
    definition:
      'Vibrations rythmées en alternance d’intensité, créant une sensation différente du continu.',
  },
  {
    term: 'Onde pulsée (air pulse)',
    category: 'Technologie',
    definition:
      'Technologie créant une succession d’ondes d’air rapprochées, produisant une sensation d’aspiration sans contact direct.',
  },
  {
    term: 'USB-C magnétique',
    category: 'Technologie',
    definition:
      'Recharge sans contact via des aimants — élimine le port USB ouvert (étanchéité totale).',
  },
  {
    term: 'Bluetooth 5.x',
    category: 'Technologie',
    definition:
      'Norme de connexion sans fil basse consommation, portée 10-50 m. Utilisée pour les objets pilotables par application.',
  },

  // Pratique
  {
    term: 'Lubrifiant à base d’eau',
    category: 'Pratique',
    definition: 'Compatible avec le silicone médical et le latex. Facilement rinçable, pH neutre.',
  },
  {
    term: 'Lubrifiant à base de silicone',
    category: 'Pratique',
    definition:
      'Plus longue durée, mais incompatible avec le silicone médical (dégrade la matière).',
  },
  {
    term: 'Rituel intime',
    category: 'Pratique',
    definition:
      'Suite de gestes choisis et conscients, dédiée au bien-être personnel ou partagé. Distinct de la routine.',
  },
  {
    term: 'Communication intime',
    category: 'Pratique',
    definition:
      'Conversation explicite entre partenaires sur les envies, limites, et préférences. Cruciale pour une vie intime épanouie.',
  },

  // Santé
  {
    term: 'Flore vaginale',
    category: 'Santé',
    definition:
      'Écosystème bactérien protecteur (lactobacilles dominants). pH 3,8-4,5. Sensible aux savons agressifs.',
  },
  {
    term: 'pH intime',
    category: 'Santé',
    definition:
      'Acidité naturelle du milieu vaginal (entre 3,8 et 4,5). Maintien protecteur contre infections.',
  },
  {
    term: 'Sécheresse vaginale',
    category: 'Santé',
    definition:
      'Diminution de la lubrification naturelle. Causes multiples : hormonale (ménopause), médicamenteuse, stress.',
  },
  {
    term: 'Ménopause',
    category: 'Santé',
    definition:
      'Arrêt physiologique des cycles menstruels (50 ans en moyenne). Modifie la lubrification, la libido, et la sensibilité.',
  },
  {
    term: 'Périménopause',
    category: 'Santé',
    definition:
      'Période de transition (2-7 ans) précédant la ménopause. Déjà des modifications hormonales notables.',
  },
  {
    term: 'Vaginisme',
    category: 'Santé',
    definition:
      'Contraction involontaire des muscles vaginaux empêchant la pénétration. Fréquent — accompagnement sexologique recommandé.',
  },
  {
    term: 'Anorgasmie',
    category: 'Santé',
    definition:
      'Difficulté ou impossibilité d’atteindre l’orgasme. Concerne 10-15% des femmes — multifactoriel.',
  },
  {
    term: 'Sexologue',
    category: 'Santé',
    definition:
      'Professionnel·le de santé spécialisé·e dans l’accompagnement des questions sexuelles. Diplôme universitaire (DU).',
  },

  // Production / Étiques
  {
    term: 'Maison française',
    category: 'Pratique',
    definition:
      'Marque dont la conception, la R&D, et la commercialisation sont basées en France. La fabrication peut être délocalisée (UE prioritaire).',
  },
  {
    term: 'Made in France',
    category: 'Pratique',
    definition:
      'Mention strictement encadrée — au moins 50% de la valeur ajoutée doit être réalisée en France.',
  },
  {
    term: 'Emballage neutre',
    category: 'Pratique',
    definition:
      'Boîte d’expédition sans logo ni mention du contenu, garantissant la discrétion à la livraison.',
  },

  // Plus de termes
  {
    term: 'Stimulation externe',
    category: 'Pratique',
    definition:
      'Stimulation des zones érogènes externes (vulve, clitoris). Souvent suffisante pour atteindre l’orgasme féminin.',
  },
  {
    term: 'Stimulation interne',
    category: 'Pratique',
    definition: 'Stimulation à l’intérieur du vagin, pouvant cibler la paroi antérieure ou le col.',
  },
  {
    term: 'Double action',
    category: 'Pratique',
    definition:
      'Objets combinant stimulation interne et externe simultanées (rabbit, certains cock-rings féminins).',
  },
  {
    term: 'Auto-érotisme',
    category: 'Pratique',
    definition:
      'Pratique sexuelle avec soi-même. Recommandée par les sexologues comme outil d’apprentissage de son corps.',
  },
  {
    term: 'Désir',
    category: 'Santé',
    definition:
      'Élan psychique vers l’autre ou soi-même. Distinct de l’excitation (réponse physiologique).',
  },
  {
    term: 'Excitation',
    category: 'Santé',
    definition:
      'Réponse physiologique (lubrification, érection clitoridienne, vasocongestion). Indépendante du désir psychique.',
  },
  {
    term: 'Orgasme clitoridien',
    category: 'Santé',
    definition:
      'Orgasme provoqué par stimulation du clitoris (externe ou interne via les ramifications). Le plus fréquent.',
  },
  {
    term: 'Orgasme vaginal',
    category: 'Santé',
    definition:
      'Orgasme provoqué par stimulation interne. Souvent lié à la stimulation indirecte du clitoris (zone urétrale).',
  },
  {
    term: 'Plancher pelvien',
    category: 'Anatomie',
    definition:
      'Ensemble musculaire soutenant les organes pelviens. Sa rééducation peut améliorer le plaisir.',
  },
  {
    term: 'Lactobacilles',
    category: 'Santé',
    definition: 'Bactéries dominantes de la flore vaginale, responsables du pH acide protecteur.',
  },
] as const;

const CATEGORIES = ['Anatomie', 'Matériaux', 'Technologie', 'Pratique', 'Santé'] as const;

export default function GlossairePage() {
  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    entries: GLOSSAIRE.filter((e) => e.category === cat),
  }));

  return (
    <>
      <section className="bg-ivoire-light py-12 md:py-16">
        <Container>
          <BreadcrumbNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Glossaire', href: '/glossaire' },
            ]}
            className="mb-8"
          />
          <header className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="ui-caps text-or-dark">{GLOSSAIRE.length} termes définis</p>
            <h1 className="font-display text-noir text-4xl font-medium md:text-5xl lg:text-6xl">
              Glossaire
            </h1>
            <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
            <p className="font-italic-editorial text-encre/75 text-base md:text-lg">
              Vocabulaire du bien-être intime — anatomie, matériaux, technologies, pratique, santé.
              Mises à jour à chaque nouveau guide pilier.
            </p>
          </header>
        </Container>
      </section>

      <Container className="py-14 md:py-20" width="narrow">
        {/* Nav catégories */}
        <nav aria-label="Catégories" className="mb-12 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase()}`}
              className="ui-caps border-encre/20 text-encre/70 hover:border-or hover:text-or-dark inline-flex items-center gap-2 border px-4 py-2 transition-colors"
            >
              {cat}
            </a>
          ))}
        </nav>

        {grouped.map(({ category, entries }) => (
          <section key={category} id={category.toLowerCase()} className="mb-16">
            <h2 className="font-display text-noir text-3xl font-medium">{category}</h2>
            <Fleuron variant="divider" size="sm" color="or" className="mt-3 opacity-70" />
            <dl className="divide-encre/10 border-encre/10 mt-8 divide-y border-y">
              {entries.map((e) => (
                <div
                  key={e.term}
                  className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[180px_1fr] sm:gap-6"
                >
                  <dt className="font-display text-noir text-base font-medium">{e.term}</dt>
                  <dd className="text-encre/80 text-sm md:text-base">{e.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </Container>
    </>
  );
}
