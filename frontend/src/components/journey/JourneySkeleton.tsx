import { Skeleton } from '@/components/ui/skeleton';

export function JourneySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-36" />
        </div>
        <Skeleton className="h-5 w-56" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Timeline card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
        <div className="flex items-start w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start flex-1 min-w-0">
              {i > 0 && <Skeleton className="flex-1 h-0.5 mt-7 shrink-0" />}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <Skeleton className="w-14 h-14 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              {i < 3 && <Skeleton className="flex-1 h-0.5 mt-7 shrink-0" />}
            </div>
          ))}
        </div>

        {/* Event history skeleton */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
          <Skeleton className="h-3.5 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: CurrentStagePanel skeleton */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
          {/* Stage header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-7 w-72" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Policy section */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-lg" />
            ))}
          </div>

          {/* Constraints section */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="h-4 w-40" />
            </div>
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-lg" />
            ))}
          </div>

          <Skeleton className="h-3 w-full" />
        </div>

        {/* Right: Sidebar skeleton */}
        <div className="space-y-4">
          {/* Stage progress button */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-3 w-full" />
          </div>

          {/* Document checklist */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-md" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-3 w-52" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 flex-1" />
              </div>
            ))}
          </div>

          {/* Caregiver questions */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-md" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-3 w-full" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-4 h-4 rounded mt-0.5 shrink-0" />
                <Skeleton className="h-3 flex-1" />
              </div>
            ))}
          </div>

          {/* Journey summary */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
            <Skeleton className="h-3.5 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-3.5 h-3.5 rounded shrink-0" />
                <Skeleton className="h-3.5 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
