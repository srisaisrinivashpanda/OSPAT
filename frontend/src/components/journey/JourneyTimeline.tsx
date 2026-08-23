'use client';

import { Check } from 'lucide-react';
import { cn, formatDate, getStageIndex, getStageLabel } from '@/lib/utils';
import type { JourneyStage } from '@/lib/types';

const STAGES = ['ADMISSION', 'INVESTIGATION', 'PROCEDURE', 'RECOVERY'] as const;

// Stage-specific badge colours for the event history list
const STAGE_BADGE: Record<string, string> = {
  ADMISSION: 'bg-blue-50 text-blue-700 border-blue-200',
  INVESTIGATION: 'bg-purple-50 text-purple-700 border-purple-200',
  PROCEDURE: 'bg-teal-50 text-teal-700 border-teal-200',
  RECOVERY: 'bg-green-50 text-green-700 border-green-200',
};

interface JourneyEvent {
  id: number;
  stage: string;
  description: string;
  timestamp: string;
}

interface JourneyTimelineProps {
  currentStage: JourneyStage;
  events: JourneyEvent[];
}

/** Returns the formatted date of the most-recent event recorded for `stage`. */
function getLastEventDate(events: JourneyEvent[], stage: string): string | null {
  const filtered = events.filter((e) => e.stage === stage);
  if (filtered.length === 0) return null;
  const latest = filtered.reduce((prev, curr) =>
    new Date(curr.timestamp) > new Date(prev.timestamp) ? curr : prev,
  );
  return formatDate(latest.timestamp);
}

export function JourneyTimeline({ currentStage, events }: JourneyTimelineProps) {
  const currentIndex = getStageIndex(currentStage);

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
      {/* ── Horizontal stage strip ── */}
      <div className="flex items-start w-full" role="list" aria-label="Care journey stages">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const stageDate = isCompleted ? getLastEventDate(events, stage) : null;

          return (
            <div
              key={stage}
              role="listitem"
              aria-label={`${getStageLabel(stage)}${isCurrent ? ' — current stage' : isCompleted ? ' — completed' : ' — upcoming'}`}
              className="flex items-start flex-1 min-w-0"
            >
              {/* ── Left connector line ── */}
              {index > 0 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 shrink-0 mt-6 sm:mt-7 transition-colors duration-500',
                    // teal if this stage is completed OR current (i.e. the "from" stage is done)
                    isCompleted || isCurrent ? 'bg-teal-500' : 'bg-slate-200',
                  )}
                />
              )}

              {/* ── Stage node ── */}
              <div className="flex flex-col items-center gap-2 shrink-0 px-1 sm:px-2">
                {/* Circle */}
                <div className="relative flex items-center justify-center">
                  {/* Outer glow ring for the active stage */}
                  {isCurrent && (
                    <span
                      aria-hidden
                      className="absolute rounded-full bg-teal-200/60 w-[72px] h-[72px] sm:w-20 sm:h-20 animate-pulse"
                    />
                  )}

                  <div
                    className={cn(
                      'relative flex items-center justify-center rounded-full font-bold select-none transition-all duration-300',
                      'w-12 h-12 sm:w-14 sm:h-14 text-sm sm:text-base',
                      isCompleted && 'bg-teal-600 text-white shadow-md',
                      isCurrent &&
                        'bg-teal-600 text-white shadow-[0_0_0_4px_white,0_0_0_8px_#99f6e4]',
                      !isCompleted && !isCurrent &&
                        'bg-white border-2 border-slate-300 text-slate-400',
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-xs sm:text-sm text-center leading-tight max-w-[72px] sm:max-w-[88px]',
                    isCompleted && 'text-teal-600 font-medium',
                    isCurrent && 'text-teal-700 font-bold',
                    !isCompleted && !isCurrent && 'text-slate-400 font-normal',
                  )}
                >
                  {getStageLabel(stage)}
                </span>

                {/* Sub-label: completed date / current badge */}
                {isCompleted && stageDate && (
                  <span className="text-[10px] sm:text-xs text-slate-400 text-center">
                    {stageDate}
                  </span>
                )}
                {isCurrent && (
                  <span className="inline-flex items-center rounded-full bg-teal-600 text-white text-[10px] sm:text-xs px-2 py-0.5 font-semibold whitespace-nowrap shadow-sm">
                    Current
                  </span>
                )}
                {!isCompleted && !isCurrent && (
                  <span className="text-[10px] text-slate-300 font-medium">Upcoming</span>
                )}
              </div>

              {/* ── Right connector line ── */}
              {index < STAGES.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 shrink-0 mt-6 sm:mt-7 transition-colors duration-500',
                    // teal only when this stage is fully completed (not just current)
                    isCompleted ? 'bg-teal-500' : 'bg-slate-200',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Event history ── */}
      {sortedEvents.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Journey History
          </h4>
          <ol className="space-y-3">
            {sortedEvents.map((event) => (
              <li key={event.id} className="flex items-start gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-semibold',
                        STAGE_BADGE[event.stage] ?? 'bg-slate-50 text-slate-600 border-slate-200',
                      )}
                    >
                      {getStageLabel(event.stage)}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(event.timestamp)}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-snug">{event.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
