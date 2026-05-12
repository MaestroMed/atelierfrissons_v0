/**
 * Manifest des visuels Atelier Frisson — générés via Higgsfield (mai 2026).
 *
 * Sources de vérité :
 *   - Prompts : `docs/IMAGE_PROMPTS_SITE.md` (20 prompts) + `docs/IMAGE_PROMPTS_PRODUCTS.md` (100).
 *   - Modèle image : `nano_banana_2` (Google Nano Banana Pro), résolution 4k.
 *   - Modèle vidéo : `seedance_2_0` (Bytedance Seedance 2.0), 1080p Hero / 720p produits.
 *   - CDN transitoire : d8j0ntlcm91z4.cloudfront.net (Higgsfield workspace privé).
 *
 * Pour le Sprint 7 : migration vers Supabase Storage (images) + Mux (vidéos)
 * avec download depuis CloudFront, optimisation AVIF, et signed URLs.
 *
 * Statut V1 : URLs CloudFront en direct via next/image (remotePatterns whitelistés
 * dans next.config.ts).
 *
 * Cohérence visuelle : les Vue 1 (Hero e-com) ont été générées d'abord, les
 * Vues 2-5 ensuite. Les vidéos utilisent les Vue 1 comme start_image (seedance_2_0
 * reference-driven). Cohérence d'identité produit garantie.
 */

import { resolveUrl } from './atelier-frisson-urls.generated';

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_30snwzR54CQATL3QY902XlmIw9r';

/**
 * Helper : construit l'URL CloudFront image à partir du job_id et du timestamp.
 * Pattern observé : `hf_{YYYYMMDD}_{HHMMSS}_{jobId}.png`
 */
function cdnUrl(timestamp: string, jobId: string): string {
  return `${CDN}/hf_${timestamp}_${jobId}.png`;
}

/**
 * Helper : construit l'URL CloudFront vidéo (MP4) à partir du job_id et du timestamp.
 * Pattern observé : `hf_{YYYYMMDD}_{HHMMSS}_{jobId}.mp4`
 */
function cdnVideoUrl(timestamp: string, jobId: string): string {
  return `${CDN}/hf_${timestamp}_${jobId}.mp4`;
}

/**
 * Résout l'URL d'un `VisualAsset` :
 *   1. Si `asset.url` est hardcodée → on l'utilise directement.
 *   2. Sinon → on tente `URL_MAP[jobId]` (mapping généré, mis à jour à chaque sync).
 *   3. Sinon → `null` (caller doit gérer le fallback : silhouette / poster).
 */
function resolveAssetUrl(asset: VisualAsset | VideoAsset): string | null {
  return asset.url ?? resolveUrl(asset.jobId);
}

export interface VisualAsset {
  /** Job ID Higgsfield (réf future si on doit relancer ou consulter via API) */
  readonly jobId: string;
  /** URL CloudFront — null si la génération n'est pas encore complétée */
  readonly url: string | null;
  /** Alt text descriptif WCAG-conforme */
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * HEROS SITE — 8 visuels marketing principaux
 * ──────────────────────────────────────────────────────────────────────────── */

export const HEROS = {
  /** Hero homepage panneau central (Pour Vous Deux) — couple ivory silk + oxblood */
  pourVousDeux: {
    jobId: 'f0952084-16d2-4068-bc28-d4abd290310a',
    url: cdnUrl('20260512_101421', 'f0952084-16d2-4068-bc28-d4abd290310a'),
    alt: 'Deux mains entrelacées sur un drap de soie ivoire dans la lumière du matin parisien',
    width: 5504,
    height: 3072,
  },
  /** Hero Pour Elle — taie d'oreiller + collier de perles + flacon oxblood */
  pourElle: {
    jobId: '02940112-634e-442a-a294-5ae18b99333c',
    url: null, // génération en cours au moment du build du manifest
    alt: 'Taie d\'oreiller ivoire, collier de perles et flacon oxblood au matin',
    width: 3712,
    height: 4608,
  },
  /** Hero Pour Lui — drap sage, montre + livre + objet oxblood, ambiance tungstène */
  pourLui: {
    jobId: '222fa765-8707-4479-8878-19522cb41b9f',
    url: cdnUrl('20260512_101429', '222fa765-8707-4479-8878-19522cb41b9f'),
    alt: 'Montre, livre relié cognac et objet oxblood sur drap sage dans la lumière du soir',
    width: 3712,
    height: 4608,
  },
  /** Hero Cadeaux — 3 boîtes cadeaux empilées + rose séchée + cire AF */
  cadeaux: {
    jobId: '632a0175-13d1-461e-ae3d-4ad80262ddfa',
    url: cdnUrl('20260512_101433', '632a0175-13d1-461e-ae3d-4ad80262ddfa'),
    alt: 'Trois coffrets cadeaux gradués sur lin ivoire avec rose séchée et cachet de cire AF',
    width: 5504,
    height: 3072,
  },
  /** Hero Box Mensuelle "Rituel Frisson" — boîte ivoire entrouverte + note manuscrite */
  boxMensuelle: {
    jobId: '46291953-4e62-4da5-8d0c-b35a355a41e4',
    url: cdnUrl('20260512_101437', '46291953-4e62-4da5-8d0c-b35a355a41e4'),
    alt: 'Coffret abonnement mensuel Rituel n°4 entrouvert sur travertin avec note manuscrite',
    width: 5056,
    height: 3392,
  },
  /** Hero Bundles "Coffrets composés" — 3 objets en composition triangulaire */
  bundles: {
    jobId: '430e97ec-e4d4-4648-9f8c-fe429b894de3',
    url: cdnUrl('20260512_101440', '430e97ec-e4d4-4648-9f8c-fe429b894de3'),
    alt: 'Trois objets sculpturaux en composition triangulaire sur satin ivoire',
    width: 5504,
    height: 3072,
  },
  /** Hero L'Atelier — intérieur Haussmann avec table de travail artisan */
  atelier: {
    jobId: '0872ba8d-5635-400e-b4c3-063db35bd0b2',
    url: null,
    alt: 'Atelier parisien Haussmannien avec table de travail en marbre et tabouret Thonet',
    width: 5504,
    height: 3072,
  },
  /** Hero Le Rituel — cinemascope 21:9 blue-hour bedroom (référence vidéo Hero master) */
  rituelCinematic: {
    jobId: 'c58024cd-99e5-462c-8de0-3f02d72e318a',
    url: cdnUrl('20260512_101448', 'c58024cd-99e5-462c-8de0-3f02d72e318a'),
    alt: 'Intérieur de chambre à coucher à l\'heure bleue, lampe en bronze et objet oxblood sur l\'oreiller',
    width: 6336,
    height: 2688,
  },
} as const satisfies Record<string, VisualAsset>;

/* ─────────────────────────────────────────────────────────────────────────────
 * COVERS ÉDITORIAL — Articles + textures + utilitaires
 * ──────────────────────────────────────────────────────────────────────────── */

export const COVERS = {
  /** Article "Rituel du matin pour deux" 4:3 */
  articleMatin: {
    jobId: '2661d457-6054-40ac-839a-696e722ff2aa',
    url: cdnUrl('20260512_101522', '2661d457-6054-40ac-839a-696e722ff2aa'),
    alt: 'Deux tasses d\'espresso, carnet ouvert et lunettes sur draps ivoire au matin',
    width: 4800,
    height: 3584,
  },
  /** Article "Le rituel du soir, en silence" 4:3 */
  articleSoir: {
    jobId: '37898a0b-6c27-4481-a87e-bd6eecd07a73',
    url: cdnUrl('20260512_101525', '37898a0b-6c27-4481-a87e-bd6eecd07a73'),
    alt: 'Bougie allumée au bord d\'une baignoire en marbre, ambiance Aesop Marrakech',
    width: 4800,
    height: 3584,
  },
  /** Article "L'art du cadeau-surprise" 4:3 */
  articleCadeau: {
    jobId: 'af2a5c23-17ed-4d2e-ba12-41080fd8d305',
    url: cdnUrl('20260512_101529', 'af2a5c23-17ed-4d2e-ba12-41080fd8d305'),
    alt: 'Atelier d\'emballage cadeau avec ruban or, stylo plume et cachet de cire',
    width: 4800,
    height: 3584,
  },
} as const satisfies Record<string, VisualAsset>;

export const TEXTURES = {
  /** Macro silk 21:9 — section divider */
  silk: {
    jobId: 'bbc72595-f22f-4bbb-a938-843f7dab48f3',
    url: cdnUrl('20260512_101532', 'bbc72595-f22f-4bbb-a938-843f7dab48f3'),
    alt: 'Texture macro de soie satin ivoire',
    width: 6336,
    height: 2688,
  },
  /** Macro lacquer 21:9 — section divider rouge */
  lacquer: {
    jobId: '43a206de-bafb-4b47-b4f2-93398ff1c6f8',
    url: cdnUrl('20260512_101536', '43a206de-bafb-4b47-b4f2-93398ff1c6f8'),
    alt: 'Texture macro de laque oxblood polie miroir',
    width: 6336,
    height: 2688,
  },
  /** Monogramme AF embossé or 16:9 — détail signature */
  monogram: {
    jobId: '89be7916-1d90-4888-b44d-c508d6fe9025',
    url: cdnUrl('20260512_101539', '89be7916-1d90-4888-b44d-c508d6fe9025'),
    alt: 'Monogramme AF embossé en or champagne sur papier coton crème',
    width: 5504,
    height: 3072,
  },
} as const satisfies Record<string, VisualAsset>;

export const UTILITY = {
  /** Newsletter "La Correspondance" — lettre + plume + cachet 16:9 */
  newsletter: {
    jobId: '652e8f48-409b-437c-a52f-d177771aafce',
    url: cdnUrl('20260512_101542', '652e8f48-409b-437c-a52f-d177771aafce'),
    alt: 'Lettre manuscrite, stylo plume oxblood et enveloppe cachetée AF',
    width: 5504,
    height: 3072,
  },
  /** Panier vide — pochette soie ivoire 16:9 */
  cartEmpty: {
    jobId: '1f90c650-7450-433f-9cd7-dc0c6ea76725',
    url: cdnUrl('20260512_101545', '1f90c650-7450-433f-9cd7-dc0c6ea76725'),
    alt: 'Pochette de soie ivoire vide sur lin crème',
    width: 5504,
    height: 3072,
  },
  /** Confirmation commande — cachet de cire AF 16:9 */
  orderSuccess: {
    jobId: '23f30c53-5d55-4078-858a-28c3f7b10b88',
    url: null,
    alt: 'Cachet de cire oxblood intaglio "AF" sur enveloppe coton ivoire',
    width: 5504,
    height: 3072,
  },
  /** Page 404 — bougie qui s'éteint 16:9 */
  notFound: {
    jobId: 'a617ec18-c71c-4bef-ae2b-55ba90e08fd8',
    url: cdnUrl('20260512_101551', 'a617ec18-c71c-4bef-ae2b-55ba90e08fd8'),
    alt: 'Bougie nearly extinguished, fumée contre mur encre profond',
    width: 5504,
    height: 3072,
  },
  /** Open Graph image 16:9 (2k) — share template */
  openGraph: {
    jobId: 'd3638a3e-8ad7-476e-847c-eadd585e17f2',
    url: cdnUrl('20260512_101555', 'd3638a3e-8ad7-476e-847c-eadd585e17f2'),
    alt: 'Objet sculptural ivoire abstrait sur travertin avec drape lin',
    width: 2752,
    height: 1536,
  },
  /** Pinterest pin 2:3 — coffret cadeau vertical */
  pinterestPin: {
    jobId: '9e4d437c-8313-4ce8-91e0-96316fb4f0db',
    url: cdnUrl('20260512_101558', '9e4d437c-8313-4ce8-91e0-96316fb4f0db'),
    alt: 'Coffret cadeau ouvert avec papier de soie champagne et hortensia',
    width: 3392,
    height: 5056,
  },
} as const satisfies Record<string, VisualAsset>;

/* ─────────────────────────────────────────────────────────────────────────────
 * PRODUITS — 10 produits × 5 vues
 *
 * Vues standardisées par produit :
 *   - hero    (Vue 1) — fiche principale, ratio 4:5
 *   - angle   (Vue 2) — 3/4 angle, ratio 1:1
 *   - detail  (Vue 3) — macro matière, ratio 1:1
 *   - packaging (Vue 4) — coffret, ratio 4:5
 *   - lifestyle (Vue 5) — mise en scène, ratio 4:5
 * ──────────────────────────────────────────────────────────────────────────── */

export interface ProductVisuals {
  readonly hero: VisualAsset;
  readonly angle: VisualAsset;
  readonly detail: VisualAsset;
  readonly packaging: VisualAsset;
  readonly lifestyle: VisualAsset;
}

export const PRODUCTS = {
  /** DUO — Stimulateur couple (forme U) — ivoire signature */
  duo: {
    hero: {
      jobId: '034c484f-a7ab-42e4-ad34-b614a6fe0954',
      url: cdnUrl('20260512_101624', '034c484f-a7ab-42e4-ad34-b614a6fe0954'),
      alt: 'DUO — objet de rituel couple en silicone médical ivoire, anneau or champagne',
      width: 3712,
      height: 4608,
    },
    angle: {
      jobId: 'a1ddbac9-db2e-4840-8ba7-854802a61b82',
      url: cdnUrl('20260512_101812', 'a1ddbac9-db2e-4840-8ba7-854802a61b82'),
      alt: 'DUO — vue 3/4 sur travertin crème',
      width: 4096,
      height: 4096,
    },
    detail: { jobId: 'b8553fee-e4ac-4f80-8769-2e38030cadd6', url: null, alt: 'DUO — macro silicone médical ivoire et anneau or', width: 4096, height: 4096 },
    packaging: { jobId: 'b7a090e1-089e-44aa-80f9-a7cc5d3966ef', url: null, alt: 'DUO — coffret matte ivoire avec wordmark Atelier Frisson', width: 3712, height: 4608 },
    lifestyle: { jobId: '83ea2608-2a1d-44e4-930b-ee19694da102', url: null, alt: 'DUO — mise en scène sur étagère de salle de bain en marbre', width: 3712, height: 4608 },
  },

  /** ONDE — Wand massager oxblood signature NUIT */
  onde: {
    hero: {
      jobId: '63b20d7c-af59-4383-aa90-5edc937b4ae8',
      url: cdnUrl('20260512_101627', '63b20d7c-af59-4383-aa90-5edc937b4ae8'),
      alt: 'ONDE — wand massager laqué oxblood, manche brossé or champagne',
      width: 3712,
      height: 4608,
    },
    angle: {
      jobId: '162543ca-3fd0-45f4-b589-3d232ef193c3',
      url: cdnUrl('20260512_101815', '162543ca-3fd0-45f4-b589-3d232ef193c3'),
      alt: 'ONDE — vue 3/4 horizontal sur lin crème',
      width: 4096,
      height: 4096,
    },
    detail: { jobId: 'd396a290-1ea1-48c4-a891-0484138fdbae', url: null, alt: 'ONDE — macro laque oxblood et brossage or champagne', width: 4096, height: 4096 },
    packaging: { jobId: 'a6fd3437-372a-483b-b775-2ac2a24732db', url: null, alt: 'ONDE — coffret allongé matte ivoire entrouvert avec papier de soie or', width: 3712, height: 4608 },
    lifestyle: { jobId: 'a0c8bbaa-80df-4146-8595-719af309267f', url: null, alt: 'ONDE — sur fauteuil sage avec plaid cashmere et espresso', width: 3712, height: 4608 },
  },

  /** VELOURS — Stimulateur interne signature oxblood */
  velours: {
    hero: {
      jobId: '3dddb59d-678b-4e8c-b038-e2a027348956',
      url: cdnUrl('20260512_101630', '3dddb59d-678b-4e8c-b038-e2a027348956'),
      alt: 'VELOURS — objet sculptural oxblood laqué, base or champagne',
      width: 3712,
      height: 4608,
    },
    angle: {
      jobId: 'bdfc9667-562b-4aba-9d32-65821291dc12',
      url: cdnUrl('20260512_101818', 'bdfc9667-562b-4aba-9d32-65821291dc12'),
      alt: 'VELOURS — vue 3/4 sur satin ivoire',
      width: 4096,
      height: 4096,
    },
    detail: { jobId: '386f5bbd-42a9-449c-b168-6a592c0c9780', url: null, alt: 'VELOURS — macro laque polie et jonction or brossé', width: 4096, height: 4096 },
    packaging: { jobId: '32a277e9-3caf-40f5-91a3-8dce35594225', url: null, alt: 'VELOURS — coffret ivoire à charnière ouvert sur écrin soie or', width: 3712, height: 4608 },
    lifestyle: { jobId: '3a99d2e5-374f-4b1f-8c33-a3ed0ccd0a2d', url: null, alt: 'VELOURS — sur table de chevet en noyer avec bougie et verre cristal', width: 3712, height: 4608 },
  },

  /** PROFOND — Massager prostatique masculin noir velours */
  profond: {
    hero: { jobId: 'a42ac5dd-2159-4330-8c0f-f70b8605053d', url: null, alt: 'PROFOND — objet en silicone noir velours, base or champagne', width: 3712, height: 4608 },
    angle: {
      jobId: 'b29164e4-c649-4c1b-9736-cfc78188eb6a',
      url: cdnUrl('20260512_101821', 'b29164e4-c649-4c1b-9736-cfc78188eb6a'),
      alt: 'PROFOND — vue 3/4 sur lin crème',
      width: 4096,
      height: 4096,
    },
    detail: { jobId: 'd72f0b32-d101-4276-bf8a-dbfb5ced4dc0', url: null, alt: 'PROFOND — macro silicone velours noir et anneau or brossé', width: 4096, height: 4096 },
    packaging: { jobId: '1ef3d203-65b3-4bde-8d00-76c8c3457f40', url: null, alt: 'PROFOND — coffret ivoire avec monogramme AF et doublure oxblood', width: 3712, height: 4608 },
    lifestyle: { jobId: 'aa364d9f-126d-4460-ae51-c6537d343a90', url: null, alt: 'PROFOND — sur bureau en noyer avec journal et verre de whiskey', width: 3712, height: 4608 },
  },

  /** PIERRE — Pierre de massage chauffante basalte */
  pierre: {
    hero: {
      jobId: '00f2678e-eaeb-4e6e-90a0-84ffed9bd0ab',
      url: cdnUrl('20260512_101636', '00f2678e-eaeb-4e6e-90a0-84ffed9bd0ab'),
      alt: 'PIERRE — galet de massage basalte poli, ligne or champagne à l\'équateur',
      width: 3712,
      height: 4608,
    },
    angle: {
      jobId: 'd9b47d07-dfdf-4b9a-9a72-051501ce235b',
      url: cdnUrl('20260512_101824', 'd9b47d07-dfdf-4b9a-9a72-051501ce235b'),
      alt: 'PIERRE — vue 3/4 sur lin crème',
      width: 4096,
      height: 4096,
    },
    detail: { jobId: '267b1707-c6ff-46ac-ae8d-3079768aab87', url: null, alt: 'PIERRE — macro basalte avec micro-veinage et ligne or', width: 4096, height: 4096 },
    packaging: { jobId: '753ae9ec-3025-4cda-8299-05b6ff7eac7d', url: null, alt: 'PIERRE — coffret ivoire avec doublure soie oxblood et carte AF', width: 3712, height: 4608 },
    lifestyle: { jobId: 'a8f7389a-11e5-4142-ba79-659c0cbad6c4', url: null, alt: 'PIERRE — sur étagère de salle de bain en marbre avec huile ambre et eucalyptus', width: 3712, height: 4608 },
  },

  /** SILLAGE — Nuisette soie 22 momme ivoire perle */
  sillage: {
    hero: {
      jobId: 'bdc6587f-d770-4136-a6eb-c7a828f78157',
      url: cdnUrl('20260512_101639', 'bdc6587f-d770-4136-a6eb-c7a828f78157'),
      alt: 'SILLAGE — nuisette soie ivoire perle avec dentelle Calais or champagne',
      width: 3712,
      height: 4608,
    },
    angle: { jobId: 'fcf6c5d4-24da-4080-b7c2-8edb9e6bcbcc', url: null, alt: 'SILLAGE — drapée sur mannequin de tailleur en bois', width: 4096, height: 4096 },
    detail: { jobId: '986e0bb3-0def-428d-82e6-6fdbfb301719', url: null, alt: 'SILLAGE — macro tissage soie satin et dentelle Calais or', width: 4096, height: 4096 },
    packaging: { jobId: 'ae7264e7-f888-4098-af31-bb0a009e0188', url: null, alt: 'SILLAGE — pliée sur papier de soie champagne dans coffret ivoire', width: 3712, height: 4608 },
    lifestyle: { jobId: '64aaac6d-e1cb-4e10-95a4-03e65a3caf07', url: null, alt: 'SILLAGE — drapée sur lit défait avec hortensia séché', width: 3712, height: 4608 },
  },

  /** DENTELLE NOIRE — Body dentelle Leavers signature */
  dentelleNoire: {
    hero: {
      jobId: 'ec9b3973-22d9-491b-89a4-f07dac0356d4',
      url: cdnUrl('20260512_101642', 'ec9b3973-22d9-491b-89a4-f07dac0356d4'),
      alt: 'DENTELLE NOIRE — body dentelle Leavers noir avec agrafes or champagne',
      width: 3712,
      height: 4608,
    },
    angle: {
      jobId: '6e934d0b-e99a-403e-8ee7-54bf935d0f22',
      url: cdnUrl('20260512_101831', '6e934d0b-e99a-403e-8ee7-54bf935d0f22'),
      alt: 'DENTELLE NOIRE — suspendue sur mannequin de tailleur, ambiance tungstène',
      width: 4096,
      height: 4096,
    },
    detail: { jobId: '9a9bc4d7-e31e-4ce3-b86d-d49ad74df460', url: null, alt: 'DENTELLE NOIRE — macro pattern Leavers et agrafe or', width: 4096, height: 4096 },
    packaging: { jobId: '7aa69d50-80a2-4a0c-b531-ee3368072c0f', url: null, alt: 'DENTELLE NOIRE — pliée sur papier de soie champagne dans coffret', width: 3712, height: 4608 },
    lifestyle: { jobId: 'b38ed104-c68d-49a7-993e-a48884aca6c6', url: null, alt: 'DENTELLE NOIRE — drapée sur fauteuil velours sage avec coupe de champagne', width: 3712, height: 4608 },
  },

  /** KIMONO — Robe kimono soie sablée */
  kimono: {
    hero: { jobId: 'c13a28c5-be21-4210-91eb-d1d6a771e735', url: null, alt: 'KIMONO — robe soie sablée ivoire crème avec passepoil oxblood', width: 3712, height: 4608 },
    angle: { jobId: '619e965e-941e-40a3-998f-b4f61646184c', url: null, alt: 'KIMONO — drapé sur mannequin de tailleur avec ceinture nouée', width: 4096, height: 4096 },
    detail: { jobId: '07204a34-a948-48cc-8ad5-353ecf23660f', url: null, alt: 'KIMONO — macro soie sablée et passepoil oxblood avec broderie AF or', width: 4096, height: 4096 },
    packaging: { jobId: '213712a6-bf29-4700-82c7-f864964e1d5b', url: null, alt: 'KIMONO — plié sur papier de soie champagne dans coffret long', width: 3712, height: 4608 },
    lifestyle: { jobId: '452c535f-d1e5-40cb-8e3c-71002a84991c', url: null, alt: 'KIMONO — drapé sur chaise Thonet dans appartement Haussmann', width: 3712, height: 4608 },
  },

  /** AURORE — Bougie de massage cire végétale ambre */
  aurore: {
    hero: {
      jobId: 'b1a5f06c-7b74-4592-a779-612c0e3126f8',
      url: cdnUrl('20260512_101649', 'b1a5f06c-7b74-4592-a779-612c0e3126f8'),
      alt: 'AURORE — bougie de massage en verre ambré fumé avec étiquette letterpress',
      width: 3712,
      height: 4608,
    },
    angle: { jobId: 'a1363978-3837-4dfd-ac8f-f68144ca12ef', url: null, alt: 'AURORE — vue 3/4 allumée avec mèche bois et cire qui fond', width: 4096, height: 4096 },
    detail: { jobId: '3a009d39-9aaa-4508-80e3-756c9649d977', url: null, alt: 'AURORE — macro cire fondue autour de la mèche bois', width: 4096, height: 4096 },
    packaging: { jobId: '77c8377c-efe5-4197-950a-c06c788b4a48', url: null, alt: 'AURORE — bougie ambrée dans coffret ivoire avec monogramme AF', width: 3712, height: 4608 },
    lifestyle: { jobId: '60c4c183-a1f6-4f78-a6b6-ef64e9430107', url: null, alt: 'AURORE — sur table de chevet en marbre avec coupes de champagne et jasmin', width: 3712, height: 4608 },
  },

  /** HUILE — Huile sensuelle corps oud + rose poudrée */
  huile: {
    hero: {
      jobId: '96bda2de-317c-4d99-8a74-11e9b719e601',
      url: cdnUrl('20260512_101654', '96bda2de-317c-4d99-8a74-11e9b719e601'),
      alt: 'HUILE — flacon ambre dépoli avec pipette or champagne et étiquette letterpress',
      width: 3712,
      height: 4608,
    },
    angle: { jobId: 'a84997ab-12de-44b7-aabd-697195bcc552', url: null, alt: 'HUILE — vue 3/4 avec goutte d\'huile suspendue à la pipette', width: 4096, height: 4096 },
    detail: { jobId: 'eaa47f84-614c-4cd0-a225-8c8ed2c4c7f3', url: null, alt: 'HUILE — macro trois gouttes d\'huile dorée tombant sur coupelle ivoire', width: 4096, height: 4096 },
    packaging: { jobId: '790dee6a-c7db-4bad-9902-9e4f835721b0', url: null, alt: 'HUILE — flacon dans coffret ivoire avec monogramme AF or', width: 3712, height: 4608 },
    lifestyle: { jobId: '7d27c5bd-6e40-4b27-b187-f8967f791f47', url: null, alt: 'HUILE — sur table de chevet avec cashmere et rose damascène séchée', width: 3712, height: 4608 },
  },
} as const satisfies Record<string, ProductVisuals>;

/* ─────────────────────────────────────────────────────────────────────────────
 * VIDÉOS — 7 vidéos seedance_2_0 (1 Hero master + 5 product + 1 unboxing)
 *
 * URLs MP4 récupérées via `show_generations(type: 'video')` après complétion.
 * V1 : placeholder null, à compléter quand les jobs sortent de l'état `pending`.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface VideoAsset {
  readonly jobId: string;
  readonly url: string | null;
  /** Image poster fallback (start_image utilisée pour la génération). */
  readonly posterUrl: string | null;
  readonly duration: number;
  readonly aspectRatio: string;
  readonly resolution: '720p' | '1080p';
}

export const VIDEOS = {
  /** Hero master cinemascope 21:9 8s 1080p — push-in lent sur l'objet oxblood */
  heroMaster: {
    jobId: '9633bec6-02f0-4e62-a802-98b22f9d2f88',
    url: cdnVideoUrl('20260512_102216', '9633bec6-02f0-4e62-a802-98b22f9d2f88'),
    posterUrl: HEROS.rituelCinematic.url,
    duration: 8,
    aspectRatio: '21:9',
    resolution: '1080p',
  },
  /**
   * DUO motion 5s 720p 1:1 — turntable rotation ivoire.
   * Première gen rejetée NSFW (faux positif silicone+macro) → retry text-neutral OK.
   */
  duoMotion: {
    jobId: '16709816-27b1-4b28-b79a-d48cf08ce127',
    url: cdnVideoUrl('20260512_103312', '16709816-27b1-4b28-b79a-d48cf08ce127'),
    posterUrl: PRODUCTS.duo.hero.url,
    duration: 5,
    aspectRatio: '1:1',
    resolution: '720p',
  },
  /** ONDE motion 5s 720p 1:1 — tilt-down + parallax oxblood */
  ondeMotion: {
    jobId: '6e3341a1-ee44-49ea-9bb2-603e8afc416a',
    url: cdnVideoUrl('20260512_102251', '6e3341a1-ee44-49ea-9bb2-603e8afc416a'),
    posterUrl: PRODUCTS.onde.hero.url,
    duration: 5,
    aspectRatio: '1:1',
    resolution: '720p',
  },
  /** VELOURS motion 5s 720p 1:1 — orbite 25° */
  veloursMotion: {
    jobId: '488df041-69c8-4f00-9a37-7d664ecd83bf',
    url: cdnVideoUrl('20260512_102254', '488df041-69c8-4f00-9a37-7d664ecd83bf'),
    posterUrl: PRODUCTS.velours.hero.url,
    duration: 5,
    aspectRatio: '1:1',
    resolution: '720p',
  },
  /** PROFOND motion 5s 720p 1:1 — turntable rotation noir velours (text-only) */
  profondMotion: {
    jobId: '39057db2-2f44-4018-9bb5-9cb80370a4e3',
    url: cdnVideoUrl('20260512_102322', '39057db2-2f44-4018-9bb5-9cb80370a4e3'),
    posterUrl: PRODUCTS.profond.hero.url, // null si Vue 1 PROFOND pas encore generée
    duration: 5,
    aspectRatio: '1:1',
    resolution: '720p',
  },
  /**
   * AURORE motion 5s 720p 1:1 — ignition flame.
   * Première gen rejetée NSFW (faux positif macro candle push-in) → retry commercial OK.
   */
  auroreMotion: {
    jobId: '7ae93bfa-5b2e-479a-b7b4-219dd4120ebb',
    url: cdnVideoUrl('20260512_103315', '7ae93bfa-5b2e-479a-b7b4-219dd4120ebb'),
    posterUrl: PRODUCTS.aurore.hero.url,
    duration: 5,
    aspectRatio: '1:1',
    resolution: '720p',
  },
  /** Unboxing box mensuelle 5s 720p 1:1 — flap qui s'ouvre */
  unboxing: {
    jobId: 'a308aae0-e63c-40fe-b1dc-7d9754eccd7e',
    url: cdnVideoUrl('20260512_102304', 'a308aae0-e63c-40fe-b1dc-7d9754eccd7e'),
    posterUrl: HEROS.boxMensuelle.url,
    duration: 5,
    aspectRatio: '1:1',
    resolution: '720p',
  },
} as const satisfies Record<string, VideoAsset>;

/* ─────────────────────────────────────────────────────────────────────────────
 * HELPERS
 * ──────────────────────────────────────────────────────────────────────────── */

/** Convertit un `VisualAsset` en format attendu par `Product['images']` (Drizzle schema). */
export function toProductImage(asset: VisualAsset): { url: string; alt: string; width: number; height: number } {
  return {
    url: resolveAssetUrl(asset) ?? '',
    alt: asset.alt,
    width: asset.width,
    height: asset.height,
  };
}

/** Résout l'URL d'un `VisualAsset` au point d'usage. Public API. */
export function getAssetUrl(asset: VisualAsset): string | null {
  return resolveAssetUrl(asset);
}

/** Résout l'URL d'un `VideoAsset` au point d'usage. Public API. */
export function getVideoUrl(asset: VideoAsset): string | null {
  return resolveAssetUrl(asset);
}

/** Galerie produit complète (5 vues) au format Drizzle (`Product['images']`). */
export function productGallery(p: ProductVisuals): Array<{ url: string; alt: string; width: number; height: number }> {
  return [p.hero, p.angle, p.detail, p.packaging, p.lifestyle].map(toProductImage);
}

/**
 * Résout un slug catalogue (kebab-case) vers les visuels manifest (camelCase).
 *
 * Exemple : `'dentelle-noire'` → `PRODUCTS.dentelleNoire`.
 * Retourne `null` si le slug n'a pas de visuels Higgsfield disponibles.
 */
export function getProductVisuals(slug: string): ProductVisuals | null {
  const camelCase = slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  return (PRODUCTS as Record<string, ProductVisuals | undefined>)[camelCase] ?? null;
}
