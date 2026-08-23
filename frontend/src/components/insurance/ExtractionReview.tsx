'use client';

import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Loader2, Sparkles, Info } from 'lucide-react';
import { confirmPolicy } from '@/lib/api/policyApi';
import type { ExtractedPolicy, PolicyResponse, PolicyUpdateRequest } from '@/lib/types';
import { formatConfidence } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ExtractionReviewProps {
  extracted: ExtractedPolicy;
  onConfirmed: (policy: PolicyResponse) => void;
  onDiscard: () => void;
}

const schema = z.object({
  insurerName: z.string().min(1, 'Required'),
  policyType: z.string().optional(),
  coverageLimit: z.coerce.number().nonnegative('Must be 0 or greater'),
  roomLimit: z.coerce.number().nonnegative('Must be 0 or greater'),
  roomCategory: z.string().optional(),
  exclusions: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ExtractionReview({
  extracted,
  onConfirmed,
  onDiscard,
}: ExtractionReviewProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      insurerName: extracted.insurerName ?? '',
      policyType: extracted.policyType ?? '',
      coverageLimit: extracted.coverageLimit ?? 0,
      roomLimit: extracted.roomLimit ?? 0,
      roomCategory: extracted.roomCategory ?? '',
      exclusions: extracted.exclusions.join('\n'),
    },
  });

  const { mutate, isPending, isError, error } = useMutation<
    PolicyResponse,
    Error,
    PolicyUpdateRequest
  >({
    mutationFn: (data: PolicyUpdateRequest) => confirmPolicy(extracted.policyId!, data),
    onSuccess: (result: PolicyResponse) => onConfirmed(result),
  });

  function onSubmit(values: FormValues) {
    const exclusionsList = (values.exclusions ?? '')
      .split('\n')
      .map((s: string) => s.trim())
      .filter(Boolean);

    const payload: PolicyUpdateRequest = {
      insurerName: values.insurerName,
      policyType: values.policyType ?? null,
      coverageLimit: values.coverageLimit,
      remainingCoverage: values.coverageLimit,
      roomLimit: values.roomLimit,
      roomCategory: values.roomCategory ?? null,
      confirmed: true,
      exclusions: exclusionsList,
      networkHospitalIds: [],
    };

    mutate(payload);
  }

  // Guard: no policyId means we cannot confirm
  if (extracted.policyId === null) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-800">Cannot activate: policy ID missing.</p>
          <p className="text-sm text-red-600 mt-1">
            The extraction did not return a valid policy ID. Please discard and try uploading again.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={onDiscard}>
            Discard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-teal-600 text-white">
            <Sparkles className="w-3 h-3" />
            AI-extracted information
          </span>
          {extracted.confidence !== null && (
            <span className="text-xs text-teal-700 font-medium">
              Confidence: {formatConfidence(extracted.confidence)}
            </span>
          )}
        </div>
        <p className="text-sm text-teal-800">
          Please review all fields carefully before activating your policy. AI extraction may
          contain errors — you are responsible for verifying accuracy.
        </p>
      </div>

      {/* ── Form ─────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Policy Details
          </h2>

          {/* Insurer Name */}
          <div className="space-y-1.5">
            <Label htmlFor="insurerName">
              Insurer Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="insurerName"
              placeholder="e.g. Star Health Insurance"
              {...register('insurerName')}
            />
            {errors.insurerName && (
              <p className="text-xs text-red-600">{errors.insurerName.message}</p>
            )}
          </div>

          {/* Policy Type */}
          <div className="space-y-1.5">
            <Label htmlFor="policyType">Policy Type</Label>
            <Input
              id="policyType"
              placeholder="e.g. Individual Health, Family Floater"
              {...register('policyType')}
            />
          </div>

          {/* Coverage & Room in two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="coverageLimit">
                Sum Insured (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="coverageLimit"
                type="number"
                min={0}
                step={1000}
                placeholder="e.g. 500000"
                {...register('coverageLimit')}
              />
              {errors.coverageLimit && (
                <p className="text-xs text-red-600">{errors.coverageLimit.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="roomLimit">
                Daily Room Limit (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="roomLimit"
                type="number"
                min={0}
                step={500}
                placeholder="e.g. 3000"
                {...register('roomLimit')}
              />
              {errors.roomLimit && (
                <p className="text-xs text-red-600">{errors.roomLimit.message}</p>
              )}
            </div>
          </div>

          {/* Room Category */}
          <div className="space-y-1.5">
            <Label htmlFor="roomCategory">Room Category</Label>
            <Input
              id="roomCategory"
              placeholder="e.g. Single AC, Semi-Private"
              {...register('roomCategory')}
            />
          </div>

          {/* Exclusions */}
          <div className="space-y-1.5">
            <Label htmlFor="exclusions">
              Exclusions
              <span className="ml-2 text-xs font-normal text-slate-400">
                (one per line — edit freely)
              </span>
            </Label>
            <Textarea
              id="exclusions"
              rows={5}
              placeholder="e.g. Pre-existing conditions&#10;Cosmetic procedures"
              className="resize-y"
              {...register('exclusions')}
            />
          </div>

          {/* Other Constraints — read-only */}
          {extracted.otherConstraints.length > 0 && (
            <div className="space-y-1.5">
              <Label>
                Other Constraints
                <span className="ml-2 text-xs font-normal text-slate-400">(read-only)</span>
              </Label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 space-y-1">
                {extracted.otherConstraints.map((c, i) => (
                  <p key={i}>{c}</p>
                ))}
              </div>
            </div>
          )}

          {/* Network hospitals — informational display */}
          {extracted.networkHospitals.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label>Network Hospitals from Document</Label>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <p className="text-xs text-slate-500 mb-2">
                  Raw text extracted from PDF — hospital IDs are not yet resolved.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {extracted.networkHospitals.slice(0, 10).map((h, i) => (
                    <span
                      key={i}
                      className="inline-block px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs text-slate-600"
                    >
                      {h}
                    </span>
                  ))}
                  {extracted.networkHospitals.length > 10 && (
                    <span className="text-xs text-slate-400 self-center">
                      +{extracted.networkHospitals.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── API error ─────────────────────────────────────────── */}
        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              {error?.message ?? 'Failed to activate policy. Please try again.'}
            </p>
          </div>
        )}

        {/* ── Actions ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button type="submit" disabled={isPending} className="min-w-[160px]">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Activating...
              </>
            ) : (
              'Confirm & Activate'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onDiscard}
          >
            Discard
          </Button>
        </div>
      </form>
    </div>
  );
}
