import 'server-only';
import Mux from '@mux/mux-node';

/**
 * Helpers Mux pour l'upload de hero vidéo produit + lecture HLS adaptatif.
 *
 * Flow d'upload :
 *   1. Admin clique « Uploader vidéo » sur /admin/produits/[slug]
 *   2. Server Action `createMuxUploadAction` génère une signed URL Mux
 *   3. Le client POST le fichier vidéo directement vers Mux (pas par
 *      notre serveur — économie bande passante)
 *   4. Mux ingère, transcode, génère les renditions HLS
 *   5. Webhook `video.asset.ready` (Sprint 4) → UPDATE products SET
 *      video_mux_playback_id = ..., video_poster_url = ...
 *
 * En dev sans MUX_TOKEN_ID/SECRET : graceful — les fonctions throw avec
 * un message clair, les composants UI affichent un fallback statique.
 */

let cachedClient: Mux | null = null;

function getMuxClient(): Mux {
  if (cachedClient) return cachedClient;
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw new Error(
      'MUX_TOKEN_ID + MUX_TOKEN_SECRET requis pour utiliser Mux. Voir docs/MUX_SETUP.md (Sprint 4).',
    );
  }
  cachedClient = new Mux({ tokenId, tokenSecret });
  return cachedClient;
}

/**
 * Crée une URL Mux Direct Upload signée.
 * Le client uploade ensuite le fichier vidéo directement vers cette URL
 * (multipart/form-data POST), sans passer par notre serveur.
 *
 * Retourne `{ uploadUrl, uploadId }` :
 * - uploadUrl : à utiliser côté client pour le POST
 * - uploadId  : à stocker pour suivre le statut via webhook
 */
export interface CreateMuxUploadResult {
  uploadUrl: string;
  uploadId: string;
}

export async function createMuxDirectUpload(
  options: {
    /** Limite la durée max (sec) du fichier accepté. Évite les abus. */
    maxDurationSeconds?: number;
    /** CORS origin autorisé (ex: https://atelierfrisson.fr). */
    corsOrigin?: string;
  } = {},
): Promise<CreateMuxUploadResult> {
  const client = getMuxClient();
  const upload = await client.video.uploads.create({
    cors_origin: options.corsOrigin ?? process.env.NEXT_PUBLIC_APP_URL ?? '*',
    new_asset_settings: {
      playback_policy: ['signed'],
      mp4_support: 'capped-1080p',
      max_resolution_tier: '1080p',
    },
    timeout: 3600,
  });
  if (!upload.url || !upload.id) {
    throw new Error('Mux upload : URL ou ID manquant dans la réponse');
  }
  return { uploadUrl: upload.url, uploadId: upload.id };
}

/**
 * Récupère le statut d'un upload + l'asset_id si l'ingestion est terminée.
 * Utilisé par le polling admin en attendant que le webhook arrive.
 */
export async function getMuxUploadStatus(uploadId: string): Promise<{
  status: 'waiting' | 'asset_created' | 'errored' | 'cancelled' | 'timed_out';
  assetId: string | null;
}> {
  const client = getMuxClient();
  const upload = await client.video.uploads.retrieve(uploadId);
  return {
    status: upload.status,
    assetId: upload.asset_id ?? null,
  };
}

/** Récupère le playback_id signé d'un asset (pour Mux Player). */
export async function getMuxAssetPlaybackId(assetId: string): Promise<string | null> {
  const client = getMuxClient();
  const asset = await client.video.assets.retrieve(assetId);
  // On préfère le playback signed (sécurisé) — fallback public si pas de signed
  const signed = asset.playback_ids?.find((p) => p.policy === 'signed');
  const pub = asset.playback_ids?.find((p) => p.policy === 'public');
  return signed?.id ?? pub?.id ?? null;
}

/** URL du poster auto-généré par Mux (PNG ou JPG). */
export function getMuxPosterUrl(playbackId: string): string {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1200&fit_mode=preserve&time=2`;
}

/** URL du HLS stream pour Mux Player. */
export function getMuxHlsUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}
