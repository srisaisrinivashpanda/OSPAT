import React from 'react';
import { PolicyResponseDto } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/formatters';

interface PolicyMetricsOverviewProps {
  policy?: PolicyResponseDto | null;
}

export default function PolicyMetricsOverview({ policy }: PolicyMetricsOverviewProps) {
  const sumInsured = policy?.coverageLimit ?? 500000;
  const roomLimit = policy?.roomLimit ?? 5000;
  const networkCount = policy?.networkHospitals?.length ?? 8;
  const exclusionsCount = policy?.exclusions?.length ?? 4;

  return (
    <section className="mb-24 reveal stagger-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-gutter gap-y-12">
        {/* Data Point 1 */}
        <div className="border-t-2 border-primary/20 pt-8">
          <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest mb-4 font-bold">
            Sum Insured
          </div>
          <div className="text-4xl md:text-[64px] md:leading-[72px] font-bold tracking-tight text-primary">
            {formatCurrency(sumInsured)}
          </div>
        </div>

        {/* Data Point 2 */}
        <div className="border-t-2 border-outline-variant/30 pt-8">
          <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest mb-4 font-bold">
            Room Limit
          </div>
          <div className="text-4xl md:text-[64px] md:leading-[72px] font-bold tracking-tight text-on-surface">
            {formatCurrency(roomLimit)}
            <span className="text-xl md:text-[32px] md:leading-[40px] font-medium text-on-surface-variant/50 ml-1">
              /Day
            </span>
          </div>
        </div>

        {/* Data Point 3 */}
        <div className="border-t-2 border-outline-variant/30 pt-8">
          <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest mb-4 font-bold">
            Network Hospitals
          </div>
          <div className="text-4xl md:text-[64px] md:leading-[72px] font-bold tracking-tight text-on-surface">
            {networkCount}{' '}
            <span className="text-xl md:text-[32px] md:leading-[40px] font-medium text-on-surface-variant/50 ml-1">
              Top-Tier
            </span>
          </div>
        </div>

        {/* Data Point 4 */}
        <div className="border-t-2 border-outline-variant/30 pt-8">
          <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest mb-4 font-bold">
            Key Exclusions
          </div>
          <div className="text-4xl md:text-[64px] md:leading-[72px] font-bold tracking-tight text-tertiary">
            {exclusionsCount}{' '}
            <span className="text-xl md:text-[32px] md:leading-[40px] font-medium text-on-surface-variant/50 ml-1">
              Items
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
