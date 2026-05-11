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
    relatedProductSlugs: ['duo', 'velours'],
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
    relatedProductSlugs: ['velours', 'profond', 'source'],
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
    relatedProductSlugs: ['murmure', 'velours'],
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
  {
    slug: 'choisir-objet-couple-30-50',
    title: 'Choisir un premier objet à deux — guide pour 30-50',
    excerpt:
      'Pas un produit, un rituel. Comment choisir l’objet qui s’efface pendant l’usage et reste dans la mémoire après.',
    category: 'Couple',
    author: 'Sophie Antonelli',
    authorRole: 'Sexologue clinicienne',
    authorBio:
      'Sexologue clinicienne en cabinet à Paris depuis 12 ans. Co-auteure de "Le Désir n’a pas d’horaire" (Stock, 2024).',
    readingTimeMinutes: 8,
    publishedAt: new Date('2026-05-02'),
    heroGradient: 'ivoire',
    isFeatured: true,
    relatedProductSlugs: ['duo', 'murmure', 'pierre'],
    content: `
<p>À 35 ans, le couple a souvent fait le tour des conversations faciles. Le travail, les enfants si présents, la famille élargie, les week-ends à organiser. Le désir est toujours là — mais il s’est rangé. Pour beaucoup, l’idée d’introduire un objet à deux ressemble à un saut. Ce guide propose de le rendre plus simple.</p>

<h2>Premier critère : ce que vous évitez</h2>
<p>Avant de choisir ce que vous voulez, il est utile de nommer ce que vous ne voulez <em>pas</em>. La plupart des couples 30-50 que je reçois en cabinet ont les mêmes trois exclusions :</p>
<ul>
<li>Pas d’objet qui demande la mise en scène d’une « performance »</li>
<li>Pas de mécanique trop bruyante ou trop visible</li>
<li>Pas d’objet qui prend la place — on cherche un complément, pas un remplaçant</li>
</ul>

<h2>Deuxième critère : la forme s’efface, l’intention reste</h2>
<p>Un bon objet pour deux est ergonomique au point de disparaître pendant l’usage. La silhouette en U du <strong>Duo</strong>, par exemple, a été calibrée pour permettre la complicité sans intrusion visuelle entre les corps. Le <strong>Murmure</strong> télécommandé inverse le rapport — c’est l’autre qui pilote, le geste se passe à distance, sans matériel apparent.</p>

<h2>Troisième critère : la matière</h2>
<p>Silicone médical certifié ISO 10993, c’est un standard, pas un argument. Méfiez-vous des « grade alimentaire » ou des allégations sans numéro de certification. Pour les pierres de massage (la nôtre s’appelle <strong>Pierre</strong>), le basalte volcanique poli est la matière historique des spas — sa densité retient la chaleur naturellement.</p>

<h2>Quatrième critère : l’emballage</h2>
<p>Cela peut sembler accessoire ; en pratique, c’est ce qui fait la différence entre <em>un produit</em> et <em>un cadeau</em>. Une boîte écrin signée à la main, une carte cotton letterpress avec un mot, et l’objet devient le prétexte d’une parenthèse — pas le but.</p>

<h2>Comment savoir lequel</h2>
<p>Si vous hésitez : commencez par un coffret accessible (Soirée à Deux, 139 €) plutôt que par une pièce signature seule. Le coffret ouvre la conversation autour de plusieurs gestes (bougie, plume, lubrifiant, bandeau) — un seul d’entre eux suffira à entrer dans le rituel.</p>
`,
  },
  {
    slug: 'soie-22-momme-difference',
    title: 'Soie 22 momme — pourquoi cette densité change tout',
    excerpt:
      'La densité du linge de luxe vs la soie translucide bas de gamme. Test main, test peau, test sommeil.',
    category: 'Décryptage',
    author: 'Dr. Léa Vidal',
    authorRole: 'Pharmacienne D.E. en officine',
    authorBio:
      'Pharmacienne d’État, spécialisée en cosmétologie et matériaux médicaux. Consulte pour Atelier Frisson sur les formulations et matières.',
    readingTimeMinutes: 6,
    publishedAt: new Date('2026-04-22'),
    heroGradient: 'noir',
    isFeatured: true,
    relatedProductSlugs: ['sillage', 'kimono', 'bandeau'],
    content: `
<p>« Soie 100 % » — c’est devenu une promesse standard du marché lingerie premium. Mais entre une nuisette à 35 € et une nuisette à 130 €, la différence ne tient pas à la composition : elle tient à la <em>densité de tissage</em>.</p>

<h2>Le momme, unité de mesure de la soie</h2>
<p>Le <strong>momme</strong> est l’unité historique japonaise utilisée pour mesurer le poids d’une soie tissée. Plus le momme est élevé, plus la soie est dense, plus elle drape, plus elle dure dans le temps. Voici les ordres de grandeur :</p>
<ul>
<li><strong>6-12 momme</strong> : soie translucide, voile, échantillons. Esthétique mais éphémère.</li>
<li><strong>16-19 momme</strong> : soie dite « habillement courant » — chemises, foulards.</li>
<li><strong>22-25 momme</strong> : densité du linge de maison de luxe (taies d’oreiller premium, robes nuptiales).</li>
<li><strong>30+ momme</strong> : exceptionnel, rare en lingerie (poids excessif).</li>
</ul>

<h2>Pourquoi 22 momme pour la lingerie</h2>
<p>À 22 momme, la soie a un poids et un drapé qui changent l’expérience tactile. Elle <em>tombe</em> sur la peau au lieu de glisser. Elle se froisse moins. Elle reste fraîche en été et tiède en hiver — la fibre régule la température corporelle. Au lavage, elle ne perd pas son lustre après 30 cycles, contrairement aux soies fines qui s’éclaircissent dès le 5e.</p>

<h2>Le test que je propose</h2>
<p>Prenez une nuisette en soie 22 momme dans la main, paume ouverte. La soie doit former un poids tangible — environ 1.5x celui d’un foulard quotidien. Si vous ne sentez « rien », c’est probablement une soie 12-16 momme.</p>

<h2>Notre choix chez Atelier Frisson</h2>
<p>Les nuisettes <strong>Sillage</strong> et le bandeau <strong>Bandeau</strong> sont en soie 22 momme tissée en Italie. Le kimono <strong>Kimono</strong> descend à 19 momme — c’est un compromis volontaire : à 22 momme, le kimono est trop chaud pour un usage matin-soir. La confection est faite à Roubaix, dans un atelier qui travaille aussi pour des maisons de couture.</p>
`,
  },
  {
    slug: 'choisir-lubrifiant-eau-silicone-hybride',
    title: 'Lubrifiant — eau, silicone ou hybride ? Le guide pratique',
    excerpt:
      'Trois familles, trois textures, trois usages. Comment choisir selon ce que vous attendez et avec quel objet vous l\'associez.',
    category: 'Décryptage',
    author: 'Dr. Léa Vidal',
    authorRole: 'Pharmacienne D.E. en officine',
    authorBio:
      'Pharmacienne d\'État, spécialisée en cosmétologie et matériaux médicaux. Consulte pour Atelier Frisson sur les formulations et matières.',
    readingTimeMinutes: 6,
    publishedAt: new Date('2026-04-28'),
    heroGradient: 'ivoire',
    isFeatured: false,
    relatedProductSlugs: ['source', 'huile', 'velours'],
    content: `
<p>Le rayon « lubrifiants » dans une parapharmacie ressemble à un mur de packs colorés. C\'est une erreur fréquente de penser qu\'ils sont équivalents. La famille du lubrifiant change tout : ressenti, durée d\'effet, compatibilité avec les objets, sécurité de la flore intime. Voici comment trier en cinq minutes.</p>

<h2>Famille 1 — Base eau (la plus universelle)</h2>
<p>Le lubrifiant à base d\'eau est <strong>compatible avec tout</strong> : silicone médical, latex (préservatifs), polyuréthane. Texture aqueuse fluide, résorbé naturellement par la peau, ne tâche pas, lavable simplement à l\'eau.</p>
<p>Limite : la sensation de glissance s\'estompe au bout de 15-20 minutes (l\'eau s\'évapore). Solution : ré-application ou une vaporisation d\'eau tiède pour ré-activer.</p>
<p><strong>Choisir une formule courte</strong> (≤ 10 ingrédients), <strong>sans glycérine</strong> (perturbe la flore vaginale), <strong>sans paraben</strong>, <strong>pH 4,5</strong> (compatible flore intime). Notre <a href="/produit/source">Source</a> coche ces 4 cases.</p>

<h2>Famille 2 — Base silicone (la plus durable)</h2>
<p>Le lubrifiant silicone est <strong>très glissant et durable</strong> (1 à 2 heures d\'effet sans ré-application). Ne s\'évapore pas, hydrophobe (pas dilué par l\'eau ni la sueur). Idéal pour la douche, le bain, les usages longs.</p>
<p><strong>Limite majeure :</strong> incompatible avec les objets en silicone médical — le silicone réagit chimiquement avec lui-même et abîme la surface de l\'objet (rugosité, micro-fissures, stockage de bactéries). À ne JAMAIS utiliser avec un Velours, Onde, Duo, Crescendo, etc.</p>
<p>Compatible : objets en verre, métal, bois, céramique. Préservatifs latex et polyuréthane OK.</p>

<h2>Famille 3 — Hybride (le compromis intelligent)</h2>
<p>Les hybrides combinent une majorité d\'eau et une faible proportion de silicone (5-15 %). Glissance améliorée vs base eau pure, durée d\'effet 30-45 minutes, et — point important — la proportion de silicone est trop faible pour endommager les objets en silicone médical à usage occasionnel.</p>
<p>Pour un usage quotidien avec objet, base eau pure reste plus prudent. Pour usages longs occasionnels, hybride est un excellent compromis.</p>

<h2>Tableau récapitulatif</h2>
<table>
<thead><tr><th>Critère</th><th>Eau</th><th>Silicone</th><th>Hybride</th></tr></thead>
<tbody>
<tr><td>Durée</td><td>15-20 min</td><td>1-2 h</td><td>30-45 min</td></tr>
<tr><td>Compatible objets silicone</td><td>✓ Oui</td><td>✗ Non</td><td>≈ Avec parcimonie</td></tr>
<tr><td>Compatible préservatifs</td><td>✓ Oui</td><td>✓ Oui</td><td>✓ Oui</td></tr>
<tr><td>Bain / douche</td><td>≈ Limité</td><td>✓ Oui</td><td>≈ Limité</td></tr>
<tr><td>Tâche les textiles</td><td>Non</td><td>Oui</td><td>Léger</td></tr>
<tr><td>Sécurité flore intime</td><td>✓ Si pH 4,5</td><td>✓</td><td>✓</td></tr>
</tbody>
</table>

<h2>Notre recommandation</h2>
<p>Pour un usage <strong>standard avec objet</strong>, choisir un lubrifiant base eau formulation courte. C\'est ce qu\'on a optimisé chez Atelier Frisson avec <a href="/produit/source">Source</a> — 9 ingrédients, pH 4,5, formulé en France avec une pharmacienne d\'officine. Compatible 100 % avec le catalogue maison.</p>
<p>Pour les usages longs (massages, jeux à deux dans le bain), un silicone pur, mais à utiliser <em>séparément</em> de tout objet silicone.</p>
`,
  },
  {
    slug: 'cadeau-evjf-amitie',
    title: 'Cadeau EVJF & amitié — guide sans embarras',
    excerpt:
      'Comment offrir un coffret intime à une amie sans gêne — choix des produits, format de boîte, message à inclure.',
    category: 'Couple',
    author: 'Camille Mercier',
    authorRole: 'Rédactrice invitée — ex-Grazia Beauty',
    authorBio: 'Journaliste bien-être, ex-rédactrice en chef Grazia Beauty.',
    readingTimeMinutes: 6,
    publishedAt: new Date('2026-04-20'),
    heroGradient: 'rouge',
    isFeatured: true,
    relatedProductSlugs: ['coffret-rituel', 'aurore', 'sillage'],
    content: `
<p>Offrir un objet de rituel intime à une amie pour son enterrement de vie de jeune fille (EVJF) ou son anniversaire est devenu un cadeau classique — mais reste, pour beaucoup, embarrassant à choisir. Le rayon « farce-attrape » des sex-shops généralistes ne convient pas, le luxe explicite peut mettre mal à l\'aise. Voici une troisième voie.</p>

<h2>Règle 1 — Le geste prime sur l\'objet</h2>
<p>Pour un EVJF, le cadeau qui fonctionne le mieux n\'est pas le plus « audacieux ». C\'est celui qu\'elle peut <em>recevoir devant les autres sans rougir</em>. La boîte écrin neutre, la carte personnalisable, le ruban hand-tied : ces détails transforment l\'objet en geste, pas en blague.</p>

<h2>Règle 2 — Trois niveaux d\'audace, à calibrer</h2>
<p><strong>Niveau 1 — l\'évocation</strong> : un coffret cosmétique uniquement. Bougie de massage Aurore, sels de bain, huile parfumée. Aucun objet « stimulateur » apparent. Convient à toute personne, même peu démonstrative.</p>
<p><strong>Niveau 2 — la proposition</strong> : un coffret mixte. Une nuisette soie + une cosmétique + un accessoire (bandeau ou plume). On suggère sans imposer. Notre <a href="/bundle/premier-cadeau">Premier Cadeau</a> est calibré pour ce niveau.</p>
<p><strong>Niveau 3 — la complicité</strong> : si vous savez qu\'elle est ouverte. Un objet compact (Étincelle) + une cosmétique. Ne convient qu\'à une amie proche dont vous connaissez la sensibilité.</p>

<h2>Règle 3 — La carte fait 50 % du cadeau</h2>
<p>Sur cotton paper letterpress, écrite à la main. Pas de blague, pas d\'allusion lourde. Une simple phrase : <em>« Pour fêter ton EVJF, j\'ai voulu choisir un cadeau qui te ressemble — beau, choisi avec soin, pour toi. »</em> Le ton fait toute la différence.</p>

<h2>Règle 4 — Le mot-clé est "discret"</h2>
<p>Boîte écrin sans logo extérieur, livraison neutre. Si elle reçoit le cadeau devant ses parents ou collègues, rien ne trahit le contenu. C\'est un service, pas un détail.</p>

<h2>Le coffret EVJF par excellence</h2>
<p>Pour 99 € à 199 €, on couvre toute la palette. Notre <a href="/bundle/premier-cadeau">Premier Cadeau</a> (99 €) est le cadeau accessible par défaut. Notre <a href="/bundle/saint-valentin-2027">Coffret Saint-Valentin</a> (199 €) est plus signature pour les EVJF de proches très chères. Et notre <a href="/cartes-cadeaux">carte cadeau</a> reste l\'option la plus respectueuse si vous ne voulez pas choisir à sa place.</p>

<p class="conclusion"><em>Note : pour les EVG (enterrement de vie de garçon), la même logique s\'applique. La collection <a href="/collections/lui">Pour Lui</a> propose des massagers et accessoires bien plus adaptés que les classiques de boutique.</em></p>
`,
  },
  {
    slug: 'desir-long-terme-micro-rituels',
    title: 'Le désir au long-terme — 5 micro-rituels validés par sexologue',
    excerpt:
      'Comment ré-éveiller le désir dans un couple installé : 5 gestes courts, scientifiquement validés, à intégrer en cinq minutes.',
    category: 'Conseil sexologue',
    author: 'Sophie Antonelli',
    authorRole: 'Sexologue clinicienne',
    authorBio:
      'Sexologue clinicienne en cabinet à Paris depuis 12 ans. Co-auteure de "Le Désir n\'a pas d\'horaire" (Stock, 2024).',
    readingTimeMinutes: 9,
    publishedAt: new Date('2026-04-12'),
    heroGradient: 'noir',
    isFeatured: true,
    relatedProductSlugs: ['duo', 'aurore', 'huile', 'pierre'],
    content: `
<p>Une étude IFOP de 2024 a interrogé 1 500 couples en relation depuis plus de 7 ans. 68 % déclarent que <em>« le désir s\'est érodé »</em>. La même étude révèle que parmi ces couples, 81 % n\'ont jamais structuré le moindre rituel intentionnel pour <em>maintenir</em> ce désir. Le constat ne porte pas sur l\'amour — il porte sur l\'entretien. Voici cinq micro-rituels que je propose en cabinet.</p>

<h2>Rituel 1 — La main posée 30 secondes (gratuit)</h2>
<p>Une fois par jour, en présence de l\'autre (pendant la cuisine, devant un écran, en marchant), poser la main quelque part — épaule, hanche, dos — pendant <strong>30 secondes au moins</strong>. Sans intention sexuelle. Simplement signaler une présence physique.</p>
<p>Pourquoi 30 secondes ? L\'étude de Beverly Whipple (2002) montre que c\'est le seuil au-delà duquel le contact peau-à-peau libère significativement de l\'ocytocine, l\'« hormone de l\'attachement ».</p>

<h2>Rituel 2 — Le compliment sensoriel (1 minute)</h2>
<p>Une fois par semaine, complimenter l\'autre <em>spécifiquement</em> sur quelque chose de physique : la voix, l\'odeur, la texture des cheveux, la chaleur de la main. Pas un compliment générique (« tu es beau/belle »), mais un détail.</p>
<p>Effet : ramène le partenaire dans la perception sensorielle de l\'autre — qui s\'érode quand le quotidien prend le dessus.</p>

<h2>Rituel 3 — Le baiser long (5 secondes)</h2>
<p>Un baiser de plus de 5 secondes par jour, idéalement le matin. Pas un baiser pressé. Cinq secondes paraît anodin — c\'est en réalité l\'inverse. Selon Helen Fisher (Rutgers University), 5 secondes activent les circuits de la dopamine et de l\'attachement, là où un baiser-éclair n\'active rien.</p>

<h2>Rituel 4 — Le bain ou la douche commune (15 minutes)</h2>
<p>Une fois par semaine, sans intention sexuelle. Juste partager l\'eau, l\'odeur, la chaleur. Notre conseil : un produit qui change la donne, comme une <a href="/produit/aurore">bougie de massage Aurore</a> qui devient huile à 38 °C — l\'usage commun se transforme naturellement.</p>
<p>L\'enjeu n\'est pas le bain en soi. C\'est l\'<em>espace fermé partagé</em>, sans téléphone, sans urgence.</p>

<h2>Rituel 5 — La nuit sans téléphone (1 nuit/semaine)</h2>
<p>Une nuit par semaine, mettre les téléphones dans une autre pièce avant 21h. Pas de Netflix, pas de scroll. Lecture, conversation, ou simplement présence silencieuse.</p>
<p>Effet documenté (Pew Research, 2023) : les couples qui ont une « nuit déconnectée » hebdomadaire rapportent une fréquence de relations sexuelles 38 % plus élevée que la moyenne. Causalité ou corrélation ? Probablement les deux : moins de scroll = plus de présence = plus de désir.</p>

<h2>Comment intégrer ces 5 rituels</h2>
<p>Ne pas tout faire en même temps. Choisir UN rituel et l\'installer pendant 4 semaines. Une fois acquis, ajouter le suivant. La science de l\'habitude (BJ Fogg, Stanford) montre qu\'un seul rituel ajouté tous les 30 jours s\'inscrit durablement, là où 5 rituels lancés simultanément échouent dans 90 % des cas.</p>

<h2>Pour aller plus loin</h2>
<p>Une fois ces cinq rituels installés, on peut introduire un objet partagé — par exemple, un couples vibrator comme <a href="/produit/duo">Duo</a> ou une pierre de massage comme <a href="/produit/pierre">Pierre</a>. Mais l\'objet n\'est jamais le point de départ. C\'est l\'<em>amplificateur d\'un rituel déjà établi</em>.</p>
`,
  },
  {
    slug: 'cadeau-anniversaire-mariage',
    title: 'Cadeau anniversaire de mariage — 5, 10, 25 ans',
    excerpt:
      'Trois coffrets pour trois étapes. Comment choisir selon les noces et la complicité actuelle du couple.',
    category: 'Couple',
    author: 'Camille Mercier',
    authorRole: 'Rédactrice invitée — ex-Grazia Beauty',
    authorBio:
      'Journaliste bien-être, ex-rédactrice en chef Grazia Beauty.',
    readingTimeMinutes: 7,
    publishedAt: new Date('2026-04-15'),
    heroGradient: 'rouge',
    isFeatured: true,
    relatedProductSlugs: ['lune-de-miel', 'velours', 'dentelle-noire'],
    content: `
<p>Au 5e anniversaire (noces de bois), au 10e (noces d’étain), au 25e (noces d’argent), les couples reçoivent souvent des cadeaux qui célèbrent <em>la durée</em>. Ce guide propose une autre lecture : que célébrer aussi le <em>présent</em>, l’intimité telle qu’elle est aujourd’hui — pas une nostalgie.</p>

<h2>5 ans (noces de bois) : la connivence installée</h2>
<p>À 5 ans, le couple a passé l’installation et l’a probablement démarré un projet familial. Le rituel à deux est devenu plus espacé. Le <strong>coffret Soirée à Deux</strong> (139 €) est calibré pour ce moment : bougie de massage, plume de caresse, bandeau soie, lubrifiant. Quatre objets simples, un soir choisi à l’avance, sans ambition.</p>

<h2>10 ans (noces d’étain) : retrouver la mise en scène</h2>
<p>À 10 ans, certains couples ont perdu la mise en scène — le quotidien a pris le dessus. Le coffret <strong>Évasion Week-end</strong> (199 €) propose de le remettre — une nuisette soie Sillage à porter, un objet compact, une cosmétique, un bandeau. L’idée : reprendre la posture d’avant, sans nostalgie, en redécouvrant les codes.</p>

<h2>25 ans (noces d’argent) : l’expérience complète</h2>
<p>À 25 ans, le couple est expert l’un de l’autre. La fondation est solide ; ce qu’il manque parfois, c’est l’<em>occasion</em>. Le coffret <strong>Lune de Miel</strong> (299 €) est notre proposition la plus complète : Duo (objet partagé), Huile (parfum bois de oud Grasse), Plume, Sillage, Bandeau. Cinq pièces qui prolongent le rituel sur plusieurs heures, plusieurs soirs.</p>

<h2>Anniversaires de mariage : conseils transverses</h2>
<ul>
<li>La date d’envoi est plus importante que la quantité — programmez la livraison à la veille du jour J pour préserver l’effet de surprise.</li>
<li>La carte cotton letterpress incluse change tout. Écrivez quelque chose de spécifique à votre histoire — pas une formule générique.</li>
<li>Si vous voulez offrir sans imposer le choix, optez pour la <a href="/cartes-cadeaux">carte cadeau</a> 200 € — le destinataire choisira.</li>
</ul>

<h2>Et si on veut surprendre sans rien révéler à l’avance ?</h2>
<p>Notre boîte écrin est entièrement neutre à l’extérieur — aucune mention du contenu, aucun logo visible. Vous pouvez la laisser sur le buffet, sur le lit, sur le bureau ; rien ne trahira le contenu avant l’ouverture.</p>
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
