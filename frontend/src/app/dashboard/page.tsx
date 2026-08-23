'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';

import { getDashboard } from '@/lib/api/dashboardApi';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { PatientContextCard } from '@/components/dashboard/PatientContextCard';
import { InsuranceSummaryCards } from '@/components/dashboard/InsuranceSummaryCards';
import { JourneyTimeline } from '@/components/dashboard/JourneyTimeline';
import { StageIntelligenceCard } from '@/components/dashboard/StageIntelligenceCard';
import { AlertsCard } from '@/components/dashboard/AlertsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PATIENT_ID = 1;

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', PATIENT_ID],
    queryFn: () => getDashboard(PATIENT_ID),
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          title="Unable to load dashboard"
          message="We could not retrieve your patient summary. Please check the service is running and try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { activeJourney, currentStageGuidance, recentAlerts, recommendedActions } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Patient overview and care intelligence</p>
      </div>

      {/* Patient context */}
      <PatientContextCard data={data} />

      {/* Insurance metrics */}
      <InsuranceSummaryCards data={data} />

      {/* Main content grid */}
      {activeJourney ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — timeline + stage intelligence */}
          <div className="lg:col-span-2 space-y-5">
            {/* Journey timeline */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Care Journey</CardTitle>
                  <Link
                    href="/journey/1"
                    className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    View details →
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <JourneyTimeline currentStage={activeJourney.currentStage} />
              </CardContent>
            </Card>

            {/* Stage intelligence */}
            {currentStageGuidance ? (
              <StageIntelligenceCard guidance={currentStageGuidance} />
            ) : null}
          </div>

          {/* Right — alerts + quick actions */}
          <div className="space-y-5">
            <AlertsCard alerts={recentAlerts} actions={recommendedActions} />
            <QuickActions />
          </div>
        </div>
      ) : (
        /* No active journey */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <EmptyState
                icon={Building2}
                title="No active care journey"
                message="You do not have an active hospital admission journey. Find a compatible hospital to get started."
                action={
                  <Link
                    href="/hospitals"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Building2 className="w-4 h-4" />
                    Find Compatible Hospitals
                  </Link>
                }
              />
            </Card>
          </div>

          <div className="space-y-5">
            <AlertsCard alerts={recentAlerts} actions={recommendedActions} />
            <QuickActions />
          </div>
        </div>
      )}
    </div>
  );
}
