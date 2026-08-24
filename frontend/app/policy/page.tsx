'use client';

import React, { useEffect, useState } from 'react';
import { getActivePolicyForPatient } from '@/lib/api/apiClient';
import { PolicyResponseDto, ExtractedPolicyDto } from '@/lib/types';
import PolicyHero from '@/components/policy/PolicyHero';
import DocumentIntakeZone from '@/components/policy/DocumentIntakeZone';
import PolicyMetricsOverview from '@/components/policy/PolicyMetricsOverview';
import NetworkHospitalCloud from '@/components/policy/NetworkHospitalCloud';
import PolicyExclusionsList from '@/components/policy/PolicyExclusionsList';
import PolicyConfirmationModal from '@/components/policy/PolicyConfirmationModal';
import { CheckCircle2 } from 'lucide-react';

export default function PolicyPage() {
  const [policy, setPolicy] = useState<PolicyResponseDto | null>(null);
  const [extractedDraft, setExtractedDraft] = useState<ExtractedPolicyDto | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    async function loadActivePolicy() {
      try {
        const data = await getActivePolicyForPatient(1);
        setPolicy(data);
      } catch (err) {
        console.warn('Backend API unavailable, using fallback Star Health policy:', err);
        setPolicy({
          id: 1,
          patientId: 1,
          patientName: 'Rajesh Verma',
          insurerName: 'Star Health Allied Insurance',
          policyType: 'Family Health Optima Comprehensive',
          coverageLimit: 500000,
          remainingCoverage: 475000,
          roomLimit: 5000,
          roomCategory: 'Semi-Private Room (Twin Sharing AC)',
          policyStatus: 'ACTIVE',
          sourceDocument: 'StarHealth_FamilyOptima_Sample.pdf',
          confirmed: true,
          exclusions: [
            'Procedures primarily focused on altering physical appearance without underlying medical necessity are strictly excluded from baseline coverage.',
            'Administrative charges, registration fees, and non-therapeutic items provided during hospital stay must be settled out-of-pocket.',
            'Conditions formally diagnosed prior to policy inception remain subject to a mandatory 24-month waiting period before claims can be processed.',
          ],
          networkHospitals: [
            { hospitalId: 1, hospitalName: 'Apex Multi-Specialty Hospital', location: 'Indiranagar, Bengaluru' },
            { hospitalId: 2, hospitalName: 'Metro Care Medical Institute', location: 'Koramangala, Bengaluru' },
            { hospitalId: 3, hospitalName: 'St. Jude Memorial Health Center', location: 'Whitefield, Bengaluru' },
            { hospitalId: 4, hospitalName: 'Zenith Super Speciality Hospital', location: 'Jayanagar, Bengaluru' },
          ],
        });
      }
    }
    loadActivePolicy();
  }, []);

  const handleExtractionComplete = (extracted: ExtractedPolicyDto) => {
    setExtractedDraft(extracted);
    setShowConfirmModal(true);
  };

  const handleConfirmSuccess = (confirmed: PolicyResponseDto) => {
    setPolicy(confirmed);
    setShowConfirmModal(false);
    setSuccessBanner(`Policy successfully verified & activated: ${confirmed.insurerName} (${confirmed.policyType})`);
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  return (
    <main className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-page pt-10 md:pt-16 pb-24">
      {successBanner && (
        <div className="mb-8 p-4 px-6 rounded-2xl bg-mint-surface border border-primary/30 text-primary font-body-lg text-sm flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* 1. Hero Section */}
      <PolicyHero />

      {/* 2. Immersive Upload Section */}
      <DocumentIntakeZone onExtractionComplete={handleExtractionComplete} />

      {/* 3. 4 Non-Card Data Points */}
      <PolicyMetricsOverview policy={policy} />

      {/* 4. Connected Network Hospital Nodes */}
      <NetworkHospitalCloud policy={policy} />

      {/* 5. What To Watch For (01, 02, 03 Editorial Exclusions) */}
      <PolicyExclusionsList policy={policy} />

      {/* 6. Centered Stitch Disclaimer */}
      <section className="text-center reveal my-16">
        <p className="font-label-caps text-xs text-on-surface-variant/60 max-w-3xl mx-auto leading-relaxed font-normal normal-case">
          * Data presented is derived from automated intelligence extraction and is intended for indicative purposes only. Always consult your final policy schedule for definitive legal coverage terms.
        </p>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && extractedDraft && (
        <PolicyConfirmationModal
          extracted={extractedDraft}
          onClose={() => setShowConfirmModal(false)}
          onSuccess={handleConfirmSuccess}
        />
      )}
    </main>
  );
}
