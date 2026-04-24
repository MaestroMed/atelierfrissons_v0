'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type ChapterTone = 'jour' | 'nuit' | 'rouge' | 'noir-velours';

interface CinematicChapterProps {
  /** Caption small-caps en tête de chapitre. */
  caption: string;
  /** Numéro romain (I, II, III…). */
  chapterNumber: string;
  /** Titre principal — peut contenir du HTML pour <em>. */
  title: string;
  /** Paragraphe éditorial (peut contenir du HTML). */
  body: string;
  /** Citation mise en exergue (optionnelle). */
  quote?: string;
  /** Attribution de la citation. */
  quoteAuthor?: string;
  /** Tonalité du fond de section. */
  tone?: ChapterTone;
  /** Layout : la colonne texte à gauche ou à droite. */
  align?: 'left' | 'right' | 'center';
  /** Contenu visuel optionnel à placer côté opposé au texte (silhouette, fleuron…). */
  visual?: React.ReactNode;
  /** Déclenche la scale fluide de la typo au scroll progress. */
  animateTypo?: boolean;
  id?: string;
}

const TONE_CLASSES: Record<ChapterTone, string> = {
  jour: 'bg-ivoire text-encre',
  nuit: 'bg-noir text-ivoire',
  rouge: 'bg-rouge text-ivoire',
  'noir-velours': 'bg-noir-velours text-ivoire',
};

/**
 * Un chapitre cinématique — section full-viewport avec révélation au scroll,
 * typo qui se déplie, et ambiance colorée. Scroll progress local via
 * IntersectionObserver pour piloter l'opacité + translateY.
 *
 * Structure :
 *   - Caption small-caps + numéro de chapitre
 *   - Titre XXL Bodoni (peut contenir <em>)
 *   - Paragraphe body
 *   - Citation optionnelle en italique
 *   - Visual côté opposé (silhouette, fleuron, etc.)
 *
 * Respecte `prefers-reduced-motion` : reveal instantané sans animation.
 */
export function CinematicChapter({
  caption,
  chapterNumber,
  title,
  body,
  quote,
  quoteAuthor,
  tone = 'jour',
  align = 'left',
  visual,
  animateTypo = true,
  id,
}: CinematicChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0); // 0 → 1 selon la position dans le viewport

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      setProgress(1);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.2 },
    );
    io.observe(el);

    // Progress au scroll — pour la typo qui s'agrandit doucement
    let raf: number | null = null;
    const computeProgress = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Commence à 1 quand la section entre par le bas, 0 quand elle sort par le haut
      const p = Math.max(0, Math.min(1, 1 - rect.top / vh));
      setProgress(p);
      raf = null;
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(computeProgress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    computeProgress();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  // Typo scale : 0.92 au début → 1 pleinement révélée
  const typoScale = animateTypo ? 0.92 + progress * 0.08 : 1;

  const isDark = tone !== 'jour';
  const textAlignClass =
    align === 'center'
      ? 'text-center items-center'
      : align === 'right'
        ? 'text-right items-end'
        : '';

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        'relative flex min-h-[90vh] items-center overflow-hidden py-24 md:min-h-[100vh] md:py-32',
        TONE_CLASSES[tone],
        'transition-colors duration-700',
      )}
    >
      {/* Ambient radial glow */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 opacity-40',
          tone === 'nuit' &&
            '[background:radial-gradient(ellipse_at_20%_30%,rgba(201,163,107,0.12)_0%,transparent_55%),radial-gradient(ellipse_at_85%_70%,rgba(139,20,36,0.18)_0%,transparent_60%)]',
          tone === 'rouge' &&
            '[background:radial-gradient(ellipse_at_70%_30%,rgba(255,255,255,0.08)_0%,transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(201,163,107,0.15)_0%,transparent_60%)]',
          tone === 'noir-velours' &&
            '[background:radial-gradient(ellipse_at_50%_20%,rgba(201,163,107,0.1)_0%,transparent_60%)]',
          tone === 'jour' &&
            '[background:radial-gradient(ellipse_at_80%_20%,rgba(201,163,107,0.12)_0%,transparent_55%)]',
        )}
      />

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 md:px-10 lg:grid-cols-2 lg:gap-20">
        {/* Colonne visuelle */}
        {visual ? (
          <div
            className={cn(
              'flex items-center justify-center transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none',
              revealed ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0',
              align === 'right' ? 'lg:order-last' : 'lg:order-first',
              align === 'center' ? 'hidden' : '',
            )}
          >
            {visual}
          </div>
        ) : null}

        {/* Colonne texte */}
        <div
          className={cn(
            'flex flex-col gap-6 transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none',
            revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
            textAlignClass,
            align === 'center' && 'mx-auto max-w-3xl lg:col-span-2',
            !visual && align !== 'center' && 'lg:col-span-2',
          )}
          style={{ transitionDelay: revealed ? '120ms' : '0ms' }}
        >
          <p
            className={cn(
              'ui-caps inline-flex items-center gap-3 text-xs',
              isDark ? 'text-or' : 'text-or-dark',
            )}
          >
            <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
            Chapitre&nbsp;{chapterNumber}
            <span aria-hidden="true" className="bg-or inline-block h-px w-8" />
          </p>
          <p className={cn('ui-caps text-sm', isDark ? 'text-or-light' : 'text-or-dark')}>
            {caption}
          </p>
          <h2
            className="font-display text-4xl leading-[1.05] font-medium md:text-6xl lg:text-7xl"
            style={{
              transform: `scale(${typoScale})`,
              transformOrigin:
                align === 'right' ? 'right center' : align === 'center' ? 'center' : 'left center',
              transition: 'transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p
            className={cn(
              'text-base leading-relaxed md:text-lg',
              isDark ? 'text-ivoire/80' : 'text-encre/80',
              align === 'center' && 'max-w-2xl',
            )}
            dangerouslySetInnerHTML={{ __html: body }}
          />
          {quote ? (
            <blockquote
              className={cn(
                'mt-4 border-l-2 pl-5',
                isDark ? 'border-or/50' : 'border-or',
                align === 'center' && 'mx-auto border-t border-l-0 pt-5 pl-0 text-center',
              )}
            >
              <p
                className={cn(
                  'font-italic-editorial text-xl leading-relaxed md:text-2xl',
                  isDark ? 'text-ivoire' : 'text-encre',
                )}
              >
                <span className={cn('text-or mr-1', isDark && 'text-or-light')} aria-hidden="true">
                  «
                </span>
                {quote}
                <span className={cn('text-or ml-1', isDark && 'text-or-light')} aria-hidden="true">
                  »
                </span>
              </p>
              {quoteAuthor ? (
                <cite
                  className={cn(
                    'ui-caps mt-3 block text-[10px] not-italic',
                    isDark ? 'text-or/80' : 'text-or-dark/80',
                  )}
                >
                  — {quoteAuthor}
                </cite>
              ) : null}
            </blockquote>
          ) : null}
        </div>
      </div>
    </section>
  );
}
