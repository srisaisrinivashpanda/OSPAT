import React from 'react';
import { PolicyResponseDto } from '@/lib/types';

interface PolicyExclusionsListProps {
  policy?: PolicyResponseDto | null;
}

export default function PolicyExclusionsList({ policy }: PolicyExclusionsListProps) {
  const defaultExclusions = [
    {
      num: '01',
      title: 'Cosmetic & Aesthetic Treatments',
      desc: 'Procedures primarily focused on altering physical appearance without underlying medical necessity are strictly excluded from baseline coverage.',
    },
    {
      num: '02',
      title: 'Non-Medical Consumables',
      desc: 'Administrative charges, registration fees, and non-therapeutic items provided during hospital stay must be settled out-of-pocket.',
    },
    {
      num: '03',
      title: 'Pre-existing Conditions',
      desc: 'Conditions formally diagnosed prior to policy inception remain subject to a mandatory 24-month waiting period before claims can be processed.',
    },
  ];

  const items =
    policy?.exclusions && policy.exclusions.length >= 3
      ? policy.exclusions.slice(0, 3).map((ex, idx) => ({
          num: `0${idx + 1}`,
          title:
            idx === 0
              ? 'Cosmetic & Aesthetic Treatments'
              : idx === 1
              ? 'Non-Medical Consumables'
              : 'Pre-existing Conditions',
          desc: ex,
        }))
      : defaultExclusions;

  return (
    <section className="mb-24 reveal stagger-4">
      <div className="max-w-4xl mx-auto">
        <h3 className="font-headline-section-mobile md:font-headline-section text-on-surface mb-12 border-b-2 border-on-surface pb-6 uppercase tracking-tight font-bold">
          WHAT TO WATCH FOR.
        </h3>

        <ul className="flex flex-col gap-10">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-8 group">
              <span className="font-display-hero text-5xl md:text-8xl text-outline-variant/30 font-light group-hover:text-tertiary transition-colors duration-500 select-none flex-shrink-0 leading-none">
                {item.num}
              </span>
              <div className="pt-2">
                <h4 className="font-title-lg text-xl md:text-2xl font-bold text-on-surface mb-3 group-hover:text-tertiary transition-colors">
                  {item.title}
                </h4>
                <p className="font-body-xl text-base md:text-lg text-on-surface-variant leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
