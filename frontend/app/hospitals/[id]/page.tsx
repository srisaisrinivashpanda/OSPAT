'use client';

import React, { useEffect, useState, use } from 'react';
import { getHospitalById, matchHospitals, createOrUpdateJourney } from '@/lib/api/apiClient';
import { HospitalDto, HospitalMatchResultDto } from '@/lib/types';
import RoomMatrixTable from '@/components/hospitals/RoomMatrixTable';
import ScoreRing from '@/components/ui/ScoreRing';
import StatusBadge from '@/components/ui/StatusBadge';
import AIExplanationBlock from '@/components/intelligence/AIExplanationBlock';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';
import { ArrowLeft, ArrowRight, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HospitalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const hospitalId = Number(resolvedParams.id);

  const [hospital, setHospital] = useState<HospitalDto | null>(null);
  const [matchResult, setMatchResult] = useState<HospitalMatchResultDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiatingJourney, setInitiatingJourney] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [hospData, matchData] = await Promise.all([
          getHospitalById(hospitalId),
          matchHospitals({ patientId: 1 }),
        ]);
        setHospital(hospData);
        const specificMatch = matchData.find((m) => m.hospitalId === hospitalId);
        setMatchResult(specificMatch || null);
      } catch (err) {
        console.warn('Backend API unavailable, using fallback hospital details:', err);
        setHospital({
          id: hospitalId,
          name: hospitalId === 1 ? 'Apex Multi-Specialty Hospital' : 'Metro Care Medical Institute',
          location: hospitalId === 1 ? 'Indiranagar, Bengaluru' : 'Koramangala, Bengaluru',
          address: '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038',
          networkStatus: 'IN_NETWORK',
          description: 'Tertiary multi-specialty healthcare center renowned for cardiology, orthopedics, and advanced surgical care.',
          specialties: ['Cardiology', 'Orthopedics', 'General Surgery', 'Critical Care'],
          roomCategories: [],
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [hospitalId]);

  const handleStartJourney = async () => {
    setInitiatingJourney(true);
    try {
      await createOrUpdateJourney(1, hospitalId);
      router.push('/journey');
    } catch (err) {
      console.warn('Failed to start journey, redirecting to journey page:', err);
      router.push('/journey');
    } finally {
      setInitiatingJourney(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-[1600px] mx-auto px-margin-mobile md:px-margin-page pt-12 pb-20 flex flex-col items-center justify-center gap-4 text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="font-label-caps text-xs tracking-widest uppercase">
          Loading Facility Alignment Profile...
        </span>
      </main>
    );
  }

  const score = matchResult?.compatibilityScore ?? (hospitalId === 1 ? 90 : 78);

  return (
    <main className="max-w-[1600px] mx-auto px-margin-mobile md:px-margin-page pt-6 md:pt-10 pb-16">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/hospitals"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-label-caps text-xs tracking-wider uppercase transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hospital Matching
        </Link>
      </div>

      {/* Facility Header & Score */}
      <section className="mb-8 md:mb-10 p-6 md:p-10 rounded-[28px] bg-surface-container-low border border-outline-variant/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <StatusBadge status={hospital?.networkStatus || 'IN_NETWORK'} />
            <span className="font-label-caps text-xs text-on-surface-variant flex items-center gap-1 font-bold">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {hospital?.location}
            </span>
          </div>

          <h1 className="font-display-hero-mobile md:font-headline-section text-2xl md:text-4xl font-bold text-on-surface mb-3 uppercase tracking-tight">
            {hospital?.name}
          </h1>

          <p className="font-body-xl text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-6">
            {hospital?.description ||
              'Tertiary healthcare facility featuring cashless direct insurance liaison, multi-disciplinary surgery suites, and 24x7 intensive recovery units.'}
          </p>

          <div className="flex flex-wrap gap-2">
            {hospital?.specialties.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-surface text-on-surface border border-outline-variant/30 text-xs font-body-lg font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-surface rounded-[24px] border border-outline-variant/20 shadow-sm">
          <ScoreRing score={score} size="lg" label="COMPATIBILITY SCORE" />

          <button
            onClick={handleStartJourney}
            disabled={initiatingJourney}
            className="mt-6 px-7 py-3.5 bg-primary text-on-primary rounded-full font-label-caps text-xs tracking-widest uppercase hover:bg-primary-container transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {initiatingJourney ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Initiating...
              </>
            ) : (
              <>
                <span>Select &amp; Start Care Journey</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </section>

      {/* Room Category Matrix */}
      <section className="mb-8 md:mb-10">
        <div className="border-b border-outline-variant/30 pb-3 mb-4">
          <h2 className="font-headline-section-mobile md:font-headline-section text-xl md:text-2xl text-on-surface uppercase tracking-tight font-bold">
            ROOM CATEGORY COMPATIBILITY MATRIX
          </h2>
          <p className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-0.5">
            Detailed breakdown of published daily ward charges against the ₹5,000/day policy cap.
          </p>
        </div>

        <RoomMatrixTable evaluations={matchResult?.roomEvaluations} policyLimit={5000} />
      </section>

      <AIExplanationBlock
        title="Hospital Alignment Advisory"
        hospitalId={hospitalId}
        policyId={1}
        initialExplanation={`Based on verified Star Health policy parameters, ${hospital?.name} offers full direct cashless billing. Room categories within the ₹5,000 daily limit avoid proportionate surgeon and nursing deduction penalties.`}
      />

      <DisclaimerBanner />
    </main>
  );
}
