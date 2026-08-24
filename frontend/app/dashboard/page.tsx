'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardSummary } from '@/lib/api/apiClient';
import { DashboardSummaryDto } from '@/lib/types';
import { Check, HeartPulse, ArrowRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDashboardSummary(1);
        setSummary(data);
      } catch (err) {
        console.warn('Backend API unavailable, using verified fallback data:', err);
        setSummary({
          patientId: 1,
          patientName: 'Rajesh Verma',
          patientAge: 58,
          activePolicy: {
            id: 1,
            patientId: 1,
            patientName: 'Rajesh Verma',
            insurerName: 'Star Health Allied Insurance',
            policyType: 'Family Health Optima Comprehensive',
            coverageLimit: 500000,
            remainingCoverage: 475000,
            roomLimit: 5000,
            roomCategory: 'Semi-Private Room (Twin Sharing AC)',
            policyStatus: 'ACTIVE',
            sourceDocument: 'StarHealth_FamilyOptima_Sample.pdf',
            confirmed: true,
            exclusions: [
              'Cosmetic, aesthetic, or obesity-related treatments are not covered.',
              'Pre-existing illnesses have a mandatory 36-month waiting period from inception.',
              'Non-medical consumables are non-payable.',
            ],
            networkHospitals: [],
          },
          activeJourney: {
            id: 1,
            patientId: 1,
            patientName: 'Rajesh Verma',
            hospitalId: 1,
            hospitalName: 'Apex Multi-Specialty Hospital',
            hospitalLocation: 'Indiranagar, Bengaluru',
            currentStage: 'RECOVERY',
            events: [],
          },
          currentStageGuidance: null,
          totalCoverageLimit: 500000,
          remainingCoverage: 475000,
          roomDailyLimit: 5000,
          roomCategory: 'Semi-Private Room (Twin Sharing AC)',
          networkHospitalsCount: 8,
          totalHospitalsAvailable: 10,
          recentAlerts: [],
          recommendedActions: [],
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const patientName = summary?.patientName || 'Rajesh Verma';
  const hospitalName = summary?.activeJourney?.hospitalName || 'Apex Multi-Specialty Hospital';
  const location = summary?.activeJourney?.hospitalLocation || 'Indiranagar, Bengaluru';
  const sumInsured = summary?.totalCoverageLimit ?? 500000;
  const roomLimit = summary?.roomDailyLimit ?? 5000;
  const networkCount = summary?.networkHospitalsCount ?? 8;
  const exclusionsCount = summary?.activePolicy?.exclusions?.length ?? 4;

  if (loading) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="font-label-caps text-xs tracking-widest uppercase">
          Loading Overview Intelligence...
        </span>
      </main>
    );
  }

  return (
    <main className="w-full">
      {/* =========================================================================
          SECTION 1: HERO (Neutral Paper with Ambient Shader)
          ========================================================================= */}
      <section className="relative min-h-[75vh] flex flex-col justify-center items-center px-margin-mobile md:px-margin-page text-center pt-16 pb-24 overflow-hidden">
        <div className="max-w-4xl w-full mx-auto flex flex-col items-center reveal active">
          {/* Logo Mark */}
          <div className="w-20 h-20 md:w-24 md:h-24 mb-8 rounded-full bg-mint-surface border-2 border-primary flex items-center justify-center text-primary shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-[40px] md:text-[48px]">health_metrics</span>
          </div>

          <h1 className="font-display-hero-mobile md:font-display-hero text-on-surface mb-6 tracking-tight max-w-[1000px] leading-tight font-extrabold uppercase">
            YOUR HEALTHCARE JOURNEY, MADE CLEAR.
          </h1>

          <p className="font-body-xl text-base md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            OSPAT brings together your insurance policy, hospital options and care journey so you can understand what matters at every stage.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CARE JOURNEY (Mint Surface Wash)
          ========================================================================= */}
      <section className="w-full py-20 md:py-28 px-margin-mobile md:px-margin-page bg-mint-surface border-t border-b border-primary/10">
        <div className="max-w-[1440px] mx-auto reveal stagger-1">
          <div className="mb-12">
            <span className="font-label-caps text-xs text-primary uppercase tracking-widest block mb-3 font-bold">
              CARE JOURNEY
            </span>
            <h2 className="font-headline-section-mobile md:font-headline-section text-on-surface max-w-3xl font-extrabold uppercase tracking-tight">
              YOU&apos;RE IN RECOVERY.
            </h2>
            <p className="font-body-lg text-sm md:text-base text-on-surface-variant mt-2 max-w-xl">
              {patientName}, {hospitalName}, {location}.
            </p>
          </div>

          <div className="relative w-full max-w-5xl mx-auto mt-16">
            {/* Connecting Hairline */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary/20 -translate-y-1/2 z-0 hidden md:block" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 relative z-10">
              {/* Stage 1: Admission */}
              <Link href="/journey" className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
                  <Check className="w-6 h-6 md:w-7 md:h-7 check-anim" />
                </div>
                <span className="font-label-caps text-xs text-on-surface-variant group-hover:text-primary font-bold">
                  ADMISSION
                </span>
              </Link>

              {/* Stage 2: Investigation */}
              <Link href="/journey" className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
                  <Check className="w-6 h-6 md:w-7 md:h-7 check-anim" />
                </div>
                <span className="font-label-caps text-xs text-on-surface-variant group-hover:text-primary font-bold">
                  INVESTIGATION
                </span>
              </Link>

              {/* Stage 3: Procedure */}
              <Link href="/journey" className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
                  <Check className="w-6 h-6 md:w-7 md:h-7 check-anim" />
                </div>
                <span className="font-label-caps text-xs text-on-surface-variant group-hover:text-primary font-bold">
                  PROCEDURE
                </span>
              </Link>

              {/* Stage 4: Recovery (Active) */}
              <Link href="/journey" className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-container-lowest border-4 border-primary flex items-center justify-center text-primary shadow-[0_0_30px_rgba(0,104,97,0.35)] pulse-ring group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-7 h-7 md:w-9 md:h-9" />
                </div>
                <span className="font-label-caps text-xs text-primary font-bold">
                  RECOVERY • ACTIVE
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: POLICY (White / Surface Container Lowest)
          ========================================================================= */}
      <section className="w-full py-20 md:py-28 px-margin-mobile md:px-margin-page bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto reveal stagger-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="font-label-caps text-xs text-tertiary uppercase tracking-widest block mb-3 font-bold">
                YOUR POLICY
              </span>
              <h2 className="font-headline-section-mobile md:font-headline-section text-on-surface mb-6 font-extrabold uppercase tracking-tight">
                KNOW WHAT YOUR POLICY MEANS.
              </h2>
              <p className="font-body-lg text-sm md:text-base text-on-surface-variant leading-relaxed mb-6">
                Clear, transparent details about your coverage, limits, and options to help you make informed decisions.
              </p>
              <div>
                <Link
                  href="/policy"
                  className="inline-flex items-center gap-2 font-label-caps text-xs text-primary hover:underline font-bold tracking-widest uppercase"
                >
                  Explore Policy Intelligence <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-6 mt-8 lg:mt-0 justify-center">
              <div className="border-l-4 border-primary pl-6 py-2">
                <div className="font-display-hero-mobile text-3xl md:text-5xl text-on-surface font-extrabold tracking-tight">
                  {formatCurrency(sumInsured)}
                </div>
                <div className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-1">
                  Indicative Sum Insured
                </div>
              </div>

              <div className="border-l-4 border-outline-variant pl-6 py-2">
                <div className="font-title-lg text-2xl md:text-3xl text-on-surface font-bold">
                  {formatCurrency(roomLimit)} / Day
                </div>
                <div className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-1">
                  Stated Room Limit
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 border-l-4 border-outline-variant pl-6 py-2">
                  <div className="font-title-lg text-2xl md:text-3xl text-on-surface font-bold">
                    {networkCount}
                  </div>
                  <div className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-1">
                    Network Hospitals
                  </div>
                </div>
                <div className="flex-1 border-l-4 border-tertiary/70 pl-6 py-2">
                  <div className="font-title-lg text-2xl md:text-3xl text-tertiary font-bold">
                    {exclusionsCount}
                  </div>
                  <div className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-1">
                    Exclusions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HOSPITAL MATCHING (Blue Surface Wash)
          ========================================================================= */}
      <section className="w-full py-20 md:py-28 px-margin-mobile md:px-margin-page bg-blue-surface border-t border-b border-primary/10">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center reveal stagger-3">
          <span className="font-label-caps text-xs text-primary uppercase tracking-widest block mb-3 font-bold">
            HOSPITAL MATCHING
          </span>
          <h2 className="font-headline-section-mobile md:font-headline-section text-on-surface mb-10 max-w-4xl mx-auto font-extrabold uppercase tracking-tight">
            FIND CARE THAT FITS.
          </h2>

          <div className="w-full max-w-3xl flex flex-col items-center">
            <div className="mb-10">
              <div className="text-7xl md:text-[110px] font-display-hero font-extrabold tracking-tighter text-primary leading-none mb-2">
                90<span className="text-3xl md:text-5xl text-outline-variant font-medium">/100</span>
              </div>
              <div className="font-title-lg text-lg md:text-2xl text-on-surface-variant font-bold">
                HIGH COMPATIBILITY
              </div>
            </div>

            <div className="w-full space-y-5 text-left">
              {/* Network */}
              <div>
                <div className="flex justify-between font-label-caps text-xs text-on-surface-variant mb-1 font-bold">
                  <span>NETWORK</span>
                  <span>40/40</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full rounded-full" />
                </div>
              </div>

              {/* Room */}
              <div>
                <div className="flex justify-between font-label-caps text-xs text-on-surface-variant mb-1 font-bold">
                  <span>ROOM</span>
                  <span>30/30</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full rounded-full" />
                </div>
              </div>

              {/* Specialty */}
              <div>
                <div className="flex justify-between font-label-caps text-xs text-on-surface-variant mb-1 font-bold">
                  <span>SPECIALTY</span>
                  <span>10/20</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/2 rounded-full" />
                </div>
              </div>

              {/* Policy */}
              <div>
                <div className="flex justify-between font-label-caps text-xs text-on-surface-variant mb-1 font-bold">
                  <span>POLICY</span>
                  <span>10/10</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/hospitals"
                className="px-8 py-3.5 bg-primary text-on-primary font-label-caps text-xs rounded-full uppercase tracking-widest hover:bg-primary-container shadow-sm transition-all inline-block cursor-pointer"
              >
                View Matched Hospitals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHAT MATTERS NOW (White / Surface Container Lowest)
          ========================================================================= */}
      <section className="w-full py-20 md:py-28 px-margin-mobile md:px-margin-page bg-surface-container-lowest">
        <div className="max-w-[1000px] mx-auto reveal stagger-4">
          <h2 className="font-headline-section-mobile md:font-headline-section text-on-surface mb-16 uppercase tracking-tight font-extrabold">
            KNOW WHAT MATTERS NOW.
          </h2>

          <div className="space-y-8 md:space-y-12">
            {/* Item 01 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start border-t border-outline-variant/30 pt-8 group">
              <div className="font-display-hero-mobile md:font-display-hero text-4xl md:text-7xl text-outline-variant/40 font-bold leading-none select-none group-hover:text-primary transition-colors">
                01
              </div>
              <div>
                <h3 className="font-title-lg text-lg md:text-2xl text-on-surface mb-2 font-bold">
                  Verify final itemized bill.
                </h3>
                <p className="font-body-lg text-sm md:text-base text-on-surface-variant max-w-xl leading-relaxed">
                  Ensure all charges reflect the services received during your stay. Check for duplicates or unexpected room classifications.
                </p>
              </div>
            </div>

            {/* Item 02 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start border-t border-outline-variant/30 pt-8 group">
              <div className="font-display-hero-mobile md:font-display-hero text-4xl md:text-7xl text-outline-variant/40 font-bold leading-none select-none group-hover:text-primary transition-colors">
                02
              </div>
              <div>
                <h3 className="font-title-lg text-lg md:text-2xl text-on-surface mb-2 font-bold">
                  Confirm discharge authorization.
                </h3>
                <p className="font-body-lg text-sm md:text-base text-on-surface-variant max-w-xl leading-relaxed">
                  Wait for final approval from both the medical team and the insurance desk before leaving the premises to avoid delays.
                </p>
              </div>
            </div>

            {/* Item 03 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start border-t border-outline-variant/30 pt-8 group">
              <div className="font-display-hero-mobile md:font-display-hero text-4xl md:text-7xl text-outline-variant/40 font-bold leading-none select-none group-hover:text-primary transition-colors">
                03
              </div>
              <div>
                <h3 className="font-title-lg text-lg md:text-2xl text-on-surface mb-2 font-bold">
                  Review non-payable deductions.
                </h3>
                <p className="font-body-lg text-sm md:text-base text-on-surface-variant max-w-xl leading-relaxed">
                  Understand out-of-pocket expenses for consumables or non-medical items not covered under your specific policy terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
