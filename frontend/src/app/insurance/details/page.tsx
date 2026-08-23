'use client';

import { useQuery } from '@tanstack/react-query';
import { Shield, FileText, CalendarDays, ShieldOff } from 'lucide-react';
import { getActivePolicy, getPatientPolicies } from '@/lib/api/policyApi';
import type { PolicyResponse } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PolicyDetailsCard } from '@/components/insurance/PolicyDetailsCard';
import { PolicyStatusBadge } from '@/components/insurance/PolicyStatusBadge';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';

const PATIENT_ID = 1;

export default function PolicyDetailsPage() {
  const {
    data: activePolicy,
    isLoading: activePolicyLoading,
    isError: activePolicyError,
    error: activePolicyErr,
    refetch: refetchActive,
  } = useQuery<PolicyResponse, Error>({
    queryKey: ['activePolicy', PATIENT_ID],
    queryFn: () => getActivePolicy(PATIENT_ID),
    retry: false,
  });

  const {
    data: allPolicies,
    isLoading: allPoliciesLoading,
    isError: allPoliciesError,
    refetch: refetchAll,
  } = useQuery<PolicyResponse[], Error>({
    queryKey: ['patientPolicies', PATIENT_ID],
    queryFn: () => getPatientPolicies(PATIENT_ID),
    retry: false,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full space-y-10">
      {/* ── Page header ──────────────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-teal-600" />
          Policy Details
        </h1>
        <p className="text-sm text-slate-500">
          View your active insurance policy and full policy history.
        </p>
      </div>

      {/* ── Active Policy ─────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-800">Active Policy</h2>

        {activePolicyLoading && <ActivePolicySkeleton />}

        {!activePolicyLoading && activePolicyError && (
          // 404 means no active policy — treat as empty rather than error
          isNotFoundError(activePolicyErr) ? (
            <EmptyState
              icon={ShieldOff}
              title="No active policy"
              message="You don't have an active insurance policy yet. Upload one from the Insurance page."
            />
          ) : (
            <ErrorState
              title="Could not load active policy"
              message={activePolicyErr?.message}
              onRetry={refetchActive}
            />
          )
        )}

        {!activePolicyLoading && !activePolicyError && activePolicy && (
          <PolicyDetailsCard policy={activePolicy} />
        )}
      </section>

      {/* ── All Policies ──────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-800">All Policies</h2>

        {allPoliciesLoading && <AllPoliciesSkeleton />}

        {!allPoliciesLoading && allPoliciesError && (
          <ErrorState
            title="Could not load policy history"
            onRetry={refetchAll}
          />
        )}

        {!allPoliciesLoading && !allPoliciesError && allPolicies && allPolicies.length === 0 && (
          <EmptyState
            icon={FileText}
            title="No policies found"
            message="No policies have been uploaded for this patient yet."
          />
        )}

        {!allPoliciesLoading && !allPoliciesError && allPolicies && allPolicies.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Policy History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-slate-100">
                {allPolicies.map((policy: PolicyResponse) => (
                  <PolicyRow key={policy.id} policy={policy} />
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

// ── Policy row ───────────────────────────────────────────────────

function PolicyRow({ policy }: { policy: PolicyResponse }) {
  return (
    <li className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-teal-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {policy.insurerName ?? 'Unknown Insurer'}
          </p>
          {policy.policyType && (
            <p className="text-xs text-slate-500 truncate">{policy.policyType}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <PolicyStatusBadge status={policy.policyStatus} />
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>{formatDate(policy.createdAt)}</span>
        </div>
      </div>
    </li>
  );
}

// ── Skeletons ────────────────────────────────────────────────────

function ActivePolicySkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-3 w-56" />
    </div>
  );
}

function AllPoliciesSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────

function isNotFoundError(err: Error | null): boolean {
  if (!err) return false;
  // ApiClientError exposes status; also check message for 404
  const anyErr = err as Error & { status?: number };
  return anyErr.status === 404 || err.message.includes('404');
}
