/**
 * Helpers CSV — RFC 4180 compliant.
 *
 * Pas de dépendance npm. Échappe correctement les `,`, `"`, `\n`
 * en quotant les valeurs et en doublant les `"` à l'intérieur.
 */

export type CsvCell = string | number | boolean | Date | null | undefined;
export type CsvRow = Record<string, CsvCell>;

/** Échappe une cellule pour CSV (RFC 4180). */
export function escapeCsvCell(value: CsvCell): string {
  if (value === null || value === undefined) return '';
  let str: string;
  if (value instanceof Date) {
    str = value.toISOString();
  } else if (typeof value === 'boolean') {
    str = value ? 'oui' : 'non';
  } else {
    str = String(value);
  }
  // Quotage si contient virgule, guillemet, ou newline
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Sérialise un tableau d'objets en CSV. Les colonnes sont dérivées
 * des clés du premier objet — utiliser un type cohérent.
 *
 * Exemple :
 *   const csv = toCsv([
 *     { ordre: 'AF-001', total: 9900, créée: new Date() },
 *     { ordre: 'AF-002', total: 12900, créée: new Date() },
 *   ]);
 */
export function toCsv<T extends CsvRow>(
  rows: readonly T[],
  options: {
    /** Header personnalisé. Si absent, dérivé des clés du premier row. */
    headers?: readonly { key: keyof T; label: string }[];
    /** Sépareur (défaut `,` RFC 4180). Mettre `;` pour Excel FR. */
    delimiter?: string;
    /** Inclut le BOM UTF-8 (recommandé pour Excel). */
    bom?: boolean;
  } = {},
): string {
  if (rows.length === 0) {
    return options.bom ? '﻿' : '';
  }
  const delimiter = options.delimiter ?? ',';
  const headers =
    options.headers ??
    Object.keys(rows[0] as object).map((k) => ({
      key: k as keyof T,
      label: k,
    }));

  const headerLine = headers.map((h) => escapeCsvCell(h.label)).join(delimiter);
  const lines = rows.map((row) =>
    headers.map((h) => escapeCsvCell(row[h.key] as CsvCell)).join(delimiter),
  );
  const content = [headerLine, ...lines].join('\r\n');
  return (options.bom ? '﻿' : '') + content;
}

/** Helper pour Response Next.js avec les headers CSV corrects. */
export function csvResponseHeaders(filename: string): HeadersInit {
  return {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store',
  };
}
