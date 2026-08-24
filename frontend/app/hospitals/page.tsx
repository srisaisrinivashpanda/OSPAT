'use client';

import React, { useEffect, useState } from 'react';
import { matchHospitals } from '@/lib/api/apiClient';
import { HospitalMatchResultDto } from '@/lib/types';
import HospitalHero from '@/components/hospitals/HospitalHero';
import ApexMatchSection from '@/components/hospitals/ApexMatchSection';
import WhyThisMatchesGrid from '@/components/hospitals/WhyThisMatchesGrid';
import RoomMatrixTable from '@/components/hospitals/RoomMatrixTable';
import AlternativeMatchList from '@/components/hospitals/AlternativeMatchList';
import AIExplanationBlock from '@/components/intelligence/AIExplanationBlock';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';
import { Loader2 } from 'lucide-react';

export default function HospitalsPage() {
  const [matches, setMatches] = useState<HospitalMatchResultDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationQuery, setLocationQuery] = useState('');
  const [specialtyQuery, setSpecialtyQuery] = useState('');

  const executeSearch = async () => {
    setLoading(true);
    try {
      const results = await matchHospitals({
        patientId: 1,
        location: locationQuery || undefined,
        specialty: specialtyQuery || undefined,
      });
      setMatches(results);
    } catch (err) {
      console.warn('Backend API unavailable, using fallback matching results:', err);
      setMatches([
        {
          hospitalId: 1,
          hospitalName: 'Apex Multi-Specialty Hospital',
          location: 'Indiranagar, Bengaluru',
          address: '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038',
          networkStatus: 'IN_NETWORK',
          isNetworkMatch: true,
          compatibilityScore: 90,
          totalScore: 90,
          networkScore: 40,
          roomScore: 30,
          specialtyScore: 10,
          policyConstraintScore: 10,
          scoreRating: 'HIGH_COMPATIBILITY',
          matchingFactors: [
            'Listed network hospital under Star Health schedule.',
            'Room categories available starting from ₹1,800/day within stated policy limit of ₹5,000/day.',
          ],
          considerations: [],
          caregiverSummary:
            'Based on Star Health policy parameters, Apex Multi-Specialty Hospital is a 90% match with in-network direct billing and full room limit headroom.',
          specialties: ['Cardiology', 'Orthopedics', 'General Surgery', 'Critical Care'],
          roomEvaluations: [
            {
              roomId: 1,
              roomName: 'General Sharing Ward (4-Bed)',
              dailyCost: 1800,
              policyLimit: 5000,
              costDifference: -3200,
              withinPolicyLimit: true,
              available: true,
              compatibilityStatus: 'WITHIN_STATED_LIMIT',
              advisoryNote: 'Daily room rent (₹1,800) is within stated policy limit of ₹5,000/day.',
            },
            {
              roomId: 2,
              roomName: 'Semi-Private Room (Twin Sharing)',
              dailyCost: 3800,
              policyLimit: 5000,
              costDifference: -1200,
              withinPolicyLimit: true,
              available: true,
              compatibilityStatus: 'WITHIN_STATED_LIMIT',
              advisoryNote: 'Daily room rent (₹3,800) is within stated policy limit of ₹5,000/day.',
            },
            {
              roomId: 3,
              roomName: 'Single Private Deluxe AC',
              dailyCost: 6500,
              policyLimit: 5000,
              costDifference: 1500,
              withinPolicyLimit: false,
              available: true,
              compatibilityStatus: 'POLICY_CONSIDERATION',
              advisoryNote: 'Exceeds stated limit by ₹1,500/day. Differential room rent is out-of-pocket.',
            },
            {
              roomId: 4,
              roomName: 'Super Deluxe Suite',
              dailyCost: 12500,
              policyLimit: 5000,
              costDifference: 7500,
              withinPolicyLimit: false,
              available: true,
              compatibilityStatus: 'EXCEEDS_STATED_LIMIT',
              advisoryNote: 'Exceeds limit by ₹7,500/day (>40%). Proportionate deductions may apply across surgeon and nursing fees.',
            },
            {
              roomId: 5,
              roomName: 'Intensive Care Unit (ICU)',
              dailyCost: 11000,
              policyLimit: 5000,
              costDifference: 6000,
              withinPolicyLimit: false,
              available: true,
              compatibilityStatus: 'POLICY_CONSIDERATION',
              advisoryNote: 'ICU charges adjudicated under dedicated medical necessity terms.',
            },
          ],
          lowestEligibleRoomCost: 1800,
          highestRoomCost: 12500,
          hasEligibleRoom: true,
        },
        {
          hospitalId: 2,
          hospitalName: 'Metro Care Medical Institute',
          location: 'Koramangala, Bengaluru',
          networkStatus: 'IN_NETWORK',
          isNetworkMatch: true,
          compatibilityScore: 78,
          totalScore: 78,
          networkScore: 40,
          roomScore: 18,
          specialtyScore: 10,
          policyConstraintScore: 10,
          scoreRating: 'MODERATE_COMPATIBILITY',
          matchingFactors: ['Strong specialty match, partial network alignment.'],
          considerations: [],
          specialties: ['Neurology', 'Orthopedics', 'Emergency Medicine'],
          roomEvaluations: [],
          hasEligibleRoom: true,
        },
        {
          hospitalId: 3,
          hospitalName: 'St. Jude Memorial Health Center',
          location: 'Whitefield, Bengaluru',
          networkStatus: 'IN_NETWORK',
          isNetworkMatch: true,
          compatibilityScore: 65,
          totalScore: 65,
          networkScore: 40,
          roomScore: 15,
          specialtyScore: 0,
          policyConstraintScore: 10,
          scoreRating: 'MODERATE_COMPATIBILITY',
          matchingFactors: ['Full network match, room constraints apply.'],
          considerations: [],
          specialties: ['Oncology', 'Cardiology', 'General Surgery'],
          roomEvaluations: [],
          hasEligibleRoom: true,
        },
        {
          hospitalId: 4,
          hospitalName: 'Zenith Super Speciality Hospital',
          location: 'Jayanagar, Bengaluru',
          networkStatus: 'IN_NETWORK',
          isNetworkMatch: true,
          compatibilityScore: 52,
          totalScore: 52,
          networkScore: 40,
          roomScore: 12,
          specialtyScore: 0,
          policyConstraintScore: 0,
          scoreRating: 'MODERATE_COMPATIBILITY',
          matchingFactors: ['Out of network specialty care only.'],
          considerations: [],
          specialties: ['Gastroenterology', 'Nephrology', 'Laparoscopic Surgery'],
          roomEvaluations: [],
          hasEligibleRoom: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, []);

  const topMatch = matches.length > 0 ? matches[0] : null;
  const alternativeMatches = matches.length > 1 ? matches.slice(1) : [];

  return (
    <main className="max-w-[1600px] mx-auto px-margin-mobile md:px-margin-page pt-6 md:pt-10 pb-16">
      <HospitalHero
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        specialtyQuery={specialtyQuery}
        setSpecialtyQuery={setSpecialtyQuery}
        onSearch={executeSearch}
      />

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-primary">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="font-label-caps text-xs tracking-widest uppercase">
            Evaluating Deterministic Compatibility Rules...
          </span>
        </div>
      ) : (
        <>
          <ApexMatchSection match={topMatch} />

          <WhyThisMatchesGrid />

          {topMatch && topMatch.roomEvaluations && topMatch.roomEvaluations.length > 0 && (
            <section className="mb-10 md:mb-12 reveal stagger-2">
              <div className="border-b border-outline-variant/30 pb-3 mb-4">
                <h3 className="font-headline-section-mobile md:font-headline-section text-on-surface uppercase tracking-tight text-xl md:text-2xl font-bold">
                  ROOM CATEGORY MATRIX — {topMatch.hospitalName.toUpperCase()}
                </h3>
                <p className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-0.5">
                  Headroom analysis against your policy room limit of ₹5,000/day.
                </p>
              </div>
              <RoomMatrixTable evaluations={topMatch.roomEvaluations} policyLimit={5000} />
            </section>
          )}

          <AIExplanationBlock
            title="Matching Synthesis"
            hospitalId={topMatch?.hospitalId || 1}
            policyId={1}
            initialExplanation="Apex Multi-Specialty Hospital achieved a 90% compatibility score based on full in-network direct cashless billing authorization and compliant semi-private room rates (₹3,800/day vs ₹5,000/day cap). Choosing the Deluxe Suite (₹12,500/day) would trigger proportionate deduction warnings across associated surgeon fees."
          />

          <AlternativeMatchList matches={alternativeMatches} />

          <DisclaimerBanner />
        </>
      )}
    </main>
  );
}
