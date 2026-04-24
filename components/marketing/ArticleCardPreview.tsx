import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ArticleCardPreviewData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTimeMinutes: number;
  /** Gradient d'illustration — placeholder tant qu'il n'y a pas de hero image. */
  gradient?: 'ivoire' | 'rouge' | 'noir';
}

interface ArticleCardPreviewProps {
  article: ArticleCardPreviewData;
  className?: string;
}

const GRADIENT_CLASS = {
  ivoire: 'from-ivoire-light via-ivoire to-ivoire-dark',
  rouge: 'from-rouge-dark via-rouge to-rouge-light',
  noir: 'from-noir-velours via-noir to-noir-light',
} as const;

export function ArticleCardPreview({ article, className }: ArticleCardPreviewProps) {
  const gradient = GRADIENT_CLASS[article.gradient ?? 'ivoire'];
  return (
    <Link
      href={`/rituels/${article.slug}`}
      className={cn(
        'group flex flex-col gap-5 border-b border-noir/10 pb-6 transition-colors hover:border-or',
        className,
      )}
    >
      <div
        className={cn(
          'relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br',
          gradient,
        )}
      >
        <div className="absolute inset-0 flex items-end p-6">
          <span className="ui-caps inline-flex items-center gap-2 border border-ivoire/30 bg-noir/20 px-3 py-1.5 text-ivoire backdrop-blur-sm">
            {article.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="ui-caps text-or-dark">Lecture · {article.readingTimeMinutes} min</p>
        <h3 className="font-display text-2xl font-medium leading-tight transition-colors group-hover:text-or-dark md:text-3xl">
          {article.title}
        </h3>
        <p className="text-sm text-encre/75 md:text-base">{article.excerpt}</p>
        <span className="ui-caps mt-2 inline-flex items-center gap-2 text-or-dark transition-all duration-300 group-hover:gap-3">
          Lire l’article
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
