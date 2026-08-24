// Formatting utilities for OSPAT

/**
 * Format currency in Indian numbering format (e.g. ₹5,00,000)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format compact currency (e.g. ₹5L, ₹5,000)
 */
export function formatCompactCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(amount % 10000000 === 0 ? 0 : 1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
  }
  return formatCurrency(amount);
}

/**
 * Format ISO date string into readable format
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Convert compatibility score to color token
 */
export function getScoreColor(score: number): {
  stroke: string;
  text: string;
  badgeBg: string;
  label: string;
} {
  if (score >= 80) {
    return {
      stroke: '#006861', // Primary deep clinical teal
      text: 'text-primary',
      badgeBg: 'bg-primary/10 text-primary',
      label: 'High Alignment',
    };
  }
  if (score >= 50) {
    return {
      stroke: '#F4B740', // Amber accent
      text: 'text-amber-accent',
      badgeBg: 'bg-amber-accent/10 text-amber-accent',
      label: 'Moderate Alignment',
    };
  }
  return {
    stroke: '#934624', // Tertiary ochre
    text: 'text-tertiary',
    badgeBg: 'bg-tertiary/10 text-tertiary',
    label: 'Limited Alignment',
  };
}
