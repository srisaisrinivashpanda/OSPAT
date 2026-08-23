import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CompatibilityStatus, NetworkStatus, ScoreRating } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatConfidence(confidence: number | null): string {
  if (confidence == null) return 'Unknown';
  return `${Math.round(confidence * 100)}%`;
}

export function getScoreRatingLabel(rating: ScoreRating): string {
  switch (rating) {
    case 'HIGH_COMPATIBILITY': return 'High Compatibility';
    case 'MODERATE_COMPATIBILITY': return 'Moderate Compatibility';
    case 'LOW_COMPATIBILITY': return 'Low Compatibility';
  }
}

export function getScoreRatingColor(rating: ScoreRating): string {
  switch (rating) {
    case 'HIGH_COMPATIBILITY': return 'text-green-700';
    case 'MODERATE_COMPATIBILITY': return 'text-amber-600';
    case 'LOW_COMPATIBILITY': return 'text-red-600';
  }
}

export function getScoreRatingBg(rating: ScoreRating): string {
  switch (rating) {
    case 'HIGH_COMPATIBILITY': return 'bg-green-50 border-green-200';
    case 'MODERATE_COMPATIBILITY': return 'bg-amber-50 border-amber-200';
    case 'LOW_COMPATIBILITY': return 'bg-red-50 border-red-200';
  }
}

export function getCompatibilityStatusLabel(status: CompatibilityStatus): string {
  switch (status) {
    case 'WITHIN_STATED_LIMIT': return 'Within Stated Limit';
    case 'POLICY_CONSIDERATION': return 'Policy Consideration';
    case 'EXCEEDS_STATED_LIMIT': return 'Exceeds Stated Limit';
    case 'INFORMATION_UNAVAILABLE': return 'Information Unavailable';
  }
}

export function getCompatibilityStatusColor(status: CompatibilityStatus): string {
  switch (status) {
    case 'WITHIN_STATED_LIMIT': return 'text-green-700 bg-green-50';
    case 'POLICY_CONSIDERATION': return 'text-amber-700 bg-amber-50';
    case 'EXCEEDS_STATED_LIMIT': return 'text-red-700 bg-red-50';
    case 'INFORMATION_UNAVAILABLE': return 'text-slate-600 bg-slate-50';
  }
}

export function getNetworkStatusLabel(status: NetworkStatus): string {
  switch (status) {
    case 'IN_NETWORK': return 'Listed Network Hospital';
    case 'OUT_OF_NETWORK': return 'Out of Network';
    case 'UNKNOWN': return 'Network Status Unknown';
  }
}

export function getNetworkStatusColor(status: NetworkStatus): string {
  switch (status) {
    case 'IN_NETWORK': return 'text-green-700 bg-green-50';
    case 'OUT_OF_NETWORK': return 'text-red-700 bg-red-50';
    case 'UNKNOWN': return 'text-slate-600 bg-slate-50';
  }
}

export function getStageIndex(stage: string): number {
  const stages = ['ADMISSION', 'INVESTIGATION', 'PROCEDURE', 'RECOVERY'];
  return stages.indexOf(stage);
}

export function getStageLabel(stage: string): string {
  switch (stage) {
    case 'ADMISSION': return 'Admission';
    case 'INVESTIGATION': return 'Investigation';
    case 'PROCEDURE': return 'Procedure';
    case 'RECOVERY': return 'Recovery';
    default: return stage;
  }
}

export function getNextStage(current: string): string | null {
  const stages = ['ADMISSION', 'INVESTIGATION', 'PROCEDURE', 'RECOVERY'];
  const idx = stages.indexOf(current);
  return idx >= 0 && idx < stages.length - 1 ? stages[idx + 1] : null;
}
