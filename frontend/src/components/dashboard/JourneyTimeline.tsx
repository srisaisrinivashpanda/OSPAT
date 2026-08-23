import { cn, getStageIndex, getStageLabel } from '@/lib/utils';

const STAGES = ['ADMISSION', 'INVESTIGATION', 'PROCEDURE', 'RECOVERY'] as const;

interface JourneyTimelineProps {
  currentStage: string;
  compact?: boolean;
}

export function JourneyTimeline({ currentStage, compact = false }: JourneyTimelineProps) {
  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="flex items-start w-full">
      {STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={stage} className="flex items-start flex-1 min-w-0">
            {/* Connector line — before */}
            {index > 0 && (
              <div
                className={cn(
                  'flex-1 mt-4 h-0.5 shrink-0',
                  compact && 'mt-3',
                  isCompleted || isCurrent ? 'bg-teal-500' : 'bg-slate-200',
                )}
              />
            )}

            {/* Stage node */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              {/* Circle */}
              <div
                className={cn(
                  'flex items-center justify-center rounded-full font-semibold transition-all',
                  compact ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm',
                  isCompleted && 'bg-teal-600 text-white',
                  isCurrent &&
                    'bg-teal-600 text-white ring-2 ring-teal-300 ring-offset-2',
                  isFuture && 'bg-slate-200 text-slate-400',
                )}
              >
                {index + 1}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-center leading-tight',
                  compact ? 'text-xs' : 'text-xs sm:text-sm',
                  isCompleted && 'text-teal-600',
                  isCurrent && 'text-teal-700 font-semibold',
                  isFuture && 'text-slate-400',
                )}
              >
                {getStageLabel(stage)}
              </span>
            </div>

            {/* Connector line — after */}
            {index < STAGES.length - 1 && (
              <div
                className={cn(
                  'flex-1 mt-4 h-0.5 shrink-0',
                  compact && 'mt-3',
                  isCompleted ? 'bg-teal-500' : 'bg-slate-200',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
