import { Shield, IndianRupee, BedDouble, Building2, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { DashboardSummary } from '@/lib/types';

interface InsuranceSummaryCardsProps {
  data: DashboardSummary;
}

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

function MetricCard({ label, value, sublabel, icon: Icon, iconColor, iconBg }: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">
            {label}
          </p>
          <p className="mt-1.5 text-xl font-semibold text-slate-900 leading-tight truncate">
            {value}
          </p>
        </div>
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
        </div>
      </div>
      {sublabel && (
        <p className="text-xs text-slate-400 leading-relaxed">{sublabel}</p>
      )}
    </div>
  );
}

export function InsuranceSummaryCards({ data }: InsuranceSummaryCardsProps) {
  const {
    activePolicy,
    totalCoverageLimit,
    indicativeRemainingBalance,
    roomDailyLimit,
    roomCategory,
    networkHospitalsCount,
    totalHospitalsAvailable,
  } = data;

  if (!activePolicy) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">No active policy</p>
          <p className="text-sm text-amber-700 mt-0.5">
            Upload your insurance policy document to see your coverage details and indicative
            balances.
          </p>
        </div>
      </div>
    );
  }

  const cards: MetricCardProps[] = [
    {
      label: 'Indicative Sum Insured',
      value: formatCurrency(totalCoverageLimit),
      sublabel: 'As per uploaded policy document',
      icon: Shield,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
    },
    {
      label: 'Indicative Balance',
      value: formatCurrency(indicativeRemainingBalance),
      sublabel: 'Indicative — verify with insurer',
      icon: IndianRupee,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
    },
    {
      label: 'Room Limit',
      value: `${formatCurrency(roomDailyLimit)}/day`,
      sublabel: roomCategory || 'Category as per policy',
      icon: BedDouble,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
    },
    {
      label: 'Network Hospitals',
      value: `${networkHospitalsCount} linked`,
      sublabel: `${totalHospitalsAvailable} total available`,
      icon: Building2,
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
}
