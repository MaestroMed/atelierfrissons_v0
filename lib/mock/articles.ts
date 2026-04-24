/**
 * Mock articles éditoriaux Rituels — Sprint 6.
 * Sera remplacé par lecture MDX depuis content/rituels/*.mdx + DB articles
 * en Sprint 7 (CMS TipTap admin).
 */

export interface MockArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Bien-être' | 'Couple' | 'Décryptage' | 'Conseil sexologue' | 'Portrait';
  author: string;
  authorRole: string;
  authorBio?: string;
  readingTimeMinutes: number;
  publishedAt: Date;
  heroGradient: 'ivoire' | 'rouge' | 'noir';
  /** Contenu HTML (simple — Sprint 7 : MDX compilé). */
  content: string;
  isFeatured: boolean;
  relatedProductSlugs: readonly string[];
}

export const MOCK_ARTICLES: readonly MockArticle[] = [
  {
    slug: 'pouvoir-rituel-lent',
    title: 'Pourquoi on sous-estime le pouvoir d’un rituel lent',
    excerpt:
      'Dans une époque qui célèbre la vitesse, ralentir devient un acte radical de soin et d’écoute.',
    category: 'Bien-être',
    author: 'Camille Mercier',
    authorRole: 'Rédactrice invitée — ex-Grazia Beauty',
    authorBio: 'Journaliste bien-être, ex-rédactrice en chef Grazia Beauty.',
    readingTimeMinutes: 7,
    publishedAt: new Date('2026-04-10'),
    heroGradient: 'ivoire',
    isFeatured: true,
    relatedProductSlugs: ['premier-frisson', 'velours-rouge'],
    content: `
<p>Il est huit heures. La journée vient de se terminer, pourtant elle n’a pas vraiment existé — un enchaînement d’urgences, d’alertes, de visages en réunion. Vous rentrez chez vous et vous vous dites : <em>« Ce soir, je prends mon temps. »</em> Mais cinq minutes plus tard, vous êtes déjà à l’écran, à scroller machinalement.</p>

<h2>Le paradoxe de la vitesse</h2>
<p>Selon une étude de la <a href="https://hbr.org/" target="_blank" rel="noopener noreferrer">Harvard Business Review</a> publiée en 2024, 63 % des cadres français se sentent <em>« constamment pressés »</em>. Et pourtant, parmi eux, 71 % déclarent qu’aucune des urgences traitées dans la journée n’était <em>réellement</em> urgente. La vitesse, dans nos vies, est devenue une habitude — pas une nécessité.</p>

<h2>Qu’est-ce qu’un rituel lent ?</h2>
<p>Un rituel lent n’est pas une routine. Une routine se déroule mécaniquement, sans conscience. Un rituel lent, lui, est une suite de gestes choisis, qui ralentissent volontairement le tempo de la journée.</p>
<p>Cela peut être une infusion préparée pendant huit minutes au lieu de trois. Une douche tiède, sans téléphone, suivie d’un massage à l’huile végétale. Cinq minutes de respiration consciente avant de s’endormir.</p>

<h2>Pourquoi ça change quelque chose</h2>
<p>Une étude publiée dans le <em>Journal of Behavioral Medicine</em> en 2023 a démontré qu’une exposition régulière à des « micro-rituels » (3 à 8 minutes par jour) réduit le cortisol salivaire de 12 % en moyenne sur six semaines. Ce n’est pas spectaculaire — c’est patient.</p>
<p>Et c’est là, peut-être, la leçon la plus importante : ralentir ne change pas ce qui est urgent. Ralentir change <em>la façon dont nous tenons</em> ce qui est urgent.</p>

<h2>Pour aller plus loin</h2>
<p>Chez Atelier Frisson, nous pensons qu’un objet bien choisi peut devenir l’ancre d’un rituel. Pas un accessoire à utiliser — un repère sensoriel autour duquel construire une parenthèse.</p>
`,
  },
  {
    slug: 'silicone-medical-le-test',
    title: 'Silicone médical vs silicone classique — le test',
    excerpt:
      'Pourquoi la norme ISO 10993 fait toute la différence — analyse, comparatif, et recommandations.',
    category: 'Décryptage',
    author: 'Dr. Léa Vidal',
    authorRole: 'Pharmacienne D.E. en officine',
    authorBio:
      'Pharmacienne d’État, spécialisée en cosmétologie et matériaux médicaux. Consulte pour Atelier Frisson sur les formulations et matières.',
    readingTimeMinutes: 6,
    publishedAt: new Date('2026-04-05'),
    heroGradient: 'noir',
    isFeatured: true,
    relatedProductSlugs: ['premier-frisson', 'noir-profond', 'rituel-du-matin-lubrifiant'],
    content: `
<p>« Silicone médical » — c’est devenu un argument marketing standard dans le secteur du wellness intime. Mais que signifie réellement cette appellation ? Existe-t-il une différence concrète, mesurable, entre un silicone dit médical et un silicone industriel classique ?</p>

<h2>La norme ISO 10993 — le critère de référence</h2>
<p>La norme internationale <strong>ISO 10993</strong> définit l’évaluation biologique des dispositifs médicaux. Pour qu’un silicone soit qualifié de « médical », il doit passer une batterie de tests : cytotoxicité, sensibilisation, irritation, génotoxicité, implantation, hémocompatibilité.</p>
<p>Concrètement : on prend des cellules humaines en culture, on les expose au silicone pendant 24 à 72 heures, et on mesure leur taux de survie. Pour passer l’ISO 10993, le taux doit dépasser 70 %.</p>

<h2>Ce que ça change pour la peau</h2>
<p>La muqueuse vaginale est l’une des plus perméables du corps humain. Elle absorbe environ 30 % plus rapidement que la peau du dos. Cette spécificité explique pourquoi le choix de la matière est <em>critique</em> dans le secteur intime.</p>
<p>Un silicone industriel non certifié peut contenir des phthalates plastifiants, du bisphénol A résiduel, ou des additifs colorants instables. Aucun de ces composés n’est anodin sur le long terme.</p>

<h2>Comment reconnaître un vrai silicone médical</h2>
<ul>
<li>Demandez le numéro de certification ISO 10993 du fabricant</li>
<li>La fiche technique doit mentionner la classe (IIa minimum pour usage prolongé)</li>
<li>Méfiez-vous des allégations « grade alimentaire » — c’est un standard moins strict</li>
<li>Le silicone médical est généralement sans odeur ni goût ; un parfum ajouté est suspect</li>
</ul>

<h2>Notre engagement</h2>
<p>Tous les objets Atelier Frisson sont en silicone médical certifié ISO 10993, classe IIa. Les certificats sont disponibles sur simple demande à <a href="mailto:contact@atelierfrisson.fr">contact@atelierfrisson.fr</a>.</p>
`,
  },
  {
    slug: 'communication-intime-couple',
    title: 'Parler de ses envies — 7 phrases pour démarrer',
    excerpt:
      'Un guide pratique, sans injonction, pour oser la conversation la plus intime du quotidien.',
    category: 'Couple',
    author: 'Sophie Antonelli',
    authorRole: 'Sexologue clinicienne',
    authorBio:
      'Sexologue clinicienne en cabinet à Paris depuis 12 ans. Co-auteure de "Le Désir n’a pas d’horaire" (Stock, 2024).',
    readingTimeMinutes: 8,
    publishedAt: new Date('2026-03-28'),
    heroGradient: 'rouge',
    isFeatured: true,
    relatedProductSlugs: ['laque-minuit', 'velours-rouge'],
    content: `
<p>Selon une étude IFOP de 2025, 67 % des couples français déclarent ne <em>jamais</em> parler explicitement de leurs envies sexuelles avec leur partenaire. Pas parce qu’ils n’en ont pas — parce qu’ils ne savent pas comment commencer.</p>

<h2>Pourquoi c’est si difficile</h2>
<p>La conversation autour du désir convoque trois peurs simultanées : la peur du jugement, la peur de blesser l’autre, la peur de découvrir un décalage. C’est beaucoup pour une seule discussion.</p>

<h2>Sept phrases pour démarrer</h2>
<p>Voici sept phrases que je propose à mes patient·e·s en consultation. Aucune n’est magique — toutes sont conçues pour ouvrir la conversation sans la fermer.</p>

<ol>
<li>« Il y a quelque chose que j’ai envie d’essayer — est-ce que tu serais d’accord pour qu’on en parle ce week-end ? »</li>
<li>« Quand on fait l’amour le dimanche matin, je trouve qu’on est plus présents qu’en semaine. Tu le ressens aussi ? »</li>
<li>« J’aimerais qu’on prenne plus de temps avant. Pas plus longtemps — juste plus de présence. »</li>
<li>« Est-ce qu’il y a un geste que tu aimerais que je fasse plus souvent ? »</li>
<li>« Il y a un livre / un podcast qui m’a fait réfléchir à notre vie intime. Tu veux que je te le partage ? »</li>
<li>« Je me rends compte que je n’ose pas te dire quand quelque chose me plaît — ça fait écho chez toi ? »</li>
<li>« Et si on inventait un rituel à nous, juste à nous, qui n’appartient à personne d’autre ? »</li>
</ol>

<h2>L’importance du moment</h2>
<p>Aucune de ces conversations ne devrait avoir lieu juste avant ou juste après un rapport. Le contexte le plus efficace, paradoxalement, est le plus banal : pendant la vaisselle, en marchant, dans la voiture. Quand le corps est occupé à autre chose, l’esprit s’ouvre plus librement.</p>

<h2>Et si l’autre ne répond pas tout de suite ?</h2>
<p>C’est même probable. Les conversations intimes se déroulent souvent en deux temps : l’ouverture (vous), puis la maturation (l’autre, sur quelques heures ou quelques jours). Ne forcez pas la réponse — laissez-la venir.</p>
`,
  },
] as const;

export function getMockArticles(): readonly MockArticle[] {
  return MOCK_ARTICLES;
}

export function getMockArticleBySlug(slug: string): MockArticle | null {
  return MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function getMockArticlesByCategory(
  category: MockArticle['category'],
): readonly MockArticle[] {
  return MOCK_ARTICLES.filter((a) => a.category === category);
}

export function getMockFeaturedArticles(limit = 3): readonly MockArticle[] {
  return MOCK_ARTICLES.filter((a) => a.isFeatured).slice(0, limit);
}

// ── Guides piliers ────────────────────────────────────────────────────────

export interface MockGuide {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  readingTimeMinutes: number;
  publishedAt: Date;
  /** Sections H2 à afficher dans la table of contents. */
  sections: readonly { id: string; title: string }[];
  content: string;
}

export const MOCK_GUIDES: readonly MockGuide[] = [
  {
    slug: 'premier-stimulateur-guide-complet',
    title: 'Premier Stimulateur — guide complet',
    excerpt:
      'Comment choisir son premier objet de bien-être intime : anatomie, matières, ergonomie, budget.',
    author: 'Dr. Léa Vidal & Sophie Antonelli',
    authorRole: 'Pharmacienne D.E. + Sexologue clinicienne',
    readingTimeMinutes: 18,
    publishedAt: new Date('2026-03-15'),
    sections: [
      { id: 'anatomie', title: 'Anatomie — comprendre avant de choisir' },
      { id: 'types', title: 'Les 4 grands types d’objets' },
      { id: 'criteres', title: 'Critères de choix' },
      { id: 'silicone', title: 'Silicone médical : pourquoi c’est non-négociable' },
      { id: 'taille-forme', title: 'Taille et forme — l’ergonomie d’abord' },
      { id: 'budget', title: 'Budget : combien investir pour la première fois' },
      { id: 'entretien', title: 'Entretien et durée de vie' },
      { id: 'faq', title: 'Questions fréquentes' },
    ],
    content: `
<p>Choisir son premier objet de bien-être intime est rarement une décision spontanée. C’est souvent un cheminement de plusieurs semaines, ponctué de recherches, de doutes, et parfois d’une certaine gêne. Ce guide a été écrit pour vous accompagner dans cette démarche, sans jargon ni injonction.</p>

<h2 id="anatomie">Anatomie — comprendre avant de choisir</h2>
<p>Avant de parler d’objets, parlons de ce qu’ils sont censés accompagner. L’anatomie féminine est complexe — bien plus que ce qu’on enseigne dans les manuels scolaires. Le clitoris, par exemple, est un organe interne et externe dont seule la pointe est visible : sa structure complète mesure 9 à 11 cm, ramifiée comme un Y.</p>
<p>Cette donnée a une conséquence pratique : la stimulation peut venir de l’extérieur (vulve, clitoris externe), de l’intérieur (paroi vaginale antérieure, point de Gräfenberg), ou des deux simultanément.</p>

<h2 id="types">Les 4 grands types d’objets</h2>
<ol>
<li><strong>Stimulateurs externes (vibromasseurs clitoridiens)</strong> — concentrent la stimulation sur la vulve et le clitoris externe. Idéals pour débuter, peu intrusifs.</li>
<li><strong>Stimulateurs internes (vibromasseurs vaginaux)</strong> — pour la pénétration et la stimulation interne. Choix de longueur et de courbure crucial.</li>
<li><strong>Double action (rabbit, double-end)</strong> — combinent stimulation externe et interne. Plus complexes, plus puissants.</li>
<li><strong>Ondes pulsées (air pulse)</strong> — technologie récente, créent une sensation d’aspiration douce sans contact direct.</li>
</ol>

<h2 id="criteres">Critères de choix</h2>
<p>Quatre critères dominent la décision : la matière (silicone médical impératif), le bruit (moins de 50 dB pour la discrétion), l’ergonomie (forme adaptée à votre morphologie), et l’étanchéité (IPX7 minimum pour un nettoyage facile).</p>

<h2 id="silicone">Silicone médical : pourquoi c’est non-négociable</h2>
<p>La norme ISO 10993 garantit l’absence de phthalates, de BPA, et la biocompatibilité. Voir notre <a href="/rituels/silicone-medical-le-test">test détaillé</a>.</p>

<h2 id="taille-forme">Taille et forme — l’ergonomie d’abord</h2>
<p>Pour un premier objet, la règle d’or est <em>« moins is more »</em>. Diamètre 3 à 3,5 cm maximum, longueur 14 à 18 cm. Une légère courbure est préférable à une forme rectiligne (anatomiquement plus juste).</p>

<h2 id="budget">Budget : combien investir pour la première fois</h2>
<p>En dessous de 50 €, on trouve essentiellement des objets en plastique ABS ou silicone non-certifié — à éviter. La fourchette 70-130 € est le sweet spot pour un premier objet sérieux. Au-delà de 200 €, on entre dans le très haut de gamme (motorisations multiples, connectivité, matériaux précieux).</p>

<h2 id="entretien">Entretien et durée de vie</h2>
<p>Au savon doux + eau tiède (≤ 40°C) avant et après chaque usage. Séchage à l’air libre. Trempage 5 min dans une solution antibactérienne sans alcool une fois par mois. Un objet entretenu dure 3 à 5 ans en moyenne, parfois plus.</p>

<h2 id="faq">Questions fréquentes</h2>
<p><strong>Le bruit dérangera-t-il mes voisins ?</strong> Avec un objet sous 50 dB et une isolation murale standard, non. Pour comparaison : 50 dB = conversation à voix basse.</p>
<p><strong>Mon partenaire va-t-il se sentir remplacé ?</strong> Question récurrente. La réponse : un objet n’est pas un substitut, c’est un complément. Lire notre article <a href="/rituels/communication-intime-couple">Parler de ses envies</a>.</p>
<p><strong>Comment voyager avec ?</strong> Désactivez la batterie via le mode lock (longue pression sur le bouton +). Glissez dans l’étui de voyage. Sécurisé en bagage cabine.</p>
`,
  },
] as const;

export function getMockGuides(): readonly MockGuide[] {
  return MOCK_GUIDES;
}

export function getMockGuideBySlug(slug: string): MockGuide | null {
  return MOCK_GUIDES.find((g) => g.slug === slug) ?? null;
}
