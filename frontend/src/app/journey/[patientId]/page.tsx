'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, MapPin, Calendar, Activity, Route } from 'lucide-react';

import { getJourney, getJourneyContext } from '@/lib/api/journeyApi';
import { ApiClientError } from '@/lib/api/client';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { JourneySkeleton } from '@/components/journey/JourneySkeleton';
import { JourneyTimeline } from '@/components/journey/JourneyTimeline';
import { CurrentStagePanel } from '@/components/journey/CurrentStagePanel';
import { StageProgressButton } from '@/components/journey/StageProgressButton';
import { CaregiverQuestions } from '@/components/journey/CaregiverQuestions';
import { DocumentChecklist } from '@/components/journey/DocumentChecklist';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';

export default function JourneyPage() {
  const params = useParams();
  const patientId = parseInt(params.patientId as string, 10);
  const queryClient = useQueryClient();

  // ── Fetch care journey by PATIENT ID ──
  const {
    data: journey,
    isLoading: journeyLoading,
    error: journeyError,
    refetch: refetchJourney,
  } = useQuery({
    queryKey: ['journey', patientId],
    queryFn: () => getJourney(patientId),
    enabled: !isNaN(patientId),
    refetchOnWindowFocus: true,
  });

  // ── Fetch journey context by JOURNEY ID (only once journey is loaded) ──
  const {
    data: context,
    isLoading: contextLoading,
    error: contextError,
    refetch: refetchContext,
  } = useQuery({
    queryKey: ['journeyContext', journey?.id],
    queryFn: () => getJourneyContext(journey!.id),
    enabled: journey != null,
    refetchOnWindowFocus: true,
  });

  // ── Invalidate both queries after a stage advance ──
  const handleStageUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['journey', patientId] });
    if (journey?.id != null) {
      queryClient.invalidateQueries({ queryKey: ['journeyContext', journey.id] });
    }
  };

  // ── Loading ──
  const isLoading = journeyLoading || (journey != null && contextLoading);
  if (isLoading) {
    return <JourneySkeleton />;
  }

  // ── Journey fetch errors ──
  if (journeyError) {
    const is404 =
      journeyError instanceof ApiClientError && journeyError.status === 404;

    if (is404) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <EmptyState
            icon={Route}
            title="No active care journey"
            message="There is no active care journey for this patient. Select a hospital to begin."
            action={
              <Button asChild>
                <Link href="/hospitals">Select a hospital to start your journey</Link>
              </Button>
            }
          />
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorState onRetry={() => refetchJourney()} />
      </div>
    );
  }

  if (!journey) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* ── Page header ── */}
      <header className="space-y-1.5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Care Journey</h1>
        <p className="text-base font-semibold text-slate-700">{journey.patientName}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            {journey.hospitalName}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {journey.hospitalLocation}
          </span>
        </div>
      </header>

      {/* ── Journey timeline — full width, most important screen ── */}
      <JourneyTimeline
        currentStage={journey.currentStage}
        events={journey.events}
      />

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2/3 — stage intelligence panel */}
        <div className="lg:col-span-2">
          {contextError ? (
            <ErrorState
              title="Stage guidance unavailable"
              message="Could not load guidance for this stage. Please retry."
              onRetry={() => refetchContext()}
            />
          ) : context ? (
            <CurrentStagePanel context={context} />
          ) : (
            // Context is still loading (rare: journey loaded but context not yet)
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 flex items-center justify-center">
              <p className="text-sm text-slate-400">Loading stage guidance…</p>
            </div>
          )}
        </div>

        {/* Right 1/3 — actions + checklists + summary */}
        <div className="space-y-4">
          {/* Advance stage */}
          <StageProgressButton
            journeyId={journey.id}
            currentStage={journey.currentStage}
            onStageUpdated={handleStageUpdated}
          />

          {/* Document checklist + caregiver questions (only when context loaded) */}
          {context && (
            <>
              <DocumentChecklist
                documents={context.currentStageGuidance.requiredDocuments}
              />
              <CaregiverQuestions
                questions={context.currentStageGuidance.caregiverQuestionsToAsk}
              />
            </>
          )}

          {/* Journey summary card */}
          <Card>
            <CardContent className="py-5 space-y-3">
              <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Journey Summary
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-700 leading-snug">
                    {journey.hospitalName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-500">
                    Started {formatDate(journey.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-500">
                    {journey.events.length} recorded event
                    {journey.events.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
