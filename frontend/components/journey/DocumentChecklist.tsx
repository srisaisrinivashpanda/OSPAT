'use client';

import React, { useState } from 'react';
import { StageGuidanceDto } from '@/lib/types';

interface DocumentChecklistProps {
  guidance?: StageGuidanceDto | null;
}

export default function DocumentChecklist({ guidance }: DocumentChecklistProps) {
  const docs = [
    { title: 'Discharge Summary', subtitle: 'Signed by Dr. Sharma.', initialChecked: true },
    { title: 'Itemized Bill', subtitle: 'Draft generated, pending final review.', initialChecked: true },
    { title: 'TPA Pre-Auth Form', subtitle: 'Awaiting final signature from patient.', initialChecked: false },
  ];

  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
  });

  const toggleCheck = (idx: number) => {
    setCheckedState((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <section className="mb-10 md:mb-12 reveal stagger-3 bg-surface-container-low py-10 md:py-14 px-6 md:px-12 rounded-[28px]">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="font-headline-section-mobile md:font-headline-section text-on-surface mb-8 text-center uppercase tracking-tight text-2xl md:text-3xl font-bold">
          REQUIRED DOCUMENTS
        </h2>

        <div className="space-y-4">
          {docs.map((item, idx) => {
            const isChecked = checkedState[idx] ?? false;

            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`flex items-center bg-surface p-5 rounded-2xl shadow-sm border border-outline-variant/10 transition-all cursor-pointer select-none ${
                  !isChecked ? 'opacity-60' : ''
                }`}
              >
                <div className="mr-5 flex-shrink-0">
                  {isChecked ? (
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path className="check-anim" d="M8 12l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-outline-variant/30 flex items-center justify-center" />
                  )}
                </div>

                <div>
                  <h4 className="font-title-lg text-base md:text-lg font-bold text-on-surface">
                    {item.title}
                  </h4>
                  <p className="font-body-lg text-xs md:text-sm text-on-surface-variant mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
