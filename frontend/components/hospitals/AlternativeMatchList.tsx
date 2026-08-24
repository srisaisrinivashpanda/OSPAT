import React from 'react';
import { HospitalMatchResultDto } from '@/lib/types';
import Link from 'next/link';
import ScoreRing from '@/components/ui/ScoreRing';

interface AlternativeMatchListProps {
  matches?: HospitalMatchResultDto[];
}

export default function AlternativeMatchList({ matches = [] }: AlternativeMatchListProps) {
  const defaultAlternatives = [
    {
      hospitalId: 2,
      hospitalName: 'Metro Care Institute',
      location: 'Downtown • Partial Network',
      score: 78,
      analysis: 'Strong specialty match, partial network alignment.',
      color: 'primary',
    },
    {
      hospitalId: 3,
      hospitalName: 'St. Jude Medical Center',
      location: 'Westside • Full Network',
      score: 65,
      analysis: 'Full network match, room constraints apply.',
      color: 'amber',
    },
    {
      hospitalId: 4,
      hospitalName: 'Zenith Health',
      location: 'North Suburbs • Out of Network',
      score: 52,
      analysis: 'Out of network, specialized care only.',
      color: 'tertiary',
    },
  ];

  const displayList =
    matches.length > 0
      ? matches.map((m) => ({
          hospitalId: m.hospitalId,
          hospitalName: m.hospitalName,
          location: `${m.location} • ${m.networkStatus === 'IN_NETWORK' ? 'In Network' : 'Out of Network'}`,
          score: m.compatibilityScore,
          analysis: m.matchingFactors[0] || m.considerations[0] || 'Deterministic alignment evaluated.',
          color: m.compatibilityScore >= 75 ? 'primary' : m.compatibilityScore >= 55 ? 'amber' : 'tertiary',
        }))
      : defaultAlternatives;

  return (
    <section className="mb-10 md:mb-12 reveal stagger-3">
      <div className="border-b border-outline-variant/30 pb-3 mb-6">
        <h3 className="font-headline-section-mobile md:font-headline-section text-on-surface uppercase tracking-tight text-xl md:text-2xl font-bold">
          ALTERNATIVE ALIGNMENTS
        </h3>
      </div>

      <div className="flex flex-col divide-y divide-outline-variant/20">
        {displayList.map((item) => (
          <Link
            key={item.hospitalId}
            href={`/hospitals/${item.hospitalId}`}
            className="flex flex-col xl:flex-row items-start xl:items-center justify-between group py-4 hover:bg-surface-container-low/40 px-2 rounded-xl transition-colors cursor-pointer gap-4"
          >
            <div className="flex items-center gap-6 md:gap-8 w-full xl:w-auto">
              {/* Score Indicator */}
              <div className="flex-shrink-0">
                <ScoreRing score={item.score} size="sm" showLabel={false} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-1">
                <div>
                  <div className="font-label-caps text-[11px] text-on-surface-variant mb-0.5 tracking-widest font-bold">
                    FACILITY
                  </div>
                  <h4 className="font-title-lg text-base md:text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                    {item.hospitalName}
                  </h4>
                </div>

                <div>
                  <div className="font-label-caps text-[11px] text-on-surface-variant mb-0.5 tracking-widest font-bold">
                    LOCATION &amp; STATUS
                  </div>
                  <div className="text-on-surface font-body-lg text-sm">
                    {item.location}
                  </div>
                </div>

                <div>
                  <div className="font-label-caps text-[11px] text-on-surface-variant mb-0.5 tracking-widest font-bold">
                    ANALYSIS
                  </div>
                  <div className="text-on-surface-variant font-body-lg text-xs md:text-sm">
                    {item.analysis}
                  </div>
                </div>
              </div>
            </div>

            <span className="material-symbols-outlined text-2xl text-surface-dim group-hover:text-primary transition-colors self-end xl:self-center">
              arrow_forward
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
