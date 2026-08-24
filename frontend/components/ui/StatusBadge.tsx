import React from 'react';

interface StatusBadgeProps {
  status: 'IN_NETWORK' | 'OUT_OF_NETWORK' | 'ACTIVE' | 'DRAFT' | 'WITHIN_STATED_LIMIT' | 'POLICY_CONSIDERATION' | 'EXCEEDS_STATED_LIMIT' | string;
  label?: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  let displayLabel = label;
  let bgClass = 'bg-surface-container-high text-on-surface-variant';

  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3.5 py-1.5 text-[11px]';

  switch (status) {
    case 'IN_NETWORK':
      displayLabel = displayLabel || 'IN-NETWORK';
      bgClass = 'bg-mint-surface text-primary border border-primary/20 font-bold';
      break;
    case 'OUT_OF_NETWORK':
      displayLabel = displayLabel || 'OUT-OF-NETWORK';
      bgClass = 'bg-tertiary/10 text-tertiary border border-tertiary/20 font-bold';
      break;
    case 'ACTIVE':
      displayLabel = displayLabel || 'ACTIVE POLICY';
      bgClass = 'bg-primary/10 text-primary border border-primary/20 font-bold';
      break;
    case 'DRAFT':
      displayLabel = displayLabel || 'DRAFT EXTRACTION';
      bgClass = 'bg-amber-accent/15 text-on-surface border border-amber-accent/30 font-bold';
      break;
    case 'WITHIN_STATED_LIMIT':
      displayLabel = displayLabel || 'WITHIN LIMIT';
      bgClass = 'bg-mint-surface text-primary border border-primary/20 font-bold';
      break;
    case 'POLICY_CONSIDERATION':
      displayLabel = displayLabel || 'CONSIDERATION';
      bgClass = 'bg-amber-accent/15 text-on-surface border border-amber-accent/30 font-bold';
      break;
    case 'EXCEEDS_STATED_LIMIT':
      displayLabel = displayLabel || 'EXCEEDS LIMIT';
      bgClass = 'bg-tertiary/10 text-tertiary border border-tertiary/20 font-bold';
      break;
    default:
      displayLabel = displayLabel || status;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-label-caps uppercase tracking-wider ${sizeClass} ${bgClass}`}
    >
      {displayLabel}
    </span>
  );
}
