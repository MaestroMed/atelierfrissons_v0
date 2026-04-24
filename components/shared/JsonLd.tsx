interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Insère un script JSON-LD pour Schema.org.
 *
 * `dangerouslySetInnerHTML` est la seule option ici (Schema.org standard).
 * On serialise avec un replace `</` → `<\/` pour éviter le XSS via `</script>`
 * dans les valeurs (defense in depth, même si JSON.stringify échappe déjà).
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
      suppressHydrationWarning
    />
  );
}
