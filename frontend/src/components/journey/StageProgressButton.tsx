'use client';

import { ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { updateJourneyStage } from '@/lib/api/journeyApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getNextStage, getStageLabel } from '@/lib/utils';
import type { JourneyStage } from '@/lib/types';

interface StageProgressButtonProps {
  journeyId: number;
  currentStage: JourneyStage;
  onStageUpdated: () => void;
}

export function StageProgressButton({
  journeyId,
  currentStage,
  onStageUpdated,
}: StageProgressButtonProps) {
  const nextStage = getNextStage(currentStage);

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: () => {
      if (!nextStage) throw new Error('No next stage available');
      return updateJourneyStage(journeyId, { stage: nextStage, note: null });
    },
    onSuccess: () => {
      onStageUpdated();
    },
  });

  // ── Journey complete state ──
  if (!nextStage) {
    return (
      <Card>
        <CardContent className="py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Journey Complete</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                All care stages have been recorded.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Advance stage state ──
  return (
    <Card>
      <CardContent className="py-5 space-y-3">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          Next Stage
        </p>

        <Button
          className="w-full"
          size="lg"
          onClick={() => {
            reset();
            mutate();
          }}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          {isPending ? 'Advancing…' : `Advance to ${getStageLabel(nextStage)}`}
        </Button>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Advancing the stage will update your care journey record.
        </p>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700 leading-snug">
              {error instanceof Error
                ? error.message
                : 'Failed to advance stage. Please try again.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
