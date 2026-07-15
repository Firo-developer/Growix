import {Skeleton} from '@/components/ui/Skeleton';

export function DiscoverSkeleton() {
  return (
    <div className="page-container">
      <Skeleton className="h-9 w-48 mb-3" />
      <Skeleton className="h-4 w-full max-w-md mb-8" variant="text" />
      <Skeleton className="h-5 w-40 mb-4" variant="text" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
        {Array.from({length: 8}).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-7 w-48 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({length: 6}).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
