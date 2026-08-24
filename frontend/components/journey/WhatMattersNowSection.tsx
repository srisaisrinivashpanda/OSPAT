import React from 'react';
import { StageGuidanceDto } from '@/lib/types';

interface WhatMattersNowSectionProps {
  guidance?: StageGuidanceDto | null;
}

export default function WhatMattersNowSection({ guidance }: WhatMattersNowSectionProps) {
  const items = [
    {
      num: '01',
      title: 'Medical Clearance',
      desc: 'The primary physician and surgical team have completed their final rounds and signed the release authorization.',
    },
    {
      num: '02',
      title: 'Billing Finalization',
      desc: 'Pharmacy, diagnostics, and room charges are being consolidated into the final invoice for insurance review.',
    },
    {
      num: '03',
      title: 'Post-Care Instructions',
      desc: 'Medication schedules, dietary guidelines, and follow-up appointment details have been prepared for the patient.',
    },
  ];

  return (
    <section className="mb-10 md:mb-12 reveal stagger-3">
      <div className="border-b border-outline-variant/30 pb-3 mb-6">
        <h2 className="font-headline-section-mobile md:font-headline-section text-on-surface uppercase tracking-tight text-xl md:text-2xl font-bold">
          WHAT MATTERS NOW
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-outline-variant/20 pt-6 group"
          >
            <div className="md:col-span-2">
              <span className="font-display-hero text-4xl md:text-6xl text-primary opacity-20 block leading-none font-bold select-none group-hover:opacity-40 transition-opacity">
                {item.num}
              </span>
            </div>
            <div className="md:col-span-10">
              <h3 className="font-headline-section-mobile text-lg md:text-xl font-bold text-on-surface mb-2">
                {item.title}
              </h3>
              <p className="font-body-xl text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
