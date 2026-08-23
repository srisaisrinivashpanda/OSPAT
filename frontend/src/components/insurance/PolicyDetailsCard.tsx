'use client';

import {
  Shield,
  FileText,
  Building2,
  CalendarDays,
  AlertCircle,
  Info,
} from 'lucide-react';
import type { PolicyResponse } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PolicyStatusBadge } from '@/components/insurance/PolicyStatusBadge';

interface PolicyDetailsCardProps {
  policy: PolicyResponse;
}

export function PolicyDetailsCard({ policy }: PolicyDetailsCardProps) {
  return (
    <Card>
      {/* ── Header ───────────────────────────────────────────── */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <CardTitle>
                {policy.insurerName ?? 'Insurance Policy'}
              </CardTitle>
              {policy.policyType && (
                <p className="text-sm text-slate-500 mt-0.5">{policy.policyType}</p>
              )}
            </div>
          </div>
          <PolicyStatusBadge status={policy.policyStatus} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ── Coverage Summary ──────────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Coverage Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <CoverageStat
              label="Sum Insured"
              value={formatCurrency(policy.coverageLimit)}
            />
            <CoverageStat
              label="Remaining Balance"
              value={formatCurrency(policy.indicativeRemainingBalance)}
              sublabel="Indicative"
              sublabelVariant="info"
            />
            <CoverageStat
              label="Daily Room Limit"
              value={formatCurrency(policy.roomLimit)}
              sublabel="Within stated policy limit"
              sublabelVariant="muted"
            />
            <CoverageStat
              label="Room Category"
              value={policy.roomCategory ?? '—'}
            />
          </div>
        </section>

        {/* ── Document & Dates ──────────────────────────────── */}
        <section className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Document Info
          </h3>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {policy.sourceDocument && (
              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{policy.sourceDocument}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-600">
              <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Added {formatDate(policy.createdAt)}</span>
            </div>
            {policy.updatedAt !== policy.createdAt && (
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Updated {formatDate(policy.updatedAt)}</span>
              </div>
            )}
          </div>
        </section>

        {/* ── Network Hospitals ─────────────────────────────── */}
        {policy.networkHospitals.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Network Hospitals ({policy.networkHospitals.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {policy.networkHospitals.map((h) => (
                <span
                  key={h.hospitalId}
                  className="inline-flex flex-col px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                >
                  <span className="font-medium text-slate-700">{h.hospitalName}</span>
                  {h.location && (
                    <span className="text-slate-400 mt-0.5">{h.location}</span>
                  )}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Exclusions ────────────────────────────────────── */}
        {policy.exclusions.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Exclusions ({policy.exclusions.length})
            </h3>
            <ul className="space-y-1.5">
              {policy.exclusions.map((ex, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="inline-block mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <span className="text-slate-600">{ex}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Disclaimer ────────────────────────────────────── */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Information shown is based on the provided policy data and is indicative only.
            Verify coverage details directly with your insurer before making healthcare decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Helper sub-component ────────────────────────────────────────

interface CoverageStatProps {
  label: string;
  value: string;
  sublabel?: string;
  sublabelVariant?: 'info' | 'muted';
}

function CoverageStat({ label, value, sublabel, sublabelVariant }: CoverageStatProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-base font-semibold text-slate-800">{value}</p>
      {sublabel && (
        <p
          className={
            sublabelVariant === 'info'
              ? 'text-xs text-teal-600 font-medium'
              : 'text-xs text-slate-400'
          }
        >
          {sublabel}
        </p>
      )}
    </div>
  );
}
