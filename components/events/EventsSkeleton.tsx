import {Skeleton} from '@/components/ui/Skeleton';

export function EventsSkeleton() {
  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-44 rounded-full" />
      </div>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Skeleton className="h-20 w-20 rounded-2xl" variant="rect" />
        <Skeleton className="h-5 w-48" variant="text" />
        <Skeleton className="h-4 w-64" variant="text" />
        <Skeleton className="h-10 w-36 rounded-full mt-2" />
      </div>
    </div>
  );
}
