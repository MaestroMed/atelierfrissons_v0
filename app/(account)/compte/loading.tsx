import { AccountDashboardSkeleton } from '@/components/shared/Skeleton';

/**
 * Loading skeleton pour /compte — affiché pendant le streaming SSR
 * (auth check + lecture éventuelle de commandes).
 */
export default function CompteLoading() {
  return <AccountDashboardSkeleton />;
}
