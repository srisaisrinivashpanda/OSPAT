import React from 'react';

interface JourneyHeroProps {
  patientName?: string;
}

export default function JourneyHero({ patientName = 'Rajesh Verma' }: JourneyHeroProps) {
  return (
    <section className="mb-6 md:mb-8 reveal active">
      <div className="max-w-4xl">
        <p className="font-label-caps text-xs text-primary tracking-[0.2em] uppercase mb-3 font-bold">
          Care Journey &nbsp;|&nbsp; Patient: {patientName}
        </p>
        <h1 className="font-display-hero-mobile md:font-display-hero text-on-surface uppercase tracking-tight">
          From Admission to Recovery.
        </h1>
        <p className="font-body-xl text-base md:text-xl text-on-surface-variant max-w-3xl mt-3 leading-relaxed">
          Step-by-step guidance navigating hospital administration, cashless pre-authorization milestones, procedural package limits, and final claim reconciliation.
        </p>
      </div>
    </section>
  );
}
