'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { JourneyContextDto } from '@/lib/types';

interface ActiveRecoverySpotlightProps {
  context?: JourneyContextDto | null;
  onAdvanceClick?: () => void;
}

export default function ActiveRecoverySpotlight({
  context,
  onAdvanceClick,
}: ActiveRecoverySpotlightProps) {
  const [billReviewed, setBillReviewed] = useState(false);
  const stage = context?.currentStage || 'RECOVERY';
  const hospitalName = context?.hospitalName || 'Apex Multi-Specialty Hospital';

  return (
    <section className="mb-10 md:mb-12 reveal stagger-2">
      <div className="bg-mint-surface py-10 md:py-14 px-6 md:px-12 rounded-[32px] shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h2 className="font-display-hero-mobile md:font-display-hero text-[48px] md:text-[72px] md:leading-[76px] text-primary tracking-tighter mb-4 uppercase">
              {stage}.
            </h2>

            <h3 className="font-headline-section-mobile md:font-headline-section text-xl md:text-2xl text-on-surface mb-3 font-bold">
              Discharge &amp; Claim Reconciliation at {hospitalName}
            </h3>

            <p className="font-body-xl text-base md:text-lg text-on-surface-variant/90 max-w-3xl leading-relaxed">
              The primary medical team has cleared Rajesh Verma for discharge. The administrative focus is now on finalizing the itemized hospital bill and coordinating with the Star Health TPA cashless desk for final claim settlement.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="bg-surface p-6 md:p-8 rounded-[24px] border border-primary/15 shadow-md">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block mb-2">
                Action Required
              </span>

              <h4 className="font-title-lg text-xl font-bold text-on-surface mb-2">
                Review Itemized Bill
              </h4>

              <p className="font-body-lg text-xs text-on-surface-variant mb-6 leading-relaxed">
                Please verify non-medical consumables, doctor consultation fees, and pharmacy charges before final submission to the TPA desk.
              </p>

              {billReviewed ? (
                <div className="p-3.5 rounded-full bg-mint-surface border border-primary/20 flex items-center justify-center gap-2 text-primary font-label-caps text-xs">
                  <Check className="w-4 h-4" />
                  BILL VERIFIED &amp; APPROVED
                </div>
              ) : (
                <button
                  onClick={() => setBillReviewed(true)}
                  className="w-full py-3.5 bg-primary text-on-primary rounded-full font-label-caps text-xs tracking-widest uppercase hover:bg-primary-container transition-all shadow-sm cursor-pointer"
                >
                  REVIEW FINAL BILL
                </button>
              )}

              {onAdvanceClick && (
                <button
                  onClick={onAdvanceClick}
                  className="w-full mt-3 py-2 bg-transparent text-on-surface-variant hover:text-primary font-label-caps text-xs tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Log Stage Transition
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
