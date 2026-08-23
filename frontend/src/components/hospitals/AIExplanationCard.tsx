'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { explainMatch } from '@/lib/api/aiApi';
import type { AIExplainResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface AIExplanationCardProps {
  hospitalId: number;
  policyId?: number | null;
}

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: AIExplainResponse }
  | { status: 'error'; message: string };

export function AIExplanationCard({ hospitalId, policyId }: AIExplanationCardProps) {
  const [state, setState] = useState<State>({ status: 'idle' });
  const [expanded, setExpanded] = useState(false);

  async function handleGenerate() {
    setState({ status: 'loading' });
    try {
      const result = await explainMatch({
        hospitalId,
        policyId: policyId ?? null,
        stage: null,
      });
      setState({ status: 'success', data: result });
      setExpanded(true);
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to generate explanation.',
      });
    }
  }

  function toggleExpanded() {
    if (state.status === 'success') setExpanded((v) => !v);
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={state.status === 'success' ? toggleExpanded : undefined}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-teal-50 border-b border-slate-200 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-semibold text-slate-700">Why this match?</span>
          <span className="text-[10px] font-medium text-violet-600 bg-violet-100 rounded-full px-2 py-0.5">
            AI-generated · Not a medical recommendation
          </span>
        </div>
        {state.status === 'success' && (
          expanded
            ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
            : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>

      {/* Body */}
      <div className="px-4 py-4">
        {state.status === 'idle' && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-slate-500">
              Get an AI-generated explanation of why this hospital scored the way it did
              against your policy criteria.
            </p>
            <Button onClick={handleGenerate} size="sm" variant="outline" className="gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              Generate AI explanation
            </Button>
          </div>
        )}

        {state.status === 'loading' && (
          <div className="flex items-center gap-3 py-2">
            <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
            <span className="text-sm text-slate-500">Generating explanation…</span>
          </div>
        )}

        {state.status === 'error' && (
          <div className="flex items-start gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p>{state.message}</p>
              <Button onClick={handleGenerate} size="sm" variant="outline">
                Try again
              </Button>
            </div>
          </div>
        )}

        {state.status === 'success' && expanded && (
          <div className="space-y-3">
            {/* Explanation text */}
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {state.data.explanation}
            </p>

            {/* Disclaimer */}
            <p className="text-xs text-slate-400 italic leading-relaxed border-t border-slate-100 pt-3">
              {state.data.disclaimer}
            </p>

            {/* Footer meta */}
            <p className="text-[10px] text-slate-400">
              AI-generated explanation · Not a medical recommendation · Provider:{' '}
              <span className="font-medium">{state.data.providerUsed}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
