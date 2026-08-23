'use client';

import { useState } from 'react';
import { MessageSquare, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CaregiverQuestionsProps {
  questions: string[];
}

export function CaregiverQuestions({ questions }: CaregiverQuestionsProps) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    Array(questions.length).fill(false),
  );

  if (questions.length === 0) return null;

  const toggle = (index: number) => {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const checkedCount = checked.filter(Boolean).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-800 leading-snug">
                Questions you may want to ask at the hospital
              </h3>
              {checkedCount > 0 && (
                <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 shrink-0">
                  {checkedCount}/{questions.length}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mt-1 pl-8">
          Informational prompts only — not medical advice. Consult your treating physician.
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-1">
        {questions.map((question, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={checked[i]}
            className={cn(
              'w-full flex items-start gap-3 text-left rounded-lg px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
              checked[i]
                ? 'bg-green-50 hover:bg-green-50'
                : 'hover:bg-slate-50',
            )}
          >
            {/* Custom checkbox */}
            <span
              aria-hidden
              className={cn(
                'w-4 h-4 mt-0.5 rounded border-2 shrink-0 flex items-center justify-center transition-colors',
                checked[i]
                  ? 'bg-green-500 border-green-500'
                  : 'border-teal-400 bg-white',
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
              {question}
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
