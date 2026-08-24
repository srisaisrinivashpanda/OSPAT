import React from 'react';
import Link from 'next/link';

export default function EditorialFooter() {
  return (
    <footer className="w-full py-10 md:py-12 px-margin-mobile md:px-margin-page bg-surface-container-lowest border-t border-outline-variant/20 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 max-w-[1600px] mx-auto">
        <div className="md:w-1/2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-title-lg text-lg font-bold text-primary">OSPAT Intelligence</span>
            <span className="font-label-caps text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-bold">
              DECISION SUPPORT
            </span>
          </div>
          <p className="font-label-caps text-xs text-on-surface-variant/80 leading-relaxed max-w-xl font-normal normal-case">
            © {new Date().getFullYear()} OSPAT Healthcare Intelligence. All clinical insights and policy compatibility evaluations are deterministic decision-support recommendations. Indicative balances and room caps are derived from supplied policy schedules and do not constitute legal claim adjudications or diagnostic medical advice.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 items-center pt-1">
          <Link
            href="/policy"
            className="text-on-surface-variant/70 hover:text-primary transition-colors font-label-caps text-xs"
          >
            Policy Intelligence
          </Link>
          <Link
            href="/hospitals"
            className="text-on-surface-variant/70 hover:text-primary transition-colors font-label-caps text-xs"
          >
            Hospital Matching
          </Link>
          <Link
            href="/journey"
            className="text-on-surface-variant/70 hover:text-primary transition-colors font-label-caps text-xs"
          >
            Care Journey
          </Link>
          <span className="text-outline-variant/40">|</span>
          <span className="text-on-surface-variant/60 font-label-caps text-xs">
            Bangalore Hospital Network v2.4
          </span>
        </div>
      </div>
    </footer>
  );
}
