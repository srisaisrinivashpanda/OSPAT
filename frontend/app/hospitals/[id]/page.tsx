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

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-8">
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

        {/* Hospital Title Section */}
        <section className="flex flex-col md:flex-row justify-between items-start gap-6 pb-6 border-b border-border-subtle">
          <div className="flex flex-col gap-2">
            <h1 className="font-display-hero text-3xl md:text-4xl lg:text-display-hero text-on-surface font-bold">
              {hospital.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-label-sm text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {hospital.location}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
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
                {matchResult?.networkStatus === 'IN_NETWORK' ? 'In Network' : 'Out of Network'}
              </span>
              <span className="inline-flex items-center gap-1 text-on-surface-variant bg-surface-container px-3 py-1 rounded-full font-medium">
                {matchResult?.hasEligibleRoom ? 'Rooms within stated limit' : 'Room limit considerations'}
              </span>
            </div>
          </div>

          {/* Compatibility Score Circle */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-border-subtle card-shadow flex items-center gap-4 min-w-[240px]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-highest stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                />
                <path
                  className="text-primary-container stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray={`${score}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <span className="absolute font-metric-value text-xl font-bold text-primary-container">
                {score}
              </span>
            </div>
            <div>
              <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">
                Compatibility
              </div>
              <div className="font-body-md text-sm font-semibold text-primary-container">
                {scoreRating}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Primary Info) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Why this hospital fits */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow">
              <h2 className="font-headline-lg text-lg md:text-xl text-on-surface mb-3 flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                Why this hospital fits
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant mb-6">
                Based on your active policy limits ({policy?.insurerName || 'Insurance'}) and hospital tariffs, this facility was evaluated by our deterministic scoring engine:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border-subtle">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-on-surface-variant">Network (40%)</span>
                  <span className="font-body-md text-sm font-semibold text-status-safe">
                    {matchResult?.networkScore ?? 40}/40
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-on-surface-variant">Room Rent (30%)</span>
                  <span className="font-body-md text-sm font-semibold text-status-safe">
                    {matchResult?.roomScore ?? 30}/30
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-on-surface-variant">Specialty (20%)</span>
                  <span className="font-body-md text-sm font-semibold text-status-warning">
                    {matchResult?.specialtyScore ?? 16}/20
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-on-surface-variant">Policy Rules (10%)</span>
                  <span className="font-body-md text-sm font-semibold text-status-safe">
                    {matchResult?.policyConstraintScore ?? 8}/10
                  </span>
                </div>
              </div>

              {/* AI Plain-Language Explanation */}
              {(aiExplanation || matchResult?.caregiverSummary) && (
                <div className="mt-6 pt-4 border-t border-border-subtle bg-primary-fixed/10 p-4 rounded-xl border border-primary-fixed/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-sm">psychology</span>
                    <h4 className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider">
                      Caregiver Summary ({aiExplanation?.providerUsed ? `Powered by ${aiExplanation.providerUsed}` : 'Decision Support'})
                    </h4>
                  </div>
                  <p className="font-body-md text-xs md:text-sm text-on-surface leading-relaxed">
                    {aiExplanation?.explanation || matchResult?.caregiverSummary}
                  </p>
                  <p className="text-[10px] text-on-surface-variant italic mt-2">
                    {aiExplanation?.disclaimer || 'Indicative summary for decision support only.'}
                  </p>
                </div>
              )}
            </section>

            {/* Room Category Matrix Table */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="font-headline-lg text-lg md:text-xl text-on-surface font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">bed</span>
                    Room Category Compatibility Matrix
                  </h2>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1">
                    Comparing published hospital room tariffs against your stated policy cap ({policy && policy.roomLimit ? formatCurrency(policy.roomLimit) : '₹8,000'}/day)
                  </p>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle text-on-surface-variant font-semibold">
                      <th className="py-3 px-2">Room Category</th>
                      <th className="py-3 px-2">Daily Tariff</th>
                      <th className="py-3 px-2">Stated Cap</th>
                      <th className="py-3 px-2">Compatibility Status</th>
                      <th className="py-3 px-2">Advisory Notes</th>
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
                            <td className="py-3 px-2 font-medium text-on-surface">
                              {room.roomName}
                            </td>
                            <td className="py-3 px-2 font-semibold text-primary">
                              {formatCurrency(room.dailyCost)}/day
                            </td>
                            <td className="py-3 px-2 text-on-surface-variant">
                              {room.policyLimit ? formatCurrency(room.policyLimit) : '₹8,000'}
                            </td>
                            <td className="py-3 px-2">
                              <span className={`inline-block px-2.5 py-1 rounded-full font-semibold text-[11px] ${statusClass}`}>
                                {room.compatibilityStatus.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-on-surface-variant text-[11px] max-w-xs">
                              {room.advisoryNote || (room.withinPolicyLimit ? 'Within stated limit' : 'Potential proportionate deduction risk')}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      hospital.roomCategories.map((room) => (
                        <tr key={room.id} className="hover:bg-surface transition-colors">
                          <td className="py-3 px-2 font-medium text-on-surface">{room.categoryName}</td>
                          <td className="py-3 px-2 font-semibold text-primary">{formatCurrency(room.dailyRate)}/day</td>
                          <td className="py-3 px-2 text-on-surface-variant">₹8,000</td>
                          <td className="py-3 px-2">
                            <span className="bg-status-safe/10 text-status-safe px-2.5 py-1 rounded-full font-semibold text-[11px]">
                              WITHIN STATED LIMIT
                            </span>
                          </td>
                          <td className="py-3 px-2 text-on-surface-variant text-[11px]">
                            {room.description || 'Eligible under stated daily room limit.'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Proportionate Deduction Warning */}
              <div className="mt-6 p-4 rounded-xl bg-status-warning/10 border border-status-warning/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-status-warning text-lg shrink-0 mt-0.5">
                  warning
                </span>
                <p className="text-xs text-on-surface leading-relaxed">
                  <strong>Proportionate Deduction Advisory:</strong> If you select a room category priced above your policy limit, the insurer may reduce payouts across hospital services (surgeon fees, ICU, diagnostics) in proportion to the room rent difference.
                </p>
              </div>
            </section>

            {/* Clinical Specialties */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow">
              <h2 className="font-headline-lg text-lg text-on-surface font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">medical_services</span>
                Clinical Specialties
              </h2>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties && hospital.specialties.length > 0 ? (
                  hospital.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="bg-surface px-3 py-1.5 rounded-full text-xs font-medium text-primary border border-border-subtle"
                    >
                      {spec}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-on-surface-variant">General care, Cardiology, Orthopedics</span>
                )}
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar Action) */}
          <div className="flex flex-col gap-6">
            {/* Select for Admission Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow flex flex-col gap-4">
              <h3 className="font-headline-lg text-lg text-primary font-bold">
                Planned Admission?
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Selecting this hospital links your care journey, initiating pre-authorization guidance and document checklists.
              </p>
              <button
                onClick={handleSelectForAdmission}
                disabled={journeyCreating}
                className="w-full bg-primary-container text-on-primary py-3 rounded-full text-sm font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {journeyCreating ? 'Starting Care Journey...' : 'Select for Admission →'}
              </button>
            </div>

            {/* Contact & TPA Desk Info */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-border-subtle card-shadow space-y-4 text-xs">
              <h3 className="font-headline-lg text-base text-primary font-bold">
                Hospital Contacts
              </h3>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                <div>
                  <p className="font-semibold text-on-surface">Emergency Admission</p>
                  <p className="text-on-surface-variant">{hospital.emergencyContact || '+91 80 4342 0100'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">support_agent</span>
                <div>
                  <p className="font-semibold text-on-surface">TPA & Cashless Desk</p>
                  <p className="text-on-surface-variant">{hospital.tpaDeskContact || '+91 80 4342 0150'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                <div>
                  <p className="font-semibold text-on-surface">Address</p>
                  <p className="text-on-surface-variant">{hospital.address || hospital.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
