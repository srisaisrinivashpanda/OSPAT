'use client';

import React from 'react';
import { HospitalMatchResultDto } from '@/lib/types';
import ScoreRing from '@/components/ui/ScoreRing';
import Link from 'next/link';

interface ApexMatchSectionProps {
  match?: HospitalMatchResultDto | null;
  onSelectHospital?: (hospitalId: number) => void;
}

export default function ApexMatchSection({
  match,
}: ApexMatchSectionProps) {
  const hospitalName = match?.hospitalName || 'Apex Multi-Specialty Hospital';
  const score = match?.compatibilityScore ?? 90;
  const networkScore = match?.networkScore ?? 40;
  const roomScore = match?.roomScore ?? 30;
  const specialtyScore = match?.specialtyScore ?? 10;
  const policyScore = match?.policyConstraintScore ?? 10;
  const hospitalId = match?.hospitalId || 1;

  return (
    <section className="mb-12 reveal stagger-1">
      <div className="bg-surface-container-low p-6 md:p-10 rounded-[28px] flex flex-col lg:flex-row gap-8 md:gap-12 relative overflow-hidden border border-outline-variant/20 shadow-sm">
        <div className="flex-1 z-10 lg:w-1/2 flex flex-col justify-between">
          <div>
            <span className="font-label-caps text-[10px] text-primary bg-mint-surface px-3 py-1 mb-3 inline-block rounded tracking-widest font-bold">
              APEX MATCH
            </span>

            <h2 className="font-headline-section text-2xl md:text-3xl text-on-surface mb-3 uppercase tracking-tight font-extrabold">
              {hospitalName}
            </h2>

            <p className="font-body-xl text-sm md:text-base text-on-surface-variant mb-6 max-w-xl leading-relaxed">
              Based on your policy parameters and clinical requirements, Apex provides the most optimal alignment for cardiovascular care in your network.
            </p>
          </div>

          {/* 4 Sub-Scores matching Stitch Image 6 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-outline-variant/30 pt-6">
            <div>
              <div className="font-label-caps text-[10px] text-on-surface-variant/80 mb-1 tracking-widest font-bold">
                NETWORK ALIGNMENT
              </div>
              <div className="font-headline-section-mobile text-2xl font-bold text-on-surface">
                {networkScore}
                <span className="text-xs text-on-surface-variant/40 font-normal">/40</span>
              </div>
            </div>

            <div>
              <div className="font-label-caps text-[10px] text-on-surface-variant/80 mb-1 tracking-widest font-bold">
                ROOM PREFERENCE
              </div>
              <div className="font-headline-section-mobile text-2xl font-bold text-on-surface">
                {roomScore}
                <span className="text-xs text-on-surface-variant/40 font-normal">/30</span>
              </div>
            </div>

            <div>
              <div className="font-label-caps text-[10px] text-on-surface-variant/80 mb-1 tracking-widest font-bold">
                SPECIALTY OVERLAP
              </div>
              <div className="font-headline-section-mobile text-2xl font-bold text-tertiary">
                {specialtyScore}
                <span className="text-xs text-on-surface-variant/40 font-normal">/20</span>
              </div>
            </div>

            <div>
              <div className="font-label-caps text-[10px] text-on-surface-variant/80 mb-1 tracking-widest font-bold">
                POLICY COMPLIANCE
              </div>
              <div className="font-headline-section-mobile text-2xl font-bold text-on-surface">
                {policyScore}
                <span className="text-xs text-on-surface-variant/40 font-normal">/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Score Ring & Action Button */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center z-10 py-2">
          <ScoreRing
            score={score}
            size="hero"
            label="COMPATIBILITY SCORE"
          />

          <div className="mt-6 flex justify-center w-full">
            <Link
              href={`/hospitals/${hospitalId}`}
              className="px-8 py-3.5 bg-primary text-on-primary font-label-caps text-xs rounded-full uppercase tracking-widest hover:bg-primary-container shadow-sm transition-all text-center cursor-pointer"
            >
              REVIEW ALIGNMENT DATA
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
