import React from 'react';
import { DashboardSummaryDto } from '@/lib/types';

interface DashboardHeroProps {
  summary?: DashboardSummaryDto | null;
}

export default function DashboardHero({ summary }: DashboardHeroProps) {
  const patientName = summary?.patientName || 'Rajesh Verma';
  const patientAge = summary?.patientAge || 58;

  return (
    <section className="mb-6 md:mb-8 reveal active">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="font-label-caps text-xs text-primary tracking-[0.2em] uppercase">
            PATIENT INTELLIGENCE OVERVIEW
          </span>
          <span className="text-outline-variant/40">|</span>
          <span className="font-body-lg text-sm text-on-surface-variant font-medium">
            {patientName}, {patientAge}y
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="font-label-caps text-xs text-primary font-bold">
            CURRENT CARE STAGE: RECOVERY
          </span>
        </div>
      </div>

      <h1 className="font-display-hero-mobile md:font-display-hero text-on-surface md:w-11/12 uppercase tracking-tight">
        CLINICAL &amp; FINANCIAL INTELLIGENCE.
      </h1>

      <p className="font-body-xl text-lg md:text-2xl text-on-surface-variant max-w-4xl mt-4 leading-relaxed">
        Real-time decision support mapping active insurance policy parameters to hospital admission, daily room rent caps, and the active discharge journey at Apex Multi-Specialty Hospital.
      </p>
    </section>
  );
}
