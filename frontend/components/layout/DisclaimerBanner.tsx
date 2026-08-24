import React from 'react';
import { Info } from 'lucide-react';

interface DisclaimerBannerProps {
  text?: string;
  className?: string;
}

export default function DisclaimerBanner({
  text = 'Data presented is derived from automated intelligence extraction and deterministic rule evaluation. Intended for indicative decision support only. Always verify final coverage with your hospital TPA desk and insurer.',
  className = '',
}: DisclaimerBannerProps) {
  return (
    <div
      className={`py-4 px-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-4 ${className}`}
    >
      <Info className="w-5 h-5 text-primary flex-shrink-0" />
      <p className="font-label-caps text-[11px] text-on-surface-variant/80 leading-relaxed font-normal normal-case">
        {text}
      </p>
    </div>
  );
}
