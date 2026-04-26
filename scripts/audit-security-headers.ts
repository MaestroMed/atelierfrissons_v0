#!/usr/bin/env tsx
/**
 * Script d'audit local des security headers — `pnpm tsx scripts/audit-security-headers.ts`.
 *
 * Lance contre le dev server local (par défaut) ou contre une URL prod.
 * Vérifie la présence + le contenu de tous les headers attendus.
 *
 * Usage :
 *   pnpm tsx scripts/audit-security-headers.ts
 *   pnpm tsx scripts/audit-security-headers.ts https://atelierfrisson.fr
 *
 * Réplique l'esprit de Mozilla Observatory + securityheaders.com mais
 * en local — utile en CI/CD avant un deploy.
 */

interface HeaderCheck {
  header: string;
  required: boolean;
  validator?: (value: string | null) => { ok: boolean; message: string };
  description: string;
}

const CHECKS: readonly HeaderCheck[] = [
  {
    header: 'Content-Security-Policy',
    required: true,
    validator: (v) => {
      if (!v) return { ok: false, message: 'Manquant' };
      const checks = [
        ["default-src 'self'", v.includes("default-src 'self'")],
        ["frame-ancestors 'none'", v.includes("frame-ancestors 'none'")],
        ['nonce', v.includes('nonce-')],
        ['strict-dynamic', v.includes("'strict-dynamic'")],
        ["object-src 'none'", v.includes("object-src 'none'")],
      ];
      const failed = checks.filter(([, ok]) => !ok).map(([k]) => k);
      return failed.length === 0
        ? { ok: true, message: 'CSP nonce + strict-dynamic + frame-ancestors none ✓' }
        : { ok: false, message: `CSP partielle, manque : ${failed.join(', ')}` };
    },
    description: 'CSP avec nonce + strict-dynamic + frame-ancestors none',
  },
  {
    header: 'Strict-Transport-Security',
    required: false, // Pas en dev local HTTP
    validator: (v) => {
      if (!v) return { ok: true, message: 'Absent (OK en dev local HTTP)' };
      const hasMaxAge = /max-age=\d+/.test(v);
      const hasInclude = v.includes('includeSubDomains');
      const hasPreload = v.includes('preload');
      const ok = hasMaxAge && hasInclude && hasPreload;
      return ok
        ? { ok: true, message: 'HSTS preload-ready ✓' }
        : {
            ok: false,
            message: 'HSTS présent mais incomplet (manque max-age/includeSubDomains/preload)',
          };
    },
    description: 'HSTS 2 ans + includeSubDomains + preload',
  },
  {
    header: 'X-Content-Type-Options',
    required: true,
    validator: (v) =>
      v === 'nosniff'
        ? { ok: true, message: 'nosniff ✓' }
        : { ok: false, message: `Doit être 'nosniff', reçu : ${v ?? 'absent'}` },
    description: 'Bloque le MIME sniffing',
  },
  {
    header: 'X-Frame-Options',
    required: true,
    validator: (v) =>
      v === 'DENY' || v === 'SAMEORIGIN'
        ? { ok: true, message: `${v} ✓` }
        : { ok: false, message: `Doit être DENY ou SAMEORIGIN, reçu : ${v ?? 'absent'}` },
    description: 'Anti-clickjacking',
  },
  {
    header: 'Referrer-Policy',
    required: true,
    validator: (v) =>
      v === 'strict-origin-when-cross-origin' || v === 'no-referrer'
        ? { ok: true, message: `${v} ✓` }
        : { ok: false, message: `Recommandé : strict-origin-when-cross-origin (reçu ${v})` },
    description: "Limite la fuite d'URL via Referer",
  },
  {
    header: 'Permissions-Policy',
    required: true,
    validator: (v) => {
      if (!v) return { ok: false, message: 'Manquant' };
      const required = ['camera=()', 'microphone=()', 'geolocation=()', 'interest-cohort=()'];
      const missing = required.filter((r) => !v.includes(r));
      return missing.length === 0
        ? { ok: true, message: 'Permissions strictes ✓' }
        : { ok: false, message: `Manque : ${missing.join(', ')}` };
    },
    description: 'Désactive caméra, micro, géoloc, FLoC',
  },
  {
    header: 'Cross-Origin-Opener-Policy',
    required: true,
    validator: (v) =>
      v === 'same-origin' || v === 'same-origin-allow-popups'
        ? { ok: true, message: `${v} ✓` }
        : { ok: false, message: `Recommandé : same-origin (reçu ${v ?? 'absent'})` },
    description: 'Isole le browsing context',
  },
  {
    header: 'Cross-Origin-Resource-Policy',
    required: true,
    validator: (v) =>
      v === 'same-site' || v === 'same-origin'
        ? { ok: true, message: `${v} ✓` }
        : { ok: false, message: `Recommandé : same-site (reçu ${v ?? 'absent'})` },
    description: 'Restreint le chargement cross-origin',
  },
];

async function audit(baseUrl: string): Promise<void> {
  const url = new URL('/', baseUrl).toString();
  console.log(`\n🔍 Audit security headers — ${url}\n`);

  let res: Response;
  try {
    res = await fetch(url, { method: 'GET', redirect: 'manual' });
  } catch (err) {
    console.error('❌ Fetch failed:', err);
    process.exit(1);
  }

  console.log(`Status: ${res.status}\n`);

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const check of CHECKS) {
    const value = res.headers.get(check.header);
    const result = check.validator
      ? check.validator(value)
      : value
        ? { ok: true, message: value }
        : { ok: !check.required, message: check.required ? 'Manquant' : 'Absent (optionnel)' };

    const icon = result.ok ? '✅' : check.required ? '❌' : '⚠️ ';
    if (result.ok) passed++;
    else if (check.required) failed++;
    else skipped++;

    console.log(`${icon}  ${check.header}`);
    console.log(`    ${result.message}`);
    if (!result.ok && check.required) {
      console.log(`    → ${check.description}`);
    }
    console.log();
  }

  console.log('─'.repeat(60));
  console.log(`Résultats : ${passed} ✅  ·  ${failed} ❌  ·  ${skipped} ⚠️\n`);

  if (failed > 0) {
    console.log('❌ Audit échoué — headers requis manquants ou incorrects.');
    process.exit(1);
  }
  console.log('✅ Audit passé — headers conformes.');
}

const target = process.argv[2] ?? 'http://localhost:3000';
audit(target).catch((err) => {
  console.error(err);
  process.exit(1);
});
