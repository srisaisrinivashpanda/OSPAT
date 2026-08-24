import React from 'react';

interface StatNumeralProps {
  label: string;
  value: string | number;
  suffix?: string;
  highlight?: 'primary' | 'neutral' | 'amber' | 'tertiary';
  topBorder?: boolean;
  className?: string;
}

export default function StatNumeral({
  label,
  value,
  suffix,
  highlight = 'neutral',
  topBorder = true,
  className = '',
}: StatNumeralProps) {
  const highlightClasses = {
    primary: 'text-primary',
    neutral: 'text-on-surface',
    amber: 'text-amber-accent',
    tertiary: 'text-tertiary',
  }[highlight];

  const borderClass = topBorder
    ? highlight === 'primary'
      ? 'border-t-2 border-primary/40'
      : 'border-t-2 border-outline-variant/30'
    : '';

  return (
    <div className={`pt-6 ${borderClass} ${className}`}>
      <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest mb-3">
        {label}
      </div>
      <div className={`text-[48px] md:text-[60px] lg:text-[68px] leading-[1.05] font-bold tracking-tight ${highlightClasses}`}>
        {value}
        {suffix && (
          <span className="text-[24px] md:text-[32px] leading-[1.2] font-medium text-on-surface-variant/60 ml-1">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
