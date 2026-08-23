import Link from 'next/link';
import { MapPin, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import type { HospitalMatchResult } from '@/lib/types';
import {
  cn,
  getScoreRatingLabel,
  getScoreRatingColor,
  getNetworkStatusLabel,
  getNetworkStatusColor,
} from '@/lib/utils';
import { ScoreBreakdown } from './ScoreBreakdown';
import { Badge } from '@/components/ui/badge';

interface HospitalCardProps {
  result: HospitalMatchResult;
  onSelect?: () => void;
  selected?: boolean;
}

function ScoreCircle({
  score,
  rating,
}: {
  score: number;
  rating: HospitalMatchResult['scoreRating'];
}) {
  const colorClass =
    rating === 'HIGH_COMPATIBILITY'
      ? 'text-green-600 border-green-300 bg-green-50'
      : rating === 'MODERATE_COMPATIBILITY'
      ? 'text-amber-600 border-amber-300 bg-amber-50'
      : 'text-red-600 border-red-300 bg-red-50';

  const labelColorClass = getScoreRatingColor(rating);

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div
        className={cn(
          'w-20 h-20 rounded-full border-4 flex items-center justify-center',
          colorClass,
        )}
      >
        <span className="text-2xl font-bold leading-none tabular-nums">{score}</span>
      </div>
      <span className={cn('text-[10px] font-semibold text-center leading-tight max-w-[76px]', labelColorClass)}>
        {getScoreRatingLabel(rating)}
      </span>
    </div>
  );
}

export function HospitalCard({ result, onSelect, selected }: HospitalCardProps) {
  const {
    hospitalId,
    hospitalName,
    location,
    networkStatus,
    compatibilityScore,
    scoreRating,
    networkScore,
    roomScore,
    specialtyScore,
    policyConstraintScore,
    totalScore,
    matchingFactors,
    considerations,
  } = result;

  const visibleConsiderations = considerations.slice(0, 3);
  const hiddenCount = considerations.length - visibleConsiderations.length;

  const networkColorClass = getNetworkStatusColor(networkStatus);

  return (
    <div
      className={cn(
        'bg-white border rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:border-teal-200 flex flex-col gap-4',
        selected ? 'border-teal-400 ring-2 ring-teal-100 shadow-md' : 'border-slate-200',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-semibold text-slate-800 leading-snug">{hospitalName}</h3>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
              networkColorClass,
            )}
          >
            {getNetworkStatusLabel(networkStatus)}
          </span>
        </div>
        <ScoreCircle score={compatibilityScore} rating={scoreRating} />
      </div>

      {/* Score breakdown */}
      <div className="border-t border-slate-100 pt-3">
        <ScoreBreakdown
          networkScore={networkScore}
          roomScore={roomScore}
          specialtyScore={specialtyScore}
          policyConstraintScore={policyConstraintScore}
          totalScore={totalScore}
          compact
        />
      </div>

      {/* Matching factors */}
      {matchingFactors.length > 0 && (
        <div className="space-y-1">
          {matchingFactors.map((factor, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-green-700">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-green-500" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      )}

      {/* Considerations */}
      {visibleConsiderations.length > 0 && (
        <div className="space-y-1">
          {visibleConsiderations.map((consideration, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
              <span>{consideration}</span>
            </div>
          ))}
          {hiddenCount > 0 && (
            <p className="text-xs text-slate-400 pl-5">
              ... +{hiddenCount} more consideration{hiddenCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-auto">
        <Link
          href={`/hospitals/${hospitalId}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline transition-colors"
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        {onSelect && (
          <button
            onClick={onSelect}
            className={cn(
              'ml-auto text-sm font-medium px-3 py-1.5 rounded-lg transition-colors',
              selected
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'border border-teal-200 text-teal-700 hover:bg-teal-50',
            )}
          >
            {selected ? 'Selected' : 'Select Hospital'}
          </button>
        )}
      </div>
    </div>
  );
}
