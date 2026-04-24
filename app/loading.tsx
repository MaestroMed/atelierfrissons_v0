import { Container } from '@/components/layout/Container';
import { Fleuron } from '@/components/layout/Fleuron';

/**
 * Loading skeleton global — affiché pendant les transitions de routes
 * lentes (Server Component pending). Sobriété éditoriale, pas de spinner agressif.
 */
export default function Loading() {
  return (
    <Container
      as="div"
      className="flex min-h-[60dvh] flex-col items-center justify-center py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <Fleuron variant="divider" size="md" color="or" className="opacity-80" />
      <p className="font-italic-editorial text-encre/65 mt-6 text-lg">
        Atelier Frisson <span className="text-or-dark">·</span> chargement du rituel…
      </p>
      <span className="sr-only">Chargement de la page…</span>
    </Container>
  );
}
