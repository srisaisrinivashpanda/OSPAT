'use client';

import { CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PolicyStatusBadgeProps {
  status: 'DRAFT' | 'ACTIVE';
}

export function PolicyStatusBadge({ status }: PolicyStatusBadgeProps) {
  if (status === 'ACTIVE') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
          'bg-green-50 text-green-700 border border-green-200',
        )}
      >
        <CheckCircle className="w-3 h-3" />
        Active
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        'bg-slate-100 text-slate-600 border border-slate-200',
      )}
    >
      <Clock className="w-3 h-3" />
      Draft
    </span>
  );
}
