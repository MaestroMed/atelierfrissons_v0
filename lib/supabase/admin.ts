import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase avec SERVICE ROLE — **BYPASSE RLS**.
 *
 * ⚠️ Usage exclusivement serveur (enforced via `server-only`). À utiliser
 * uniquement pour les opérations système :
 *  - webhooks entrants (CJ, CCBill, Klaviyo, FORJA)
 *  - crons (sitemap, forge-monitor, sync-products)
 *  - seeds / migrations applicatives
 *  - actions admin qui ont besoin de traverser les RLS (ex: créer un
 *    `admin_user` lors du bootstrap).
 *
 * Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` au client.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis (admin client).',
    );
  }
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
