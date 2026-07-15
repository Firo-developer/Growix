import {Skeleton} from '@/components/ui/Skeleton';

export function CalendarsSkeleton() {
  return (
    <div className="page-container">
      <Skeleton className="h-9 w-40 mb-8" />
      <Skeleton className="h-48 w-full rounded-2xl mb-10" />
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}
