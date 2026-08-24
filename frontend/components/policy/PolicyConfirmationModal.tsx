'use client';

import React, { useState } from 'react';
import { ExtractedPolicyDto, PolicyResponseDto } from '@/lib/types';
import { confirmPolicy } from '@/lib/api/apiClient';
import { X, Check, Loader2, ShieldCheck } from 'lucide-react';

interface PolicyConfirmationModalProps {
  extracted: ExtractedPolicyDto;
  onClose: () => void;
  onSuccess: (confirmed: PolicyResponseDto) => void;
}

export default function PolicyConfirmationModal({
  extracted,
  onClose,
  onSuccess,
}: PolicyConfirmationModalProps) {
  const [insurerName, setInsurerName] = useState(extracted.insurerName || '');
  const [policyType, setPolicyType] = useState(extracted.policyType || '');
  const [coverageLimit, setCoverageLimit] = useState(extracted.coverageLimit || 500000);
  const [roomLimit, setRoomLimit] = useState(extracted.roomLimit || 5000);
  const [roomCategory, setRoomCategory] = useState(extracted.roomCategory || 'Semi-Private Room (Twin Sharing AC)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extracted.policyId) {
      setError('Policy ID is missing for draft confirmation.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const confirmed = await confirmPolicy(extracted.policyId, {
        insurerName,
        policyType,
        coverageLimit: Number(coverageLimit),
        remainingCoverage: Number(coverageLimit),
        roomLimit: Number(roomLimit),
        roomCategory,
        confirmed: true,
        exclusions: extracted.exclusions,
      });
      onSuccess(confirmed);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to confirm policy parameters.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-2xl rounded-[32px] p-8 md:p-12 shadow-2xl border border-outline-variant/30 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-mint-surface text-primary flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-label-caps text-xs text-primary tracking-widest uppercase">
              CONFIRM EXTRACTION
            </span>
            <h3 className="font-title-lg text-2xl font-bold text-on-surface">
              Verify Insurance Parameters
            </h3>
          </div>
        </div>

        <p className="font-body-lg text-sm text-on-surface-variant mb-8 leading-relaxed">
          Review the normalized parameters extracted from your policy PDF schedule. You can make adjustments before activating matching intelligence.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleConfirm} className="space-y-6">
          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">
              Insurer Name
            </label>
            <input
              type="text"
              value={insurerName}
              onChange={(e) => setInsurerName(e.target.value)}
              className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-lg focus:outline-none focus:border-primary text-base"
              required
            />
          </div>

          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">
              Policy Plan / Product Name
            </label>
            <input
              type="text"
              value={policyType}
              onChange={(e) => setPolicyType(e.target.value)}
              className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-lg focus:outline-none focus:border-primary text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">
                Sum Insured / Coverage Limit (₹)
              </label>
              <input
                type="number"
                value={coverageLimit}
                onChange={(e) => setCoverageLimit(Number(e.target.value))}
                className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-lg focus:outline-none focus:border-primary text-base"
                required
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">
                Daily Room Rent Limit (₹/Day)
              </label>
              <input
                type="number"
                value={roomLimit}
                onChange={(e) => setRoomLimit(Number(e.target.value))}
                className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-lg focus:outline-none focus:border-primary text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">
              Eligible Room Category
            </label>
            <input
              type="text"
              value={roomCategory}
              onChange={(e) => setRoomCategory(e.target.value)}
              className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-lg focus:outline-none focus:border-primary text-base"
            />
          </div>

          <div className="pt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 rounded-full font-label-caps text-xs text-on-surface hover:bg-surface-container transition-colors uppercase tracking-wider"
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
                  Activating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirm &amp; Set Active Policy
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
