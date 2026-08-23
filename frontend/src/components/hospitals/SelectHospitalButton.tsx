'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { startJourney } from '@/lib/api/journeyApi';
import type { CareJourney } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface SelectHospitalButtonProps {
  hospitalId: number;
  patientId: number;
  hospitalName: string;
}

export function SelectHospitalButton({
  hospitalId,
  patientId,
  hospitalName,
}: SelectHospitalButtonProps) {
  const router = useRouter();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => startJourney(patientId, hospitalId),
    onSuccess: (journey: CareJourney) => {
      router.push(`/journey/${journey.patientId ?? patientId}`);
    },
  });

  const errorMessage =
    error instanceof Error
      ? error.message
      : isError
      ? 'Failed to start care journey. Please try again.'
      : null;

  return (
    <div className="space-y-2">
      <Button
        size="xl"
        className="w-full gap-2"
        disabled={isPending}
        onClick={() => mutate()}
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Starting care journey…
          </>
        ) : (
          <>
            Select {hospitalName} &amp; Start Care Journey
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>

      {errorMessage && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
