'use client';

import React, { useState } from 'react';
import { StageGuidanceDto } from '@/lib/types';

interface TpaQuestionChecklistProps {
  guidance?: StageGuidanceDto | null;
}

export default function TpaQuestionChecklist({ guidance }: TpaQuestionChecklistProps) {
  const questions = [
    {
      q: 'What happens if the TPA rejects a charge?',
      a: 'The hospital billing desk can submit a reconsideration query with supporting physician notes and diagnostic reports before physical discharge.',
    },
    {
      q: 'How long does final settlement take?',
      a: 'Final TPA adjudication typically takes between 2 to 4 hours from the time the hospital uploads the consolidated itemized invoice.',
    },
    {
      q: 'Can the patient leave before approval?',
      a: 'Hospitals generally require a security deposit or interim clearance before releasing the physical discharge pass.',
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section className="mb-10 md:mb-12 reveal stagger-4">
      <h2 className="font-label-caps text-xs text-primary uppercase tracking-widest mb-4 font-bold">
        QUESTIONS YOU MAY WANT TO ASK
      </h2>

      <div className="flex flex-col border-t border-on-surface/30">
        {questions.map((item, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => toggleExpand(idx)}
              className="py-4 border-b border-outline-variant/20 flex flex-col justify-between group cursor-pointer hover:bg-surface-container-low/50 transition-colors px-2 md:px-4 rounded-xl"
            >
              <div className="flex justify-between items-center gap-4">
                <h3 className="font-headline-section-mobile text-base md:text-xl leading-tight text-on-surface group-hover:text-primary transition-colors font-bold">
                  {item.q}
                </h3>
                <span className="material-symbols-outlined text-[24px] md:text-[28px] text-outline-variant group-hover:text-primary transition-colors flex-shrink-0">
                  arrow_outward
                </span>
              </div>

              {isExpanded && (
                <p className="font-body-xl text-xs md:text-sm text-on-surface-variant mt-3 pl-3 border-l-2 border-primary/40 leading-relaxed animate-in fade-in duration-200">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
