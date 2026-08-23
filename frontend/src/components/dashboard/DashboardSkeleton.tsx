import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Patient context card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      {/* Insurance metric cards — 4 in a row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-32" />
              </div>
              <Skeleton className="w-9 h-9 rounded-lg" />
            </div>
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — timeline + stage intelligence */}
        <div className="lg:col-span-2 space-y-5">
          {/* Journey timeline card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            {/* Timeline row */}
            <div className="flex items-center justify-between mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex items-center w-full">
                    {i > 0 && <Skeleton className="flex-1 h-0.5" />}
                    <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                    {i < 3 && <Skeleton className="flex-1 h-0.5" />}
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Stage intelligence card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-40" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Section 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-full" />
              ))}
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-36" />
              </div>
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-5/6" />
              ))}
            </div>

            {/* Section 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-4/5" />
              ))}
            </div>

            <Skeleton className="h-3 w-full" />
          </div>
        </div>

        {/* Right column — alerts + quick actions */}
        <div className="space-y-5">
          {/* Alerts card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 rounded shrink-0 mt-0.5" />
                <Skeleton className="h-3 flex-1" />
              </div>
            ))}
            <Skeleton className="h-4 w-36 mt-2" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 rounded shrink-0 mt-0.5" />
                <Skeleton className="h-3 flex-1" />
              </div>
            ))}
          </div>

          {/* Quick actions card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-3">
            <Skeleton className="h-5 w-28" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-100"
              >
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="w-4 h-4 rounded shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
