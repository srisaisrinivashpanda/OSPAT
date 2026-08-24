import React from 'react';
import { DashboardSummaryDto } from '@/lib/types';
import StatNumeral from '@/components/ui/StatNumeral';
import { formatCurrency } from '@/lib/utils/formatters';

interface FinancialHealthRowProps {
  summary?: DashboardSummaryDto | null;
}

export default function FinancialHealthRow({ summary }: FinancialHealthRowProps) {
  const remaining = summary?.remainingCoverage ?? 475000;
  const total = summary?.totalCoverageLimit ?? 500000;
  const roomLimit = summary?.roomDailyLimit ?? 5000;
  const networkCount = summary?.networkHospitalsCount ?? 8;
  const stage = summary?.activeJourney?.currentStage || 'RECOVERY';

  return (
    <section className="mb-8 md:mb-10 reveal stagger-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-gutter gap-y-6">
        <StatNumeral
          label="Indicative Remaining Balance"
          value={formatCurrency(remaining)}
          suffix={`/ ${formatCurrency(total)}`}
          highlight="primary"
        />

        <StatNumeral
          label="Daily Room Rent Cap"
          value={formatCurrency(roomLimit)}
          suffix="/ Day"
          highlight="neutral"
        />

        <StatNumeral
          label="Network Hospitals"
          value={networkCount}
          suffix="Top-Tier"
          highlight="neutral"
        />

        <StatNumeral
          label="Active Journey Stage"
          value={stage === 'RECOVERY' ? 'Recovery' : stage}
          suffix="• Stage 04"
          highlight="primary"
        />
      </div>
    </section>
  );
}
