'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import TopNavBar from '@/components/layout/TopNavBar';
import GlobalFooter from '@/components/layout/GlobalFooter';
import { api } from '@/lib/api/apiClient';
import { HospitalDto, HospitalMatchResultDto, PolicyResponseDto, AIExplainResponseDto } from '@/lib/types';

export default function HospitalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hospitalId = Number(params?.id);

  const [hospital, setHospital] = useState<HospitalDto | null>(null);
  const [matchResult, setMatchResult] = useState<HospitalMatchResultDto | null>(null);
  const [policy, setPolicy] = useState<PolicyResponseDto | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AIExplainResponseDto | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [journeyCreating, setJourneyCreating] = useState(false);

  useEffect(() => {
    if (!hospitalId) return;

    async function loadData() {
      try {
        setLoading(true);
        const [hData, allMatches, activePolicy] = await Promise.all([
          api.getHospitalById(hospitalId),
          api.matchHospitals({ patientId: 1 }),
          api.getActivePolicy(1),
        ]);

        setHospital(hData);
        setPolicy(activePolicy);

        const currentMatch = allMatches.find((m) => m.hospitalId === hospitalId);
        if (currentMatch) {
          setMatchResult(currentMatch);
          if (currentMatch.roomEvaluations && currentMatch.roomEvaluations.length > 0) {
            setSelectedRoomId(currentMatch.roomEvaluations[0].roomId);
          }
        } else if (hData && hData.roomCategories && hData.roomCategories.length > 0) {
          setSelectedRoomId(hData.roomCategories[0].id);
        }

        // Fetch AI plain-language explanation
        const explainRes = await api.explainMatchOrStage({
          hospitalId: hospitalId,
          policyId: activePolicy?.id,
        });
        setAiExplanation(explainRes);
      } catch (e) {
        console.warn('Failed to load hospital details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [hospitalId]);

  const handleSelectForAdmission = async () => {
    try {
      setJourneyCreating(true);
      await api.createOrUpdateJourney(1, hospitalId);
      router.push('/journey');
    } catch (e: any) {
      alert(`Failed to start care journey: ${e.message}`);
      setJourneyCreating(false);
    }
  };

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  if (loading) {
    return (
      <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
        <TopNavBar />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface-variant">Loading hospital details & room matrix...</p>
          </div>
        </main>
        <GlobalFooter />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
        <TopNavBar />
        <main className="flex-grow max-w-container-max mx-auto px-margin-desktop py-20 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Hospital Not Found</h2>
          <NextLink href="/hospitals" className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
            Back to Hospitals
          </NextLink>
        </main>
        <GlobalFooter />
      </div>
    );
  }

  const score = matchResult?.compatibilityScore ?? 86;
  const isHigh = score >= 80;
  const isMod = score >= 60 && score < 80;
  const scoreRating = matchResult?.scoreRating
    ? matchResult.scoreRating.replace('_', ' ')
    : isHigh
    ? 'High compatibility'
    : isMod
    ? 'Moderate compatibility'
    : 'Low compatibility';

  const displayRooms =
    matchResult?.roomEvaluations && matchResult.roomEvaluations.length > 0
      ? matchResult.roomEvaluations.map((r) => ({
          id: r.roomId,
          name: r.roomName,
          dailyRate: r.dailyCost,
          available: r.available,
          advisoryNote: r.advisoryNote,
          compatibilityStatus: r.compatibilityStatus,
        }))
      : hospital?.roomCategories && hospital.roomCategories.length > 0
      ? hospital.roomCategories.map((r) => ({
          id: r.id,
          name: r.categoryName,
          dailyRate: r.dailyRate,
          available: r.available,
          advisoryNote: r.description,
          compatibilityStatus: ((policy?.roomLimit && r.dailyRate <= policy.roomLimit)
            ? 'WITHIN_STATED_LIMIT'
            : 'POLICY_CONSIDERATION') as any,
        }))
      : [];

  const selectedRoom = displayRooms.find((r) => r.id === selectedRoomId) || displayRooms[0];
  const policyRoomLimit = policy?.roomLimit;
  const hasPolicyLimit = typeof policyRoomLimit === 'number' && !isNaN(policyRoomLimit) && policyRoomLimit > 0;
  const difference = hasPolicyLimit && selectedRoom ? selectedRoom.dailyRate - policyRoomLimit : 0;
  const isWithinLimit = hasPolicyLimit && difference <= 0;
  const isAboveLimit = hasPolicyLimit && difference > 0;

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-grow w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col gap-6 md:gap-8">
        {/* Back Context Bar */}
        <div className="flex items-center gap-2">
          <NextLink
            href="/hospitals"
            className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to hospitals
          </NextLink>
        </div>

        {/* Hospital Title Section (Full Width Header) */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border-subtle bg-surface-container-lowest rounded-2xl p-6 border card-shadow">
          <div className="flex flex-col gap-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-label-caps text-xs text-primary font-bold uppercase tracking-wider">
              <span>Facility Profile</span>
              <span>·</span>
              <span className="text-on-surface-variant font-medium">OSPAT Intelligence Verified</span>
            </div>
            <h1 className="font-display-hero text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold tracking-tight">
              {hospital.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-label-sm text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                {hospital.location}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold ${
                  matchResult?.networkStatus === 'IN_NETWORK'
                    ? 'text-status-safe bg-status-safe/10'
                    : 'text-status-warning bg-status-warning/10'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    matchResult?.networkStatus === 'IN_NETWORK' ? 'bg-status-safe' : 'bg-status-warning'
                  }`}
                ></span>
                {matchResult?.networkStatus === 'IN_NETWORK' ? 'In Network for Cashless' : 'Out of Network (Reimbursement)'}
              </span>
              <span className="inline-flex items-center gap-1 text-on-surface-variant bg-surface-container px-3 py-1 rounded-full font-medium">
                <span className="material-symbols-outlined text-[14px]">hotel</span>
                {matchResult?.hasEligibleRoom ? 'Rooms within stated limit' : 'Room rent advisory applies'}
              </span>
            </div>
          </div>

          {/* Compatibility Score Widget */}
          <div className="bg-surface rounded-xl p-4 border border-border-subtle flex items-center gap-4 min-w-[220px] shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-highest stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3.5"
                />
                <path
                  className="text-primary-container stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray={`${score}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute font-metric-value text-xl font-bold text-primary-container">
                {score}
              </span>
            </div>
            <div>
              <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-0.5 font-semibold">
                Match Score
              </div>
              <div className="font-body-md text-sm font-bold text-primary-container">
                {scoreRating}
              </div>
              <div className="text-[11px] text-on-surface-variant">Deterministic Score</div>
            </div>
          </div>
        </section>

        {/* Top Decision Grid: Main Content (8 cols) & Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Decision-Support Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Why this hospital fits */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow flex flex-col gap-5">
              <div>
                <h2 className="font-headline-lg text-lg md:text-xl text-on-surface font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">lightbulb</span>
                  Why this hospital fits your policy
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                  Based on your active policy limits ({policy?.insurerName || 'Active Insurance'}) and hospital room tariffs, this facility was evaluated across 4 objective parameters:
                </p>
              </div>

              {/* 4 Factor Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border-subtle">
                <div className="p-3 bg-surface rounded-xl border border-border-subtle flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-on-surface-variant">Network (40%)</span>
                  <span className="font-body-md text-sm font-bold text-status-safe">
                    {matchResult?.networkScore ?? 40} / 40
                  </span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border-subtle flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-on-surface-variant">Room Rent (30%)</span>
                  <span className="font-body-md text-sm font-bold text-status-safe">
                    {matchResult?.roomScore ?? 30} / 30
                  </span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border-subtle flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-on-surface-variant">Specialty (20%)</span>
                  <span className="font-body-md text-sm font-bold text-status-warning">
                    {matchResult?.specialtyScore ?? 16} / 20
                  </span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border-subtle flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-on-surface-variant">Policy Rules (10%)</span>
                  <span className="font-body-md text-sm font-bold text-status-safe">
                    {matchResult?.policyConstraintScore ?? 8} / 10
                  </span>
                </div>
              </div>

              {/* Plain-Language Caregiver Summary */}
              {(aiExplanation || matchResult?.caregiverSummary) && (
                <div className="pt-4 border-t border-border-subtle bg-primary-fixed/10 p-4 rounded-xl border border-primary-fixed/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">psychology</span>
                    <h4 className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider">
                      Caregiver Summary ({aiExplanation?.providerUsed ? `Powered by ${aiExplanation.providerUsed}` : 'Decision Support'})
                    </h4>
                  </div>
                  <p className="font-body-md text-xs md:text-sm text-on-surface leading-relaxed">
                    {aiExplanation?.explanation || matchResult?.caregiverSummary}
                  </p>
                  <p className="text-[10px] text-on-surface-variant italic mt-1.5">
                    {aiExplanation?.disclaimer || 'Indicative summary for decision support only.'}
                  </p>
                </div>
              )}
            </section>

            {/* Interactive "Choose your room" Cost & Policy Limit Simulator */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow flex flex-col gap-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-headline-lg text-lg md:text-xl text-on-surface font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">bed</span>
                    Choose your room
                  </h2>
                  {hasPolicyLimit ? (
                    <span className="font-label-sm text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                      Your Policy Cap: {formatCurrency(policyRoomLimit)}/day
                    </span>
                  ) : (
                    <span className="font-label-sm text-xs bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-semibold">
                      Policy Cap: Unavailable
                    </span>
                  )}
                </div>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                  Select an available room category to instantly check tariff eligibility, cost differences, and proportionate deduction risks against your policy.
                </p>
              </div>

              {/* Room Cards Selector (Fills wide grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {displayRooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  const roomDiff = hasPolicyLimit ? room.dailyRate - policyRoomLimit : 0;
                  const roomWithin = hasPolicyLimit && roomDiff <= 0;

                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                          : 'border-border-subtle hover:border-primary/40 bg-surface'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-semibold text-sm leading-snug ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                            {room.name}
                          </h3>
                          {isSelected && (
                            <span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>
                          )}
                        </div>
                        <div className="font-headline-lg text-base font-bold text-primary mt-1">
                          {formatCurrency(room.dailyRate)}{' '}
                          <span className="text-xs font-normal text-on-surface-variant">/ day</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs">
                        {hasPolicyLimit ? (
                          roomWithin ? (
                            <span className="inline-flex items-center gap-1 text-status-safe font-medium text-[11px]">
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              ✓ Within limit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-status-warning font-medium text-[11px]">
                              <span className="material-symbols-outlined text-sm">warning</span>
                              ⚠ Above limit
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 text-on-surface-variant font-medium text-[11px]">
                            <span className="material-symbols-outlined text-sm">help</span>
                            Unavailable
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Policy Comparison Breakdown Box */}
              {selectedRoom && (
                <div className="bg-surface-container-low rounded-xl p-5 border border-border-subtle flex flex-col gap-4 transition-all duration-200">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <h4 className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                      Live Policy Comparison · {selectedRoom.name}
                    </h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isAboveLimit
                          ? 'bg-status-warning/15 text-status-warning'
                          : isWithinLimit
                          ? 'bg-status-safe/15 text-status-safe'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {isAboveLimit ? 'Above limit' : isWithinLimit ? 'Within limit' : 'Check schedule'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-surface rounded-lg border border-border-subtle">
                      <div className="font-label-sm text-xs text-on-surface-variant">Policy Room Limit</div>
                      <div className="font-headline-lg text-base font-bold text-on-surface mt-0.5">
                        {hasPolicyLimit ? `${formatCurrency(policyRoomLimit)} / day` : 'Unavailable'}
                      </div>
                    </div>

                    <div className="p-3 bg-surface rounded-lg border border-border-subtle">
                      <div className="font-label-sm text-xs text-on-surface-variant">Selected Room Tariff</div>
                      <div className="font-headline-lg text-base font-bold text-primary mt-0.5">
                        {formatCurrency(selectedRoom.dailyRate)} / day
                      </div>
                    </div>

                    <div className="p-3 bg-surface rounded-lg border border-border-subtle">
                      <div className="font-label-sm text-xs text-on-surface-variant">
                        {isAboveLimit ? 'Difference' : isWithinLimit ? 'Coverage Status' : 'Status'}
                      </div>
                      <div
                        className={`font-headline-lg text-base font-bold mt-0.5 ${
                          isAboveLimit
                            ? 'text-status-warning'
                            : isWithinLimit
                            ? 'text-status-safe'
                            : 'text-on-surface'
                        }`}
                      >
                        {isAboveLimit
                          ? `+${formatCurrency(difference)} / day`
                          : isWithinLimit
                          ? `${formatCurrency(0)} / day (Covered)`
                          : 'Check schedule'}
                      </div>
                    </div>
                  </div>

                  {/* Financial Safety Advisory Banner */}
                  {isAboveLimit ? (
                    <div className="p-4 rounded-xl bg-status-warning/10 border border-status-warning/30 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-status-warning font-bold text-xs">
                        <span className="material-symbols-outlined text-base">warning</span>
                        ⚠ {formatCurrency(difference)}/day above your policy limit
                      </div>
                      <p className="text-xs text-on-surface leading-relaxed">
                        Additional deductions may apply depending on your policy terms.
                      </p>
                      <div className="pt-2 border-t border-status-warning/20">
                        <p className="text-xs text-on-surface font-semibold">
                          ⚠ Proportionate deduction may apply
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                          Choosing a room above your eligible limit can affect how certain hospitalization charges are reimbursed. Review your policy terms before choosing this room.
                        </p>
                      </div>
                    </div>
                  ) : isWithinLimit ? (
                    <div className="p-4 rounded-xl bg-status-safe/10 border border-status-safe/30 flex items-start gap-3">
                      <span className="material-symbols-outlined text-status-safe text-lg shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <div>
                        <p className="text-xs text-status-safe font-bold">
                          ✓ Within your policy&apos;s room limit
                        </p>
                        <p className="text-xs text-on-surface mt-0.5 leading-relaxed">
                          Your selected room ({selectedRoom.name}) is within the {formatCurrency(policyRoomLimit)}/day room limit. No proportionate deduction applies for room rent.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-surface-container border border-border-subtle flex items-start gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant text-lg shrink-0 mt-0.5">
                        help
                      </span>
                      <div>
                        <p className="text-xs text-on-surface font-bold">
                          Room limit unavailable
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                          Check your policy schedule before choosing a room to verify applicable daily caps.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar Column (Sticky on Desktop) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-20">
            {/* Planned Admission Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">event_available</span>
                <h3 className="font-headline-lg text-lg text-primary font-bold">
                  Planned Admission?
                </h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Selecting this hospital initiates your structured care roadmap, linking cashless pre-authorization, TPA checklists, and discharge guidelines.
              </p>
              <button
                onClick={handleSelectForAdmission}
                disabled={journeyCreating}
                className="w-full bg-primary-container text-on-primary py-3 rounded-full text-sm font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {journeyCreating ? 'Starting Care Journey...' : 'Select for Admission →'}
              </button>
            </div>

            {/* Hospital Contacts Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow space-y-4 text-xs">
              <h3 className="font-headline-lg text-base text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">contacts</span>
                Hospital Contacts
              </h3>

              <div className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-border-subtle">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">call</span>
                <div>
                  <p className="font-semibold text-on-surface">Emergency Admission Desk</p>
                  <p className="text-on-surface-variant">{hospital.emergencyContact || '+91 80 4342 0100'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-border-subtle">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">support_agent</span>
                <div>
                  <p className="font-semibold text-on-surface">TPA & Cashless Desk</p>
                  <p className="text-on-surface-variant">{hospital.tpaDeskContact || '+91 80 4342 0150'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-border-subtle">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">location_on</span>
                <div>
                  <p className="font-semibold text-on-surface">Address</p>
                  <p className="text-on-surface-variant">{hospital.address || hospital.location}</p>
                </div>
              </div>
            </div>

            {/* Quick Facility & Policy Overview Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow flex flex-col gap-3 text-xs">
              <h3 className="font-headline-lg text-base text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                Facility & Policy Summary
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                  <span className="text-on-surface-variant">Network Status</span>
                  <span className="font-semibold text-on-surface">
                    {matchResult?.networkStatus === 'IN_NETWORK' ? 'In Network (Cashless)' : 'Out of Network'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                  <span className="text-on-surface-variant">Active Policy</span>
                  <span className="font-semibold text-on-surface">
                    {policy?.insurerName || 'Star Health'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                  <span className="text-on-surface-variant">Daily Room Cap</span>
                  <span className="font-semibold text-on-surface">
                    {hasPolicyLimit ? formatCurrency(policyRoomLimit) : 'Unavailable'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-on-surface-variant">Coverage Limit</span>
                  <span className="font-semibold text-on-surface">
                    {policy?.coverageLimit ? formatCurrency(policy.coverageLimit) : '₹10,00,000'}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Lower Full-Width Section 1: Room Category Compatibility Matrix */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <h2 className="font-headline-lg text-lg md:text-xl text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">table_chart</span>
                Room Category Compatibility Matrix
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">
                Comparing all published hospital room tariffs against your stated policy cap ({hasPolicyLimit ? formatCurrency(policyRoomLimit) : 'Unavailable'}/day)
              </p>
            </div>
          </div>

          {/* Wide Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-subtle text-on-surface-variant font-semibold bg-surface-container/40">
                  <th className="py-3 px-4 font-semibold">Room Category</th>
                  <th className="py-3 px-4 font-semibold">Daily Tariff</th>
                  <th className="py-3 px-4 font-semibold">Stated Cap</th>
                  <th className="py-3 px-4 font-semibold">Compatibility Status</th>
                  <th className="py-3 px-4 font-semibold">Advisory Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {matchResult?.roomEvaluations && matchResult.roomEvaluations.length > 0 ? (
                  matchResult.roomEvaluations.map((room) => {
                    const statusClass =
                      room.compatibilityStatus === 'WITHIN_STATED_LIMIT'
                        ? 'bg-status-safe/10 text-status-safe'
                        : room.compatibilityStatus === 'POLICY_CONSIDERATION'
                        ? 'bg-status-warning/10 text-status-warning'
                        : 'bg-status-critical/10 text-status-critical';

                    return (
                      <tr key={room.roomId} className="hover:bg-surface transition-colors">
                        <td className="py-3.5 px-4 font-medium text-on-surface text-sm">
                          {room.roomName}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-primary text-sm">
                          {formatCurrency(room.dailyCost)}/day
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant">
                          {room.policyLimit ? formatCurrency(room.policyLimit) : (hasPolicyLimit ? formatCurrency(policyRoomLimit) : '—')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full font-semibold text-[11px] ${statusClass}`}>
                            {room.compatibilityStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant text-xs max-w-md">
                          {room.advisoryNote || (room.withinPolicyLimit ? 'Within stated limit' : 'Potential proportionate deduction risk')}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  hospital.roomCategories.map((room) => (
                    <tr key={room.id} className="hover:bg-surface transition-colors">
                      <td className="py-3.5 px-4 font-medium text-on-surface text-sm">{room.categoryName}</td>
                      <td className="py-3.5 px-4 font-semibold text-primary text-sm">{formatCurrency(room.dailyRate)}/day</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">{hasPolicyLimit ? formatCurrency(policyRoomLimit) : '—'}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-status-safe/10 text-status-safe px-2.5 py-1 rounded-full font-semibold text-[11px]">
                          WITHIN STATED LIMIT
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant text-xs">
                        {room.description || 'Eligible under stated daily room limit.'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Lower Full-Width Section 2: Clinical Specialties */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-lg text-lg md:text-xl text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">medical_services</span>
              Clinical Specialties & Departments
            </h2>
            <span className="font-label-sm text-xs bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-medium">
              {hospital.specialties?.length || 0} Specializations Available
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {hospital.specialties && hospital.specialties.length > 0 ? (
              hospital.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="bg-surface px-4 py-2 rounded-xl text-xs font-semibold text-primary border border-border-subtle flex items-center gap-1.5 shadow-2xs hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary/70">check_circle</span>
                  {spec}
                </span>
              ))
            ) : (
              <span className="text-xs text-on-surface-variant">General Medicine, Cardiology, Orthopedics, Critical Care</span>
            )}
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}
