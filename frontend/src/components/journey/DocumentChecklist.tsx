'use client';

import { useState } from 'react';
import { FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface DocumentChecklistProps {
  documents: string[];
}

export function DocumentChecklist({ documents }: DocumentChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    Array(documents.length).fill(false),
  );

  if (documents.length === 0) return null;

  const toggle = (index: number) => {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const checkedCount = checked.filter(Boolean).length;
  const allDone = checkedCount === documents.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-800 leading-snug">
                Documents checklist
              </h3>
              {checkedCount > 0 && (
                <span
                  className={cn(
                    'text-[10px] font-semibold rounded-full px-2 py-0.5 shrink-0 border',
                    allDone
                      ? 'text-green-700 bg-green-50 border-green-200'
                      : 'text-slate-500 bg-slate-50 border-slate-200',
                  )}
                >
                  {checkedCount}/{documents.length}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mt-1 pl-8">
          Typical documents required at this stage — verify with hospital&nbsp;TPA desk.
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-1">
        {documents.map((document, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={checked[i]}
            className={cn(
              'w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
              checked[i]
                ? 'bg-green-50 hover:bg-green-50'
                : 'hover:bg-slate-50',
            )}
          >
            {/* Custom checkbox */}
            <span
              aria-hidden
              className={cn(
                'w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors',
                checked[i]
                  ? 'bg-green-500 border-green-500'
                  : 'border-slate-300 bg-white',
              )}
            >
              {checked[i] && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
            </span>

            <span
              className={cn(
                'text-sm leading-relaxed transition-colors',
                checked[i]
                  ? 'line-through text-slate-400'
                  : 'text-slate-700',
              )}
            >
              {document}
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
