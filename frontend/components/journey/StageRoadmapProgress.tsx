'use client';

import React from 'react';
import { Check, HeartPulse } from 'lucide-react';
import { JourneyStage } from '@/lib/types';

interface StageRoadmapProgressProps {
  currentStage?: JourneyStage;
  onSelectStage?: (stage: JourneyStage) => void;
}

const STAGES: { id: JourneyStage; num: string; title: string; subtitle: string }[] = [
  {
    id: 'ADMISSION',
    num: '01',
    title: 'Admission',
    subtitle: 'Emergency intake & triage.',
  },
  {
    id: 'INVESTIGATION',
    num: '02',
    title: 'Investigation',
    subtitle: 'Diagnostics & lab workup.',
  },
  {
    id: 'PROCEDURE',
    num: '03',
    title: 'Procedure',
    subtitle: 'Intervention & stabilization.',
  },
  {
    id: 'RECOVERY',
    num: '04',
    title: 'Recovery',
    subtitle: 'Post-op care & discharge.',
  },
];

export default function StageRoadmapProgress({
  currentStage = 'RECOVERY',
  onSelectStage,
}: StageRoadmapProgressProps) {
  const currentStageIndex = STAGES.findIndex((s) => s.id === currentStage);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 3; // default Recovery (3)

  return (
    <section className="mb-10 md:mb-12 relative reveal stagger-1">
      {/* Background Connecting Hairline (Desktop) */}
      <div className="w-full h-[1px] bg-outline-variant/30 absolute top-8 md:top-10 left-0 right-0 z-0 hidden md:block" />

      {/* Animated SVG Progress Line */}
      <svg
        className="absolute top-8 md:top-10 left-8 right-8 w-[calc(100%-64px)] h-[2px] z-0 hidden md:block pointer-events-none"
        preserveAspectRatio="none"
      >
        <line
          className="progress-line-anim"
          stroke="#006861"
          strokeWidth="2"
          x1="0"
          x2={activeIndex === 3 ? '100%' : activeIndex === 2 ? '75%' : activeIndex === 1 ? '50%' : '25%'}
          y1="1"
          y2="1"
        />
      </svg>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter relative z-10">
        {STAGES.map((stg, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <div
              key={stg.id}
              onClick={() => onSelectStage && onSelectStage(stg.id)}
              className={`flex flex-col md:items-center text-left md:text-center transition-all duration-300 ${
                onSelectStage ? 'cursor-pointer hover:opacity-80' : ''
              }`}
            >
              {/* Icon / Circle Indicator */}
              {isCompleted ? (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center mb-4 text-on-primary shadow-sm">
                  <Check className="w-6 h-6 md:w-7 md:h-7 check-anim" />
                </div>
              ) : isActive ? (
                <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4">
                  <div className="absolute inset-0 rounded-full bg-primary/20 pulse-ring" />
                  <div className="absolute inset-0 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg">
                    <HeartPulse className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center mb-4 text-on-surface-variant/50">
                  <span className="font-label-caps text-sm md:text-base font-bold">{stg.num}</span>
                </div>
              )}

              {/* Stage labels */}
              <p
                className={`font-label-caps text-[11px] uppercase mb-1 ${
                  isActive || isCompleted ? 'text-primary font-bold' : 'text-on-surface-variant/60'
                }`}
              >
                {stg.num} {isActive && '• Active'}
              </p>

              <h3 className="font-title-lg text-lg md:text-2xl font-bold text-on-surface mb-1">
                {stg.title}
              </h3>

              <p className="font-body-lg text-xs md:text-sm text-on-surface-variant/80">
                {stg.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
