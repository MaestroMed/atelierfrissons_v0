import { Skeleton } from '@/components/shared/Skeleton';

/**
 * Loading skeleton pour le dashboard admin et toutes les sous-pages
 * (les loading.tsx héritent des segments parents en Next.js App Router).
 */
export default function AdminLoading() {
  return (
    <div className="px-8 py-10 md:px-12">
      <div className="border-encre/10 mb-10 flex items-end justify-between gap-4 border-b pb-6">
        <div className="flex flex-col gap-2">
          <Skeleton variant="text" className="h-3 w-24" />
          <Skeleton variant="text" className="h-8 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* KPIs skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border-encre/10 bg-ivoire flex flex-col gap-3 border p-6">
            <Skeleton variant="text" className="h-3 w-20" />
            <Skeleton variant="text" className="h-10 w-24" />
            <Skeleton variant="text" className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
