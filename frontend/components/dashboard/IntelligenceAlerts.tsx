import React from 'react';
import { AlertCircle, ArrowUpRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface IntelligenceAlertsProps {
  alerts?: string[];
  actions?: string[];
}

export default function IntelligenceAlerts({
  alerts = [],
  actions = [],
}: IntelligenceAlertsProps) {
  const defaultAlerts = [
    'Policy verified: Star Health Allied Insurance (Family Health Optima). Indicative balance: ₹4,75,000.',
    'Apex Multi-Specialty Hospital: In-Network cashless facility active with ₹5,000/day room rent cap adherence.',
    'Discharge approval window: Insurance TPA review typically requires 2 to 4 hours from final bill transmission.',
  ];

  const defaultActions = [
    'Review final itemized discharge bill for non-medical consumable deductions.',
    'Verify treating physician discharge summary and diagnostic laboratory reports.',
    'Confirm cashless final authorization settlement amount with hospital TPA counter.',
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;
  const displayActions = actions.length > 0 ? actions : defaultActions;

  return (
    <section className="mb-10 md:mb-12 reveal stagger-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
        {/* Left: Intelligence Considerations */}
        <div>
          <div className="flex items-center gap-3 mb-6 border-b border-on-surface/30 pb-3">
            <span className="font-label-caps text-xs text-primary uppercase tracking-widest font-bold">01</span>
            <h3 className="font-headline-section-mobile text-xl font-bold text-on-surface uppercase">
              Clinical &amp; Policy Considerations
            </h3>
          </div>

          <div className="space-y-4">
            {displayAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 transition-colors"
              >
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="font-body-lg text-sm text-on-surface leading-relaxed">
                  {alert}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Suggested Caregiver Actions */}
        <div>
          <div className="flex items-center gap-3 mb-6 border-b border-on-surface/30 pb-3">
            <span className="font-label-caps text-xs text-primary uppercase tracking-widest font-bold">02</span>
            <h3 className="font-headline-section-mobile text-xl font-bold text-on-surface uppercase">
              Recommended Next Actions
            </h3>
          </div>

          <div className="space-y-4">
            {displayActions.map((action, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 transition-colors group"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <p className="font-body-lg text-sm text-on-surface leading-relaxed">
                    {action}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href="/journey"
              className="inline-flex items-center gap-2 text-primary font-label-caps text-xs tracking-wider uppercase hover:underline font-bold"
            >
              Go to Care Journey Guidance
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
