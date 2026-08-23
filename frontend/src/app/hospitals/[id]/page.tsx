'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Stethoscope,
  Home,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { getHospital, matchHospitals } from '@/lib/api/hospitalApi';
import type { HospitalMatchResult, RoomCategory } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { ScoreBreakdown } from '@/components/hospitals/ScoreBreakdown';
import { RoomComparisonTable } from '@/components/hospitals/RoomComparisonTable';
import { AIExplanationCard } from '@/components/hospitals/AIExplanationCard';
import { SelectHospitalButton } from '@/components/hospitals/SelectHospitalButton';
import {
  cn,
  formatCurrency,
  getNetworkStatusLabel,
  getNetworkStatusColor,
  getScoreRatingLabel,
  getScoreRatingColor,
} from '@/lib/utils';

const PATIENT_ID = 1;

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-5 w-32" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-36 rounded-full" />
      </div>
      <Skeleton className="h-10 w-80 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function HospitalDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const hospitalId = Number(rawId);

  const {
    data: hospital,
    isLoading: hospitalLoading,
    isError: hospitalError,
    refetch: refetchHospital,
  } = useQuery({
    queryKey: ['hospital', hospitalId],
    queryFn: () => getHospital(hospitalId),
    enabled: !isNaN(hospitalId),
  });

  const { data: allMatchResults, isLoading: matchLoading } = useQuery({
    queryKey: ['hospitals', 'match', { patientId: PATIENT_ID }],
    queryFn: () => matchHospitals({ patientId: PATIENT_ID }),
  });

  const matchResult = allMatchResults?.find((r: HospitalMatchResult) => r.hospitalId === hospitalId) ?? null;

  const isLoading = hospitalLoading || matchLoading;

  if (isLoading) return <DetailSkeleton />;
  if (hospitalError || !hospital) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorState onRetry={() => refetchHospital()} />
      </div>
    );
  }

  const networkColorClass = getNetworkStatusColor(hospital.networkStatus);
  const scoreColorClass = matchResult ? getScoreRatingColor(matchResult.scoreRating) : '';

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Back link */}
      <Link
        href="/hospitals"
        className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 hover:underline transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All Hospitals
      </Link>

      {/* Hospital header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">{hospital.name}</h1>
        <div className="flex items-center gap-1.5 text-slate-500">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>{hospital.location}</span>
        </div>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
            networkColorClass,
          )}
        >
          {getNetworkStatusLabel(hospital.networkStatus)}
        </span>
      </div>

      {/* Description */}
      {hospital.description && (
        <p className="text-slate-600 leading-relaxed max-w-3xl">{hospital.description}</p>
      )}

      {/* Tabs */}
      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList className="h-auto flex-wrap gap-1 bg-slate-100 p-1 w-full sm:w-auto">
          <TabsTrigger value="rooms">Room Compatibility</TabsTrigger>
          <TabsTrigger value="policy">Policy Match</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {/* ── Room Compatibility tab ── */}
        <TabsContent value="rooms">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-slate-800">Room Compatibility</h2>

            {matchResult ? (
              <RoomComparisonTable
                roomEvaluations={matchResult.roomEvaluations}
                policyRoomLimit={matchResult.lowestEligibleRoomCost}
              />
            ) : (
              /* Fallback: raw room data without compatibility analysis */
              <div className="space-y-3">
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Compatibility analysis is not available — showing indicative room rates only.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Room Category
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Daily Rate
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Availability
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {hospital.roomCategories.map((room: RoomCategory) => (
                        <tr key={room.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-700 font-medium">{room.name}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                            {formatCurrency(room.dailyCost)}
                            <span className="text-xs text-slate-400">/day</span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                room.available
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-slate-100 text-slate-500',
                              )}
                            >
                              {room.available ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-400 italic">
                  Indicative costs — verify with hospital.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Policy Match tab ── */}
        <TabsContent value="policy">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: breakdown + factors */}
            <div className="lg:col-span-2 space-y-5">
              {matchResult ? (
                <>
                  {/* Score card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-semibold text-slate-800">
                          Policy Compatibility Score
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Based on network status, room coverage, and specialty alignment.
                        </p>
                      </div>
                      {/* Large score circle */}
                      <div
                        className={cn(
                          'flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 shrink-0',
                          matchResult.scoreRating === 'HIGH_COMPATIBILITY'
                            ? 'border-green-300 bg-green-50'
                            : matchResult.scoreRating === 'MODERATE_COMPATIBILITY'
                            ? 'border-amber-300 bg-amber-50'
                            : 'border-red-300 bg-red-50',
                        )}
                      >
                        <span className={cn('text-3xl font-bold', scoreColorClass)}>
                          {matchResult.compatibilityScore}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                    </div>

                    <div className={cn('text-sm font-semibold', scoreColorClass)}>
                      {getScoreRatingLabel(matchResult.scoreRating)}
                    </div>

                    <ScoreBreakdown
                      networkScore={matchResult.networkScore}
                      roomScore={matchResult.roomScore}
                      specialtyScore={matchResult.specialtyScore}
                      policyConstraintScore={matchResult.policyConstraintScore}
                      totalScore={matchResult.totalScore}
                    />
                  </div>

                  {/* Matching factors */}
                  {matchResult.matchingFactors.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700">Matching Factors</h3>
                      <ul className="space-y-2">
                        {matchResult.matchingFactors.map((factor: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Considerations */}
                  {matchResult.considerations.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700">Considerations</h3>
                      <ul className="space-y-2">
                        {matchResult.considerations.map((c: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI Explanation */}
                  <AIExplanationCard hospitalId={hospitalId} policyId={null} />
                </>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
                  No policy compatibility data available for this hospital.
                </div>
              )}
            </div>

            {/* Right: Select hospital CTA */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-700">
                  Ready to proceed?
                </h3>
                <p className="text-xs text-slate-500">
                  Starting a care journey records this hospital as your intended destination
                  and begins progress tracking.
                </p>
                <SelectHospitalButton
                  hospitalId={hospitalId}
                  patientId={PATIENT_ID}
                  hospitalName={hospital.name}
                />
              </div>

              {/* Caregiver summary */}
              {matchResult?.caregiverSummary && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Caregiver Summary
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {matchResult.caregiverSummary}
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── About tab ── */}
        <TabsContent value="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Address & network */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                Location &amp; Network
              </h2>
              <div className="space-y-2 text-sm text-slate-600">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Address
                  </span>
                  <p className="mt-0.5">{hospital.address || hospital.location}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Network Status
                  </span>
                  <div className="mt-1">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        networkColorClass,
                      )}
                    >
                      {getNetworkStatusLabel(hospital.networkStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-slate-400" />
                Specialties
              </h2>
              {hospital.specialties.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((spec: string) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No specialties listed.</p>
              )}
            </div>

            {/* Room categories */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 lg:col-span-2">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Home className="w-4 h-4 text-slate-400" />
                Room Categories
              </h2>
              {hospital.roomCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {hospital.roomCategories.map((room: RoomCategory) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between gap-2 border border-slate-200 rounded-lg px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-700">{room.name}</p>
                        <p className="text-xs text-slate-400 tabular-nums">
                          {formatCurrency(room.dailyCost)}/day
                        </p>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-medium rounded-full px-2 py-0.5',
                          room.available
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-400',
                        )}
                      >
                        {room.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No room data available.</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
