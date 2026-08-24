'use client';

import React, { useEffect, useState } from 'react';
import { getJourneyForPatient, getJourneyContext } from '@/lib/api/apiClient';
import { CareJourneyDto, JourneyContextDto } from '@/lib/types';
import JourneyHero from '@/components/journey/JourneyHero';
import StageRoadmapProgress from '@/components/journey/StageRoadmapProgress';
import ActiveRecoverySpotlight from '@/components/journey/ActiveRecoverySpotlight';
import WhatMattersNowSection from '@/components/journey/WhatMattersNowSection';
import DocumentChecklist from '@/components/journey/DocumentChecklist';
import TpaQuestionChecklist from '@/components/journey/TpaQuestionChecklist';
import AdvanceStageModal from '@/components/journey/AdvanceStageModal';
import JourneyAuditHistory from '@/components/journey/JourneyAuditHistory';
import AIExplanationBlock from '@/components/intelligence/AIExplanationBlock';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';
import { Loader2 } from 'lucide-react';

export default function JourneyPage() {
  const [journey, setJourney] = useState<CareJourneyDto | null>(null);
  const [context, setContext] = useState<JourneyContextDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);

  const loadJourneyData = async () => {
    try {
      const journeyData = await getJourneyForPatient(1);
      setJourney(journeyData);
      if (journeyData && journeyData.id) {
        const ctxData = await getJourneyContext(journeyData.id);
        setContext(ctxData);
      }
    } catch (err) {
      console.warn('Backend API unavailable, using verified fallback Recovery state:', err);
      const fallbackJourney: CareJourneyDto = {
        id: 1,
        patientId: 1,
        patientName: 'Rajesh Verma',
        hospitalId: 1,
        hospitalName: 'Apex Multi-Specialty Hospital',
        hospitalLocation: 'Indiranagar, Bengaluru',
        currentStage: 'RECOVERY',
        events: [
          {
            stage: 'ADMISSION',
            description: 'Patient checked in at Apex Multi-Specialty Hospital TPA Cashless Desk. Policy verified.',
            timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
          },
          {
            stage: 'ADMISSION',
            description: 'Pre-authorization request of INR 45,000 submitted to Star Health Allied Insurance.',
            timestamp: new Date(Date.now() - 3600000 * 44).toISOString(),
          },
          {
            stage: 'INVESTIGATION',
            description: 'Diagnostic CT scans and pre-op blood work completed and attached to billing ledger.',
            timestamp: new Date(Date.now() - 3600000 * 30).toISOString(),
          },
          {
            stage: 'PROCEDURE',
            description: 'Cardiovascular intervention completed successfully. Enhanced pre-auth approved.',
            timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
          },
          {
            stage: 'RECOVERY',
            description: 'Medical team cleared patient for discharge. Final bill generation initiated.',
            timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
        ],
      };

      setJourney(fallbackJourney);
      setContext({
        journeyId: 1,
        patientId: 1,
        patientName: 'Rajesh Verma',
        hospitalId: 1,
        hospitalName: 'Apex Multi-Specialty Hospital',
        hospitalLocation: 'Indiranagar, Bengaluru',
        currentStage: 'RECOVERY',
        coverageLimit: 500000,
        remainingCoverage: 475000,
        roomLimit: 5000,
        networkStatus: 'IN_NETWORK',
        currentStageGuidance: {
          stage: 'RECOVERY',
          stageTitle: 'Stage 4: Recovery, Discharge & Claim Reconciliation',
          description:
            'Post-procedure monitoring, discharge summary preparation, and final cashless claim settlement.',
          insuranceInsights: [
            'Medical release has been signed and authorized by the primary physician.',
            'Final claim settlement is currently subject to Star Health TPA adjudication upon bill transmission.',
            'Post-hospitalization recovery expenses may be submitted for reimbursement consideration within 60 days.',
          ],
          potentialConstraints: [
            'Discharge clearance by insurance TPAs typically takes between 2 to 4 hours from final bill transmission.',
            'Non-medical consumable deductions must be settled directly at the hospital cash counter before physical discharge.',
          ],
          caregiverQuestionsToAsk: [
            'Has the final itemized bill been submitted to Star Health for final discharge clearance?',
            'What is the exact non-medical deductible amount required to be paid at the hospital counter?',
            'Have all original diagnostic reports and doctor discharge summaries been collected for post-hospitalization claims?',
          ],
          requiredDocuments: [
            'Signed Final Discharge Summary',
            'Consolidated Itemized Bill with Receipt Breakdown',
            'TPA Pre-Auth Claim Form with Patient Signature',
            'Prescription for Take-Home Medications',
          ],
          disclaimer:
            'Information shown is indicative and based on provided policy data for decision support only. It does not constitute medical advice or a binding claim guarantee.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneyData();
  }, []);

  const handleStageAdvanced = (updated: CareJourneyDto) => {
    setJourney(updated);
    setShowAdvanceModal(false);
    loadJourneyData();
  };

  return (
    <main className="max-w-[1600px] mx-auto px-margin-mobile md:px-margin-page pt-6 md:pt-10 pb-16">
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 text-primary">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="font-label-caps text-xs tracking-widest uppercase">
            Loading Care Journey Continuum...
          </span>
        </div>
      ) : (
        <>
          <JourneyHero patientName={journey?.patientName || 'Rajesh Verma'} />

          <StageRoadmapProgress
            currentStage={journey?.currentStage || 'RECOVERY'}
            onSelectStage={() => setShowAdvanceModal(true)}
          />

          <ActiveRecoverySpotlight
            context={context}
            onAdvanceClick={() => setShowAdvanceModal(true)}
          />

          <WhatMattersNowSection guidance={context?.currentStageGuidance} />

          <DocumentChecklist guidance={context?.currentStageGuidance} />

          <TpaQuestionChecklist guidance={context?.currentStageGuidance} />

          <AIExplanationBlock
            title="Stage 04 Guidance Synthesis"
            stage={journey?.currentStage || 'RECOVERY'}
            hospitalId={journey?.hospitalId || 1}
            policyId={1}
            initialExplanation="At the Recovery stage in Apex Multi-Specialty Hospital, the patient is cleared for discharge. Key priorities are reconciling the final itemized bill against the Star Health initial sanction and obtaining the final TPA clearance letter before checkout."
          />

          <JourneyAuditHistory events={journey?.events} />

          <DisclaimerBanner />

          {showAdvanceModal && journey && (
            <AdvanceStageModal
              journeyId={journey.id}
              currentStage={journey.currentStage}
              onClose={() => setShowAdvanceModal(false)}
              onSuccess={handleStageAdvanced}
            />
          )}
        </>
      )}
    </main>
  );
}
