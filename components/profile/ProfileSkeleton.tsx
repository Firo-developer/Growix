import {Skeleton} from '@/components/ui/Skeleton';

export function ProfileSkeleton() {
  return (
    <div className="page-container">
      <Skeleton className="h-48 sm:h-56 w-full rounded-2xl mb-0" />
      <div className="relative -mt-10 mb-6">
        <Skeleton className="h-20 w-20 rounded-2xl" />
      </div>
      <div className="flex justify-end mb-6">
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
      <Skeleton className="h-8 w-48 mb-3" />
      <Skeleton className="h-4 w-56 mb-4" variant="text" />
      <Skeleton className="h-4 w-full max-w-md mb-6" variant="text" />
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full" variant="circle" />
        <Skeleton className="h-8 w-8 rounded-full" variant="circle" />
        <Skeleton className="h-8 w-8 rounded-full" variant="circle" />
      </div>
    </div>
  );
}
