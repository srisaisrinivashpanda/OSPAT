'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  ShieldPlus,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  FileSearch,
} from 'lucide-react';
import { getActivePolicy } from '@/lib/api/policyApi';
import type { ExtractedPolicy, PolicyResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { SamplePolicyButtons } from '@/components/insurance/SamplePolicyButtons';
import { PolicyUploader } from '@/components/insurance/PolicyUploader';
import { ExtractionReview } from '@/components/insurance/ExtractionReview';
import { PolicyDetailsCard } from '@/components/insurance/PolicyDetailsCard';

type FlowState = 'upload' | 'review' | 'confirmed';

const PATIENT_ID = 1;

export default function InsurancePage() {
  const router = useRouter();
  const [flowState, setFlowState] = useState<FlowState>('upload');
  const [extracted, setExtracted] = useState<ExtractedPolicy | null>(null);
  const [confirmedPolicy, setConfirmedPolicy] = useState<PolicyResponse | null>(null);

  const {
    data: activePolicy,
    isLoading: activePolicyLoading,
    refetch: refetchActive,
  } = useQuery<PolicyResponse, Error>({
    queryKey: ['activePolicy', PATIENT_ID],
    queryFn: () => getActivePolicy(PATIENT_ID),
    retry: false,
    // A 404 (no active policy) is expected — treat it as null
    throwOnError: false,
  });

  function handleUploaded(policy: ExtractedPolicy) {
    setExtracted(policy);
    setFlowState('review');
  }

  function handleConfirmed(policy: PolicyResponse) {
    setConfirmedPolicy(policy);
    setFlowState('confirmed');
    refetchActive();
  }

  function handleDiscard() {
    setExtracted(null);
    setFlowState('upload');
  }

  function startFresh() {
    setExtracted(null);
    setConfirmedPolicy(null);
    setFlowState('upload');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full space-y-8">
      {/* ── Page header ──────────────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldPlus className="w-6 h-6 text-teal-600" />
          Insurance
        </h1>
        <p className="text-sm text-slate-500">
          Upload and manage your health insurance policy. AI extraction requires your review
          before activation.
        </p>
      </div>

      {/* ── Upload state ─────────────────────────────────────── */}
      {flowState === 'upload' && (
        <div className="space-y-6">
          {/* Active policy summary (if exists) */}
          {!activePolicyLoading && activePolicy && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-base font-semibold text-slate-800">Current Active Policy</h2>
                <Button variant="outline" size="sm" onClick={startFresh}>
                  <RefreshCw className="w-4 h-4" />
                  Upload new policy
                </Button>
              </div>
              <PolicyDetailsCard policy={activePolicy} />
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm font-medium text-slate-700 mb-4">
                  Upload a replacement policy document below
                </p>
              </div>
            </div>
          )}

          {/* Guidance when no active policy */}
          {!activePolicyLoading && !activePolicy && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <FileSearch className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">No active policy found</p>
                <p className="text-sm text-slate-500 mt-1">
                  Upload your insurance policy document to get started. OSPAT will
                  AI-extract the key details for your review.
                </p>
              </div>
            </div>
          )}

          {/* Sample policy downloads */}
          <SamplePolicyButtons />

          {/* Uploader */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">
              Upload policy document
            </h2>
            <PolicyUploader patientId={PATIENT_ID} onUploaded={handleUploaded} />
          </div>
        </div>
      )}

      {/* ── Review state ─────────────────────────────────────── */}
      {flowState === 'review' && extracted && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-base font-semibold text-slate-800">Review Extracted Policy</h2>
            <Button variant="ghost" size="sm" onClick={handleDiscard}>
              ← Back to upload
            </Button>
          </div>
          <ExtractionReview
            extracted={extracted}
            onConfirmed={handleConfirmed}
            onDiscard={handleDiscard}
          />
        </div>
      )}

      {/* ── Confirmed state ───────────────────────────────────── */}
      {flowState === 'confirmed' && confirmedPolicy && (
        <div className="space-y-6">
          {/* Success banner */}
          <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800">Policy activated successfully</p>
              <p className="text-xs text-green-700 mt-0.5">
                Your policy is now active and will be used for hospital matching and care journey guidance.
              </p>
            </div>
          </div>

          {/* Confirmed policy details */}
          <PolicyDetailsCard policy={confirmedPolicy} />

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button onClick={() => router.push('/hospitals')}>
              Find Hospitals
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={startFresh}>
              Upload another policy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
