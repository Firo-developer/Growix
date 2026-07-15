import {Skeleton} from '@/components/ui/Skeleton';

export function SettingsSkeleton() {
  return (
    <div className="page-container">
      <Skeleton className="h-9 w-32 mb-6" />
      <Skeleton className="h-10 w-72 mb-8 rounded-lg" />
      <Skeleton className="h-6 w-48 mb-4" variant="text" />
      <Skeleton className="h-56 w-full rounded-2xl mb-10" />
      <Skeleton className="h-6 w-48 mb-3" variant="text" />
      <Skeleton className="h-4 w-full max-w-md mb-6" variant="text" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({length: 3}).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
