import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiting Atelier Frisson — Upstash Redis (Edge-compatible).
 *
 * Politiques (CLAUDE.md §8 Couche 3) :
 *   - auth   : 5 req / min / IP sur /api/auth/* + flow login (CLAUDE.md §8.1)
 *   - api    : 100 req / min / IP — par défaut sur /api/*
 *   - forge  : 10 req / heure sur /api/forge/ingest (ingestion FORJA, §6.3)
 *   - checkout : 20 req / min / IP sur /checkout/* (anti-fraude)
 *
 * Si les credentials Upstash sont absents (dev/CI), le rate-limit est bypassé
 * avec un warning unique — jamais silent pass en prod.
 */

type Window = `${number} ${'s' | 'm' | 'h' | 'd'}`;

interface RateLimitConfig {
  requests: number;
  window: Window;
  prefix: string;
}

let cachedRedis: Redis | null = null;
let warnedMissingEnv = false;

function getRedis(): Redis | null {
  if (cachedRedis) return cachedRedis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (!warnedMissingEnv) {
      warnedMissingEnv = true;
      console.warn(
        '[rate-limit] UPSTASH_REDIS_REST_URL / _TOKEN absents — rate-limiting désactivé. ' +
          'Configurez Upstash avant la mise en production.',
      );
    }
    return null;
  }
  cachedRedis = Redis.fromEnv();
  return cachedRedis;
}

function createLimiter(config: RateLimitConfig): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: config.prefix,
    analytics: true,
  });
}

// Instances singleton (initialisées au premier usage).
let authRateLimit: Ratelimit | null | undefined;
let apiRateLimit: Ratelimit | null | undefined;
let forgeIngestRateLimit: Ratelimit | null | undefined;
let checkoutRateLimit: Ratelimit | null | undefined;

export function getAuthRateLimit() {
  if (authRateLimit === undefined) {
    authRateLimit = createLimiter({ requests: 5, window: '1 m', prefix: 'af:rl:auth' });
  }
  return authRateLimit;
}

export function getApiRateLimit() {
  if (apiRateLimit === undefined) {
    apiRateLimit = createLimiter({ requests: 100, window: '1 m', prefix: 'af:rl:api' });
  }
  return apiRateLimit;
}

export function getForgeIngestRateLimit() {
  if (forgeIngestRateLimit === undefined) {
    forgeIngestRateLimit = createLimiter({ requests: 10, window: '1 h', prefix: 'af:rl:forge' });
  }
  return forgeIngestRateLimit;
}

export function getCheckoutRateLimit() {
  if (checkoutRateLimit === undefined) {
    checkoutRateLimit = createLimiter({ requests: 20, window: '1 m', prefix: 'af:rl:checkout' });
  }
  return checkoutRateLimit;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Applique un rate limit. Si `limiter` est null (Upstash non configuré),
 * renvoie un succès par défaut — **uniquement** utile en dev.
 */
export async function applyRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<RateLimitResult> {
  if (!limiter) {
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
  return limiter.limit(identifier);
}

/** Extrait l'IP du client — priorité à x-forwarded-for (Vercel/Cloudflare). */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    headers.get('cf-connecting-ip') ??
    'anonymous'
  );
}
