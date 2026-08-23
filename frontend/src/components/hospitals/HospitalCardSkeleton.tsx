import { Skeleton } from '@/components/ui/skeleton';

export function HospitalCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        {/* Score circle */}
        <Skeleton className="h-20 w-20 rounded-full shrink-0" />
      </div>

      {/* Score breakdown rows */}
      <div className="space-y-2 pt-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2 flex-1 rounded-full" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>

      {/* Factor rows */}
      <div className="space-y-1.5 pt-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ))}
      </div>

      {/* Footer buttons */}
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>
    </div>
  );
}
