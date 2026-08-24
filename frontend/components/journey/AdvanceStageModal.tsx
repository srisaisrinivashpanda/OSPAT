'use client';

import React, { useState } from 'react';
import { JourneyStage, CareJourneyDto } from '@/lib/types';
import { updateJourneyStage } from '@/lib/api/apiClient';
import { X, Check, Loader2, ArrowRight } from 'lucide-react';

interface AdvanceStageModalProps {
  journeyId: number;
  currentStage: JourneyStage;
  onClose: () => void;
  onSuccess: (updated: CareJourneyDto) => void;
}

const STAGES: { id: JourneyStage; title: string; desc: string }[] = [
  { id: 'ADMISSION', title: '01 Admission', desc: 'Patient intake & cashless pre-authorization' },
  { id: 'INVESTIGATION', title: '02 Investigation', desc: 'In-patient diagnostics & clinical workup' },
  { id: 'PROCEDURE', title: '03 Procedure', desc: 'Surgical/therapeutic procedural care' },
  { id: 'RECOVERY', title: '04 Recovery', desc: 'Discharge processing & final claim settlement' },
];

export default function AdvanceStageModal({
  journeyId,
  currentStage,
  onClose,
  onSuccess,
}: AdvanceStageModalProps) {
  const [selectedStage, setSelectedStage] = useState<JourneyStage>(currentStage);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updated = await updateJourneyStage(journeyId, selectedStage, note);
      onSuccess(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update care journey stage.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-xl rounded-[32px] p-8 md:p-10 shadow-2xl border border-outline-variant/30 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="font-label-caps text-xs text-primary tracking-widest uppercase block mb-2">
          CARE JOURNEY TRANSITION
        </span>
        <h3 className="font-title-lg text-2xl font-bold text-on-surface mb-6">
          Update Patient Care Stage
        </h3>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-error-container text-on-error-container text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-3">
              Select Target Stage
            </label>
            <div className="space-y-3">
              {STAGES.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedStage(s.id)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedStage === s.id
                      ? 'bg-mint-surface border-primary font-semibold text-primary'
                      : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:border-primary/40'
                  }`}
                >
                  <div>
                    <h5 className="font-title-lg text-base">{s.title}</h5>
                    <p className="font-body-lg text-xs text-on-surface-variant/80 mt-0.5">{s.desc}</p>
                  </div>
                  {selectedStage === s.id && <Check className="w-5 h-5 text-primary" />}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">
              Clinical / Administrative Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Doctor signed discharge release, final bill submitted to TPA..."
              className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-lg focus:outline-none focus:border-primary text-base"
            />
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full font-label-caps text-xs text-on-surface hover:bg-surface-container transition-colors uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-primary text-on-primary rounded-full font-label-caps text-xs uppercase tracking-widest hover:bg-primary-container shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Save Stage Transition
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
