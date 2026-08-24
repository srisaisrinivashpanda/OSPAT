import React from 'react';
import Link from 'next/link';
import PillButton from '@/components/ui/PillButton';
import { ArrowRight, FileCheck, CheckCircle2 } from 'lucide-react';
import { CareJourneyDto } from '@/lib/types';

interface ActiveRecoveryCalloutProps {
  journey?: CareJourneyDto | null;
}

export default function ActiveRecoveryCallout({ journey }: ActiveRecoveryCalloutProps) {
  const hospitalName = journey?.hospitalName || 'Apex Multi-Specialty Hospital';
  const hospitalLocation = journey?.hospitalLocation || 'Indiranagar, Bengaluru';

  return (
    <section className="mb-10 md:mb-12 reveal stagger-2">
      <div className="bg-mint-surface py-10 md:py-14 px-6 md:px-12 rounded-[32px] shadow-sm relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-primary pulse-ring inline-block" />
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase">
                ACTIVE INPATIENT JOURNEY • STAGE 04
              </span>
            </div>

            <h2 className="font-display-hero-mobile md:font-display-hero text-[48px] md:text-[68px] md:leading-[72px] text-primary tracking-tighter mb-3 uppercase">
              RECOVERY.
            </h2>

            <h3 className="font-headline-section-mobile md:font-headline-section text-xl md:text-2xl font-semibold text-on-surface mb-4">
              Discharge &amp; Claim Reconciliation at {hospitalName}
            </h3>

            <p className="font-body-xl text-base md:text-lg text-on-surface-variant/90 max-w-3xl leading-relaxed">
              Medical release has been signed by the surgical team. The administrative focus is now on finalizing the itemized hospital bill and coordinating with Star Health TPA desk for final cashless settlement.
            </p>

            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-primary/15 text-sm text-on-surface">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="font-medium">Facility: {hospitalLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" />
                <span className="font-medium">Pre-Auth Sanctioned: ₹45,000</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="bg-surface p-6 md:p-8 rounded-[24px] border border-primary/15 shadow-md">
              <span className="font-label-caps text-xs text-primary tracking-widest uppercase block mb-2 font-bold">
                Immediate Action
              </span>
              <h4 className="font-title-lg text-xl font-bold text-on-surface mb-3">
                Review Final Bill
              </h4>
              <p className="font-body-lg text-xs text-on-surface-variant mb-6 leading-relaxed">
                Review the consolidated pharmacy, room rent, and investigation invoice before submission to the TPA desk to avoid non-medical deduction disputes.
              </p>
              <PillButton
                href="/journey"
                variant="primary"
                size="md"
                className="w-full justify-center text-xs"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                OPEN CARE JOURNEY
              </PillButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
