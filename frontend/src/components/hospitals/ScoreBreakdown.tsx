import { cn } from '@/lib/utils';

interface ScoreBreakdownProps {
  networkScore: number;
  roomScore: number;
  specialtyScore: number;
  policyConstraintScore: number;
  totalScore: number;
  compact?: boolean;
}

interface ScoreRowProps {
  label: string;
  score: number;
  max: number;
  compact?: boolean;
}

function ScoreRow({ label, score, max, compact }: ScoreRowProps) {
  const pct = Math.min(100, Math.round((score / max) * 100));
  const isFull = score === max;

  return (
    <div className={cn('flex items-center gap-2', compact ? 'gap-1.5' : 'gap-3')}>
      <span
        className={cn(
          'text-slate-500 shrink-0 text-right',
          compact ? 'text-[10px] w-16' : 'text-xs w-20',
        )}
      >
        {label}
      </span>
      <div className={cn('flex-1 bg-slate-100 rounded-full overflow-hidden', compact ? 'h-1.5' : 'h-2')}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isFull ? 'bg-teal-500' : 'bg-amber-400',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={cn('shrink-0 tabular-nums font-medium text-slate-600', compact ? 'text-[10px] w-8' : 'text-xs w-10')}>
        {score}/{max}
      </span>
    </div>
  );
}

export function ScoreBreakdown({
  networkScore,
  roomScore,
  specialtyScore,
  policyConstraintScore,
  totalScore,
  compact = false,
}: ScoreBreakdownProps) {
  return (
    <div className={cn('space-y-1.5', compact ? 'space-y-1' : 'space-y-2')}>
      {!compact && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Score Breakdown
          </span>
          <span className="text-sm font-bold text-slate-800">
            {totalScore}
            <span className="text-xs font-normal text-slate-400">/100</span>
          </span>
        </div>
      )}
      <ScoreRow label="Network" score={networkScore} max={40} compact={compact} />
      <ScoreRow label="Room" score={roomScore} max={30} compact={compact} />
      <ScoreRow label="Specialty" score={specialtyScore} max={20} compact={compact} />
      <ScoreRow label="Policy" score={policyConstraintScore} max={10} compact={compact} />
    </div>
  );
}
