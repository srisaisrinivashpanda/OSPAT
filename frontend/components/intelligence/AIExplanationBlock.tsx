'use client';

import React, { useState } from 'react';
import { Sparkles, ShieldAlert, Loader2 } from 'lucide-react';
import { getAIExplanation } from '@/lib/api/apiClient';

interface AIExplanationBlockProps {
  initialExplanation?: string;
  policyId?: number;
  hospitalId?: number;
  stage?: string;
  title?: string;
}

export default function AIExplanationBlock({
  initialExplanation,
  policyId = 1,
  hospitalId,
  stage,
  title = 'Intelligence Decision Support',
}: AIExplanationBlockProps) {
  const [explanation, setExplanation] = useState<string | null>(initialExplanation || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAIExplanation({ policyId, hospitalId, stage });
      setExplanation(res.explanation);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to synthesize explanation at this time.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-[28px] bg-mint-surface/50 border border-primary/20 backdrop-blur-sm relative overflow-hidden my-8 md:my-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-primary/15">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-label-caps text-xs text-primary tracking-widest uppercase font-bold">
              {title}
            </span>
            <h4 className="font-title-lg text-lg md:text-xl font-bold text-on-surface">
              Plain-English Guidance
            </h4>
          </div>
        </div>

        {!explanation && (
          <button
            onClick={fetchExplanation}
            disabled={loading}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-full font-label-caps text-xs tracking-wider uppercase hover:bg-primary-container transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Synthesizing...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Insights
              </>
            )}
          </button>
        )}
      </div>

      {explanation && (
        <div className="pt-4 space-y-3">
          <p className="font-body-xl text-base md:text-lg text-on-surface leading-relaxed">
            {explanation}
          </p>
          <div className="flex items-start gap-2 pt-1 text-on-surface-variant/70">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="font-label-caps text-[11px] normal-case">
              This synthesis is intended for decision support only and does not constitute medical advice or a binding claim guarantee.
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="pt-4 text-xs text-tertiary">
          {error}
        </div>
      )}
    </div>
  );
}
