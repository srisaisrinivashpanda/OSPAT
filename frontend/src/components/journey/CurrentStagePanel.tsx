import { Shield, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  cn,
  formatCurrency,
  getStageLabel,
  getNetworkStatusLabel,
  getNetworkStatusColor,
} from '@/lib/utils';
import type { JourneyContext } from '@/lib/types';

interface CurrentStagePanelProps {
  context: JourneyContext;
}

export function CurrentStagePanel({ context }: CurrentStagePanelProps) {
  const {
    currentStage,
    currentStageGuidance,
    indicativeRemainingBalance,
    roomLimit,
    networkStatus,
  } = context;

  const {
    stageTitle,
    description,
    insuranceInsights,
    potentialConstraints,
    disclaimer,
  } = currentStageGuidance;

  return (
    <Card className="overflow-hidden">
      {/* Coloured top accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-500 to-teal-400" />

      <CardHeader className="pb-4 pt-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="active">{getStageLabel(currentStage)}</Badge>
          <Badge variant="secondary">Active Stage</Badge>
        </div>
        <h2 className="text-xl font-bold text-slate-900 leading-snug">{stageTitle}</h2>
        <p className="text-sm text-slate-500 leading-relaxed mt-1">{description}</p>
      </CardHeader>

      <CardContent className="space-y-6 pb-6">
        {/* ── Policy Information ── */}
        <section aria-labelledby="policy-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-teal-600" />
            </div>
            <h3 id="policy-heading" className="text-sm font-semibold text-teal-700">
              Policy Information
            </h3>
          </div>

          {/* Coverage metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg bg-teal-50 border border-teal-100 p-4">
              <p className="text-[11px] font-semibold text-teal-500 uppercase tracking-wide mb-1">
                Indicative Balance
              </p>
              <p className="text-xl font-bold text-teal-800 leading-none">
                {formatCurrency(indicativeRemainingBalance)}
              </p>
              <p className="text-[10px] text-teal-500/80 mt-1.5 leading-snug">
                Verify with hospital&nbsp;/&nbsp;TPA desk
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Room Limit
              </p>
              <p className="text-xl font-bold text-slate-800 leading-none">
                {formatCurrency(roomLimit)}
                <span className="text-xs font-normal text-slate-400 ml-0.5">/day</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1.5">Stated room limit</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col justify-between">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Network Status
              </p>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                  getNetworkStatusColor(networkStatus),
                )}
              >
                {getNetworkStatusLabel(networkStatus)}
              </span>
            </div>
          </div>

          {/* Insurance insights */}
          {insuranceInsights.length > 0 && (
            <ul className="space-y-2" aria-label="Policy insights">
              {insuranceInsights.map((insight, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg bg-teal-50 border border-teal-100 px-4 py-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" aria-hidden />
                  <span className="text-sm text-teal-900 leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Potential Constraints ── */}
        {potentialConstraints.length > 0 && (
          <section aria-labelledby="constraints-heading" className="space-y-4">
            <div className="border-t border-slate-100 pt-5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <h3 id="constraints-heading" className="text-sm font-semibold text-amber-700">
                Potential Constraints
              </h3>
            </div>
            <ul className="space-y-2" aria-label="Potential policy constraints">
              {potentialConstraints.map((constraint, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3"
                >
                  <AlertTriangle
                    className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0"
                    aria-hidden
                  />
                  <span className="text-sm text-amber-900 leading-relaxed">{constraint}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Disclaimer ── */}
        {disclaimer && (
          <div className="flex items-start gap-2 border-t border-slate-100 pt-4">
            <Info className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" aria-hidden />
            <p className="text-xs italic text-slate-400 leading-relaxed">{disclaimer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
