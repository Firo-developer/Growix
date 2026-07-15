import {Skeleton} from '@/components/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <Skeleton className="h-9 w-44 mb-2" />
          <Skeleton className="h-4 w-56" variant="text" />
        </div>
        <Skeleton className="h-9 w-48 rounded-[8px]" />
      </div>

      <Skeleton className="h-5 w-36 mb-4" variant="text" />
      <Skeleton className="h-[180px] rounded-[24px] mb-10" variant="rect" />

      <Skeleton className="h-5 w-32 mb-4" variant="text" />
      <div className="flex flex-wrap gap-2 mb-10">
        {Array.from({length: 4}).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-lg" />
        ))}
      </div>

      <Skeleton className="h-5 w-40 mb-4" variant="text" />
      <Skeleton className="h-[220px] rounded-[24px]" variant="rect" />
    </div>
  );
}
