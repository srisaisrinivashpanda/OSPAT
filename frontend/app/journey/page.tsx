'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import TopNavBar from '@/components/layout/TopNavBar';
import GlobalFooter from '@/components/layout/GlobalFooter';
import { api } from '@/lib/api/apiClient';
import { CareJourneyDto, JourneyContextDto, StageGuidanceDto, PolicyResponseDto } from '@/lib/types';

type StageType = 'ADMISSION' | 'INVESTIGATION' | 'PROCEDURE' | 'RECOVERY';

const STAGES: { id: StageType; label: string; index: number }[] = [
  { id: 'ADMISSION', label: 'Admission', index: 1 },
  { id: 'INVESTIGATION', label: 'Investigation', index: 2 },
  { id: 'PROCEDURE', label: 'Procedure', index: 3 },
  { id: 'RECOVERY', label: 'Recovery', index: 4 },
];

const STAGE_DATA: Record<
  StageType,
  {
    title: string;
    description: string;
    policyConsiderations: { label: string; value: string; status?: 'safe' | 'warning' | 'neutral' }[];
    whatMattersNow: string[];
    requiredDocuments: string[];
    tpaQuestions: string[];
    consumablesWarning?: string;
  }
> = {
  ADMISSION: {
    title: 'Admission & Pre-Authorization',
    description:
      'Admission is the entry stage of your care journey. The information below highlights initial pre-authorization requirements, room eligibility verification, and intake checklists.',
    policyConsiderations: [
      { label: 'Room limit', value: '₹8,000/day', status: 'safe' },
      { label: 'Network', value: 'In network', status: 'safe' },
      { label: 'Pre-authorization', value: 'Required (48h advance)', status: 'warning' },
      { label: 'Initial Deposit', value: 'Nil for Cashless Pre-Auth', status: 'neutral' },
    ],
    whatMattersNow: [
      'Initiate cashless pre-authorization with TPA desk',
      'Verify room category against stated daily policy cap',
      'Submit government ID and health insurance e-card',
      'Complete initial patient intake and registration',
    ],
    requiredDocuments: [
      'Health Insurance e-Card / Policy Schedule',
      'Government Photo ID (Aadhaar / Voter ID / Passport)',
      'Treating Doctor Initial Admission Note',
      'Pre-Authorization Request Form (Filled & Signed)',
    ],
    tpaQuestions: [
      'Has the initial pre-authorization request been submitted to the TPA portal?',
      'Is my allotted room strictly within the ₹8,000/day policy cap to prevent proportionate deductions?',
      'Are there any non-medical registration fees or consumables not covered by cashless pre-auth?',
    ],
    consumablesWarning:
      'Hospital admission kits, sanitization packs, and administrative registration fees are typically excluded non-medical items.',
  },
  INVESTIGATION: {
    title: 'Investigation & Diagnostics',
    description:
      'Diagnostic tests, radiological scans, and laboratory investigations to evaluate condition and prepare clinical pre-authorization enhancements.',
    policyConsiderations: [
      { label: 'Diagnostic Coverage', value: 'Covered under IPD policy', status: 'safe' },
      { label: 'Pre-Auth Enhancement', value: 'Triggered if costs exceed initial cap', status: 'warning' },
      { label: 'Room Rent Monitoring', value: 'Daily cap applies throughout stay', status: 'safe' },
    ],
    whatMattersNow: [
      'Ensure doctor prescription is attached for every high-value scan (MRI/CT)',
      'Request interim billing summary to monitor sum insured burn rate',
      'Confirm pre-investigation fasting or preparation protocols',
      'Verify that diagnostic charges are billed under the primary pre-auth claim number',
    ],
    requiredDocuments: [
      'Doctor Consultation Notes & Investigation Prescription',
      'Laboratory Pathology Reports',
      'Radiology / Scan Reports (X-Ray, Ultrasound, CT/MRI)',
      'Interim Itemized Hospital Billing Sheet',
    ],
    tpaQuestions: [
      'Are all prescribed diagnostic investigations covered under the active pre-authorization?',
      'Has the hospital submitted pre-auth enhancement requests for planned procedural investigations?',
      'Are external lab samples billed directly to the cashless hospital admission account?',
    ],
    consumablesWarning:
      'Specialized contrast dyes or disposable diagnostic kits may have sub-limits or requires explicit medical necessity certificates.',
  },
  PROCEDURE: {
    title: 'Procedure & Surgery',
    description:
      'Surgical intervention, operating theatre protocols, implant clearances, and active specialist supervision.',
    policyConsiderations: [
      { label: 'Surgeon & OT Charges', value: 'Covered (linked to room cap proportion)', status: 'warning' },
      { label: 'Implants & Stents', value: 'Subject to NPPA cap & insurer sub-limits', status: 'warning' },
      { label: 'Cashless Approval', value: 'Enhanced pre-auth required prior to discharge', status: 'safe' },
    ],
    whatMattersNow: [
      'Verify implant / prosthesis invoice and batch stickers with hospital billing',
      'Confirm enhanced cashless authorization approval amount from insurer',
      'Monitor ICU stay charges (ICU limits are usually 2% of sum insured or no cap)',
      'Keep copies of OT notes and anesthetist pre-op evaluation',
    ],
    requiredDocuments: [
      'Operating Theatre (OT) Surgical Notes',
      'Anesthesia Pre-Operative Clearance Chart',
      'Medical Implant Stickers, Invoices & Barcodes',
      'Insurer Final Enhancement Pre-Authorization Letter',
    ],
    tpaQuestions: [
      'Has the insurer approved the enhanced surgical pre-authorization amount?',
      'Are the implants used compliant with insurer tariff caps?',
      'Will any doctor visiting fees exceed policy schedule benchmarks?',
    ],
    consumablesWarning:
      'Surgical gloves, PPE kits, gowns, and specialized disposables represent common out-of-pocket non-medical deductions.',
  },
  RECOVERY: {
    title: 'Recovery & Discharge',
    description:
      'Post-operative recuperation, discharge planning, final cashless settlement adjudication, and post-hospitalization claim guidance.',
    policyConsiderations: [
      { label: 'Post-Hospitalization', value: '60 to 90 days covered (reimbursement)', status: 'safe' },
      { label: 'Final Settlement Time', value: 'Typically 2 to 4 hours for TPA clearance', status: 'warning' },
      { label: 'Non-Medical Deductions', value: 'Payable at hospital discharge desk', status: 'warning' },
    ],
    whatMattersNow: [
      'Request treating doctor discharge summary and prescription advice',
      'Obtain original itemized final hospital bill and pharmacy breakdown',
      'Allow 2-4 hours for final cashless claim adjudication from insurer',
      'Collect all diagnostic reports, discharge summary, and payment receipts for post-op claims',
    ],
    requiredDocuments: [
      'Comprehensive Discharge Summary signed by primary consultant',
      'Final Itemized Hospital Bill with Breakup',
      'Payment Receipts for Non-Medical Deductions Paid',
      'Post-Discharge Medication Prescription & Follow-up Schedule',
    ],
    tpaQuestions: [
      'Has the final discharge bill been uploaded to the insurer portal for final authorization?',
      'What is the exact non-medical co-pay balance remaining to be settled at the discharge counter?',
      'What documents do I need to claim follow-up consultations and medicines under post-hospitalization benefits?',
    ],
    consumablesWarning:
      'Retain all follow-up consultation receipts and pharmacy bills for 60-90 days to claim post-hospitalization reimbursement.',
  },
};

export default function CareJourneyPage() {
  const [journey, setJourney] = useState<CareJourneyDto | null>(null);
  const [policy, setPolicy] = useState<PolicyResponseDto | null>(null);
  const [selectedStage, setSelectedStage] = useState<StageType>('ADMISSION');
  const [completedChecklist, setCompletedChecklist] = useState<Record<string, boolean>>({});
  const [completedDocs, setCompletedDocs] = useState<Record<string, boolean>>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const [introStep, setIntroStep] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');

  const fetchJourneyData = async () => {
    try {
      setLoading(true);
      const [jData, pData] = await Promise.all([
        api.getJourneyForPatient(1),
        api.getActivePolicy(1),
      ]);
      setJourney(jData);
      setPolicy(pData);

      // Load user profile from localStorage if present
      try {
        const savedProfile = localStorage.getItem('ospat_user_profile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          if (parsed.fullName && parsed.fullName.trim()) {
            setUserName(parsed.fullName.trim());
          }
        }
      } catch {
        // ignore
      }

      const targetStage = ((jData && jData.currentStage) ? jData.currentStage : 'ADMISSION') as StageType;
      const targetIndex = STAGES.findIndex((s) => s.id === targetStage);

      let isFirstVisit = false;
      try {
        const seen = localStorage.getItem('ospat_journey_intro_seen');
        const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        isFirstVisit = !seen && !prefersReducedMotion;
      } catch {
        isFirstVisit = false;
      }

      if (isFirstVisit && targetIndex > 0) {
        setIsIntroPlaying(true);
        setIntroStep(0);
        setSelectedStage('ADMISSION');

        let currentStep = 0;
        const timer = setInterval(() => {
          currentStep++;
          if (currentStep <= targetIndex) {
            setIntroStep(currentStep);
            setSelectedStage(STAGES[currentStep].id);
          } else {
            clearInterval(timer);
            setIsIntroPlaying(false);
            setSelectedStage(targetStage);
            try {
              localStorage.setItem('ospat_journey_intro_seen', 'true');
            } catch { }
          }
        }, 500);
      } else {
        setSelectedStage(targetStage);
        setIntroStep(targetIndex);
      }
    } catch (e) {
      console.warn('Failed to load care journey data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneyData();
  }, []);

  const handleToggleChecklist = (item: string) => {
    setCompletedChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleToggleDoc = (doc: string) => {
    setCompletedDocs((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  const handleAdvanceStage = async () => {
    if (!journey) return;
    const currentIndex = STAGES.findIndex((s) => s.id === journey.currentStage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1].id;
      try {
        setIsAdvancing(true);
        const updated = await api.updateJourneyStage(journey.id, {
          stage: nextStage,
          note: `Transitioned stage from ${journey.currentStage} to ${nextStage} via Caregiver Roadmap.`,
        });
        setJourney(updated);
        setSelectedStage(nextStage);
      } catch (e: any) {
        alert(`Failed to advance stage: ${e.message}`);
      } finally {
        setIsAdvancing(false);
      }
    }
  };

  const currentBackendStage = (journey?.currentStage as StageType) || 'ADMISSION';
  const stageInfo = STAGE_DATA[selectedStage] || STAGE_DATA.ADMISSION;
  const isViewingAuthoritativeCurrent = selectedStage === currentBackendStage;

  const currentStageIndex = STAGES.findIndex((s) => s.id === currentBackendStage);
  const selectedStageIndex = STAGES.findIndex((s) => s.id === selectedStage);
  const activeTimelineProgIndex = isIntroPlaying ? introStep : currentStageIndex;

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-grow flex flex-col max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg gap-8">
        {/* Page Header & Context */}
        <header className="flex flex-col gap-6">
          <div>
            <div className="font-label-caps text-xs text-primary uppercase tracking-wider font-bold mb-1">
              Your care journey
            </div>
            <h1 className="font-display-hero text-3xl md:text-display-hero text-on-surface font-bold tracking-tight">
              Care stage roadmap
            </h1>
            <p className="font-body-md text-on-surface-variant text-base md:text-lg mt-1">
              Here&apos;s what to expect from admission through recovery — see where you are, what matters now, and what comes next.
            </p>
          </div>

          {/* Context Row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 bg-surface-container-lowest border border-border-subtle rounded-xl px-6 py-4 card-shadow">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
              <div>
                <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Patient
                </div>
                <div className="font-label-sm text-sm text-on-surface font-semibold">
                  {userName || journey?.patientName || 'Rajesh Verma'}
                </div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-border-subtle"></div>

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant">local_hospital</span>
              <div>
                <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Hospital
                </div>
                <div className="font-label-sm text-sm text-on-surface font-semibold flex items-center gap-2">
                  {journey?.hospitalName || 'Aster CMI Hospital'}
                  {journey?.hospitalId && (
                    <NextLink
                      href={`/hospitals/${journey.hospitalId}`}
                      className="text-primary hover:underline text-xs font-semibold"
                    >
                      View hospital →
                    </NextLink>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-border-subtle"></div>

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant">policy</span>
              <div>
                <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Policy
                </div>
                <div className="font-label-sm text-sm text-on-surface font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-safe"></span>
                  {policy?.insurerName || 'Star Health'} · In network
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 4-Stage Timeline Nav */}
        <nav className="w-full relative py-6 bg-surface-container-lowest rounded-2xl border border-border-subtle px-4 sm:px-8 card-shadow">
          <div className="flex items-center justify-between w-full">
            {STAGES.map((s, idx) => {
              const isProgCompleted = idx < activeTimelineProgIndex;
              const isProgCurrent = idx === activeTimelineProgIndex;
              const isSelected = s.id === selectedStage;
              const isLast = idx === STAGES.length - 1;
              const isSegmentFilled = idx < activeTimelineProgIndex;

              return (
                <React.Fragment key={s.id}>
                  {/* Stage Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isIntroPlaying) {
                        setSelectedStage(s.id);
                      }
                    }}
                    className={`flex flex-col items-center gap-2 group focus:outline-none transition-all shrink-0 ${isSelected ? 'scale-105' : 'opacity-85 hover:opacity-100'
                      }`}
                  >
                    <div
                      className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 ${isProgCurrent
                          ? 'bg-primary text-white ring-4 ring-primary/20 shadow-md scale-105'
                          : isProgCompleted
                            ? 'bg-status-safe text-white shadow-xs'
                            : 'bg-surface-container-lowest text-on-surface-variant border-2 border-border-subtle'
                        }`}
                    >
                      {isProgCompleted ? (
                        <span className="material-symbols-outlined text-base font-bold">check</span>
                      ) : (
                        s.index
                      )}
                    </div>

                    <span
                      className={`font-label-sm text-xs md:text-sm transition-colors text-center ${isSelected
                          ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                          : 'text-on-surface-variant font-medium'
                        }`}
                    >
                      {s.label}
                    </span>

                    {isProgCurrent && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                        {isIntroPlaying ? 'Intro' : 'Current'}
                      </span>
                    )}
                  </button>

                  {/* Connecting Line Segment between adjacent steps */}
                  {!isLast && (
                    <div className="flex-grow mx-2 md:mx-4 h-1 bg-surface-container rounded-full relative overflow-hidden mb-6 hidden sm:block">
                      <div
                        className={`h-full bg-status-safe transition-all duration-500 ease-out ${isSegmentFilled ? 'w-full' : 'w-0'
                          }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </nav>

        {/* Stage Content Area */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="font-label-caps text-xs text-primary uppercase tracking-wider mb-1 font-bold">
                Stage {selectedStageIndex + 1} of 4 {isViewingAuthoritativeCurrent ? '— Active Current Stage' : '— Stage Inspection Preview'}
              </div>
              <h2 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-bold">
                {stageInfo.title}
              </h2>
              <p className="font-body-md text-sm md:text-base text-on-surface-variant max-w-3xl mt-1">
                {stageInfo.description}
              </p>
            </div>

            {/* Advance Stage Action Button */}
            {isViewingAuthoritativeCurrent && currentStageIndex < STAGES.length - 1 && (
              <button
                onClick={handleAdvanceStage}
                disabled={isAdvancing}
                className="bg-primary-container text-on-primary font-label-sm px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary transition-colors flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-50"
              >
                {isAdvancing ? 'Advancing Stage...' : `Advance to ${STAGES[currentStageIndex + 1].label} →`}
              </button>
            )}
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: Policy considerations */}
            <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-6 flex flex-col h-full card-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">assignment_late</span>
                <h3 className="font-headline-lg text-base text-primary font-bold">Policy considerations</h3>
              </div>
              <ul className="flex flex-col divide-y divide-border-subtle flex-grow">
                {stageInfo.policyConsiderations.map((item, i) => (
                  <li key={i} className="py-3 flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-medium">{item.label}</span>
                    <span
                      className={`font-semibold px-2.5 py-1 rounded-full ${item.status === 'safe'
                          ? 'bg-status-safe/10 text-status-safe'
                          : item.status === 'warning'
                            ? 'bg-status-warning/10 text-status-warning'
                            : 'bg-surface-container text-on-surface'
                        }`}
                    >
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Col: What matters now */}
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 flex flex-col h-full relative overflow-hidden card-shadow">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span className="material-symbols-outlined text-inverse-primary">check_circle</span>
                <h3 className="font-headline-lg text-base text-white font-bold">What matters now</h3>
              </div>
              <ul className="flex flex-col gap-3 relative z-10 text-xs">
                {stageInfo.whatMattersNow.map((task, idx) => {
                  const isChecked = !!completedChecklist[`${selectedStage}_${idx}`];
                  return (
                    <li
                      key={idx}
                      onClick={() => handleToggleChecklist(`${selectedStage}_${idx}`)}
                      className="flex items-start gap-3 cursor-pointer select-none group"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] mt-0.5 transition-colors ${isChecked ? 'text-status-safe' : 'text-inverse-primary group-hover:text-white'
                          }`}
                      >
                        {isChecked ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span className={`leading-relaxed text-white font-medium ${isChecked ? 'line-through opacity-70' : ''}`}>
                        {task}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-6 card-shadow">
            <h3 className="font-headline-lg text-base text-primary font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder_open</span>
              Required Documents Checklist ({selectedStage})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stageInfo.requiredDocuments.map((doc, idx) => {
                const isDocChecked = !!completedDocs[`${selectedStage}_doc_${idx}`];
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleDoc(`${selectedStage}_doc_${idx}`)}
                    className="p-3 bg-surface rounded-xl border border-border-subtle flex items-center gap-3 cursor-pointer hover:bg-surface-container transition-colors"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${isDocChecked ? 'text-status-safe' : 'text-on-surface-variant'
                        }`}
                    >
                      {isDocChecked ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className={`text-xs font-medium text-on-surface ${isDocChecked ? 'line-through opacity-70' : ''}`}>
                      {doc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Questions for TPA Desk */}
          <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-6 card-shadow">
            <h3 className="font-headline-lg text-base text-primary font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">contact_support</span>
              Questions to Ask the Hospital TPA / Billing Desk
            </h3>
            <div className="space-y-3">
              {stageInfo.tpaQuestions.map((q, i) => (
                <div key={i} className="p-3 bg-surface rounded-xl border border-border-subtle flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs text-on-surface font-medium leading-relaxed">{q}</p>
                </div>
              ))}
            </div>

            {stageInfo.consumablesWarning && (
              <div className="mt-4 p-3 bg-status-warning/10 rounded-xl border border-status-warning/30 flex items-center gap-3">
                <span className="material-symbols-outlined text-status-warning text-base shrink-0">info</span>
                <p className="text-xs text-on-surface leading-relaxed">{stageInfo.consumablesWarning}</p>
              </div>
            )}
          </div>

          {/* Chronological Audit Trail History (Collapsed by Default) */}
          {journey?.events && journey.events.length > 0 && (
            <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-6 card-shadow">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none font-headline-lg text-base text-primary font-bold">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">history</span>
                    Journey history
                    <span className="text-xs font-normal text-on-surface-variant ml-2">
                      ({journey.events.length} recorded transition{journey.events.length === 1 ? '' : 's'})
                    </span>
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>

                <div className="mt-4 pt-4 border-t border-border-subtle space-y-2">
                  {journey.events.map((ev) => (
                    <div key={ev.id} className="p-3 bg-surface rounded-xl border border-border-subtle flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-primary">{ev.stage}</span>
                        {ev.description && <span className="text-on-surface-variant ml-2">— {ev.description}</span>}
                      </div>
                      <span className="text-on-surface-variant text-[11px]">
                        {new Date(ev.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}
