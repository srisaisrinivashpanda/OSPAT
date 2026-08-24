'use client';

import React, { useEffect, useState, useRef } from 'react';
import NextLink from 'next/link';
import TopNavBar from '@/components/layout/TopNavBar';
import GlobalFooter from '@/components/layout/GlobalFooter';
import { api } from '@/lib/api/apiClient';
import { PolicyResponseDto, ExtractedPolicyDto } from '@/lib/types';

export default function InsurancePage() {
  const [policy, setPolicy] = useState<PolicyResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'upload' | 'processing' | 'confirm' | 'success'>('upload');
  const [processingTitle, setProcessingTitle] = useState('Analyzing document');
  const [processingDesc, setProcessingDesc] = useState('Reading policy details...');
  const [processingIcon, setProcessingIcon] = useState('document_scanner');
  const [extractedData, setExtractedData] = useState<ExtractedPolicyDto | null>(null);
  const [editForm, setEditForm] = useState<{
    insurerName: string;
    policyType: string;
    coverageLimit: string;
    roomLimit: string;
    roomCategory: string;
  }>({
    insurerName: '',
    policyType: '',
    coverageLimit: '',
    roomLimit: '',
    roomCategory: '',
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchActivePolicy = async () => {
    try {
      setLoading(true);
      const data = await api.getActivePolicy(1);
      setPolicy(data);
    } catch (e) {
      console.warn('Failed to load active policy', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePolicy();
  }, []);

  const openUploadModal = () => {
    setIsModalOpen(true);
    setModalStep('upload');
    setUploadError(null);
    setExtractedData(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileUpload = async (file: File) => {
    try {
      setModalStep('processing');
      setUploadError(null);

      // Animated progression
      const steps = [
        { title: 'Reading document', desc: 'Extracting text and policy structure with PDFBox...', icon: 'document_scanner' },
        { title: 'Finding clauses', desc: 'Identifying room rent caps, sum insured, and exclusions...', icon: 'search' },
        { title: 'Structuring coverage', desc: 'Normalizing policy parameters with AI engine...', icon: 'account_tree' },
      ];

      let sIndex = 0;
      const interval = setInterval(() => {
        if (sIndex < steps.length) {
          setProcessingTitle(steps[sIndex].title);
          setProcessingDesc(steps[sIndex].desc);
          setProcessingIcon(steps[sIndex].icon);
          sIndex++;
        }
      }, 700);

      const extracted = await api.uploadPolicyPdf(file, 1);
      clearInterval(interval);

      setExtractedData(extracted);
      setEditForm({
        insurerName: extracted.insurerName || 'Star Health Allied Insurance',
        policyType: extracted.policyType || 'Family Health Optima Comprehensive',
        coverageLimit: extracted.coverageLimit ? extracted.coverageLimit.toString() : '500000',
        roomLimit: extracted.roomLimit ? extracted.roomLimit.toString() : '5000',
        roomCategory: extracted.roomCategory || 'Semi-Private Room (Twin Sharing AC)',
      });
      setModalStep('confirm');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to extract policy');
      setModalStep('upload');
    }
  };

  const handleSampleSelect = async (type: 'star' | 'hdfc' | 'care') => {
    try {
      setModalStep('processing');
      setUploadError(null);
      const blob = await api.fetchSamplePdfBlob(type);
      const filename = `${type}_sample_policy.pdf`;
      const file = new File([blob], filename, { type: 'application/pdf' });
      await handleFileUpload(file);
    } catch (e: any) {
      setUploadError(e.message || 'Failed to generate sample PDF');
      setModalStep('upload');
    }
  };

  const handleConfirmPolicy = async () => {
    if (!extractedData || !extractedData.policyId) {
      setUploadError('Missing draft policy ID');
      return;
    }
    try {
      setModalStep('processing');
      setProcessingTitle('Confirming Policy');
      setProcessingDesc('Activating deterministic policy constraints...');
      setProcessingIcon('task_alt');

      await api.confirmPolicy(extractedData.policyId, {
        insurerName: editForm.insurerName,
        policyType: editForm.policyType,
        coverageLimit: parseFloat(editForm.coverageLimit) || 500000,
        remainingCoverage: parseFloat(editForm.coverageLimit) || 500000,
        roomLimit: parseFloat(editForm.roomLimit) || 5000,
        roomCategory: editForm.roomCategory,
        confirmed: true,
        exclusions: extractedData.exclusions || [],
        networkHospitalIds: [],
      });

      await fetchActivePolicy();
      setModalStep('success');
    } catch (e: any) {
      setUploadError(e.message || 'Failed to confirm policy');
      setModalStep('confirm');
    }
  };

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-grow max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md mb-10">
          <div>
            <h1 className="font-display-hero text-3xl md:text-display-hero text-primary mb-2 font-bold tracking-tight">
              Your coverage
            </h1>
            <p className="font-body-md text-on-surface-variant text-base md:text-lg max-w-2xl">
              Understand the important parts of your policy, all in one place.
            </p>
          </div>
          <button
            onClick={openUploadModal}
            className="flex items-center justify-center gap-2 bg-primary-container text-on-primary font-label-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Upload a policy
          </button>
        </header>

        {/* Active Policy Summary & Coverage Hero Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Policy Summary Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 border border-border-subtle card-shadow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider block mb-1 font-semibold">
                    Insurer
                  </span>
                  <h2 className="font-headline-lg text-2xl text-primary font-bold">
                    {policy ? policy.insurerName : 'Star Health'}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 bg-status-safe/10 text-status-safe px-3 py-1 rounded-full font-label-sm text-xs font-semibold">
                  <div className="w-2 h-2 rounded-full bg-status-safe"></div>
                  {policy ? policy.policyStatus : 'Active'}
                </div>
              </div>
              <div className="mb-6">
                <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider block mb-1 font-semibold">
                  Policy Name
                </span>
                <p className="font-body-md text-base text-on-surface font-semibold">
                  {policy ? policy.policyType : 'Family Health Optima Comprehensive'}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-border-subtle">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider block mb-1 font-semibold">
                Patient / Insured
              </span>
              <p className="font-body-md text-sm text-on-surface">
                {policy?.patientName || 'Demo User'}
              </p>
            </div>
          </div>

          {/* Coverage Hero Card */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-8 md:p-10 border border-border-subtle card-shadow flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-fixed/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider block mb-2 font-semibold">
                Total Coverage Amount
              </span>
              <div className="font-metric-value text-4xl md:text-5xl lg:text-display-hero text-primary mb-4 font-bold tracking-tight">
                {policy ? formatCurrency(policy.coverageLimit) : '₹10,00,000'}
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-xs">
                <span className="material-symbols-outlined text-primary-container text-sm">verified_user</span>
                <span>Base sum insured. Restoration & cashless pre-authorization subject to policy schedule.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Constraints Grid */}
        <div className="mb-12">
          <h3 className="font-headline-lg text-xl md:text-2xl text-primary mb-6 font-bold">
            Key Constraints
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-border-subtle card-shadow">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center mb-4 text-primary-container">
                <span className="material-symbols-outlined">bed</span>
              </div>
              <h4 className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">
                Room Limit
              </h4>
              <p className="font-metric-value text-2xl text-primary font-bold mb-1">
                {policy && policy.roomLimit ? formatCurrency(policy.roomLimit) : '₹8,000'}
                <span className="text-xs font-normal text-on-surface-variant">/day</span>
              </p>
              <p className="font-label-sm text-xs text-on-surface-variant">
                {policy?.roomCategory || 'Semi-Private / Private AC'}
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-border-subtle card-shadow">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center mb-4 text-primary-container">
                <span className="material-symbols-outlined">local_hospital</span>
              </div>
              <h4 className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">
                Network
              </h4>
              <p className="font-metric-value text-2xl text-primary font-bold mb-1">In network</p>
              <p className="font-label-sm text-xs text-on-surface-variant">
                {policy?.networkHospitals?.length || 4} hospital tie-ups
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-border-subtle card-shadow">
              <div className="w-12 h-12 rounded-full bg-status-warning/10 flex items-center justify-center mb-4 text-status-warning">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h4 className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">
                Exclusions
              </h4>
              <p className="font-metric-value text-2xl text-primary font-bold mb-1">
                {policy?.exclusions?.length || 3} identified
              </p>
              <p className="font-label-sm text-xs text-on-surface-variant">Non-medical items excluded</p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-border-subtle card-shadow">
              <div className="w-12 h-12 rounded-full bg-status-safe/10 flex items-center justify-center mb-4 text-status-safe">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <h4 className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">
                Status
              </h4>
              <p className="font-metric-value text-2xl text-primary font-bold mb-1">Active</p>
              <p className="font-label-sm text-xs text-on-surface-variant">Confirmed for matching</p>
            </div>
          </div>
        </div>

        {/* Important Considerations Section */}
        <div className="mb-12">
          <h3 className="font-headline-lg text-xl md:text-2xl text-primary mb-6 font-bold">
            Important considerations
          </h3>
          <div className="space-y-4">
            <details className="group bg-surface-container-lowest rounded-2xl border border-border-subtle card-shadow overflow-hidden" open>
              <summary className="flex justify-between items-center cursor-pointer p-6 font-body-md font-semibold text-on-surface hover:bg-surface transition-colors list-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container">info</span>
                  Room-related conditions & Proportionate Deductions
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform duration-200">
                  expand_more
                </span>
              </summary>
              <div className="p-6 pt-0 border-t border-border-subtle text-on-surface-variant bg-surface text-sm">
                <p className="mt-4 leading-relaxed">
                  If a room with a higher rent than your stated policy cap ({policy && policy.roomLimit ? formatCurrency(policy.roomLimit) : '₹8,000'}/day) is chosen, proportionate deductions will apply across all associated medical expenses, including doctor&apos;s fees, nursing charges, and diagnostic tests.
                </p>
              </div>
            </details>

            <details className="group bg-surface-container-lowest rounded-2xl border border-border-subtle card-shadow overflow-hidden">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-body-md font-semibold text-on-surface hover:bg-surface transition-colors list-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container">info</span>
                  Pre-authorization requirements
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform duration-200">
                  expand_more
                </span>
              </summary>
              <div className="p-6 pt-0 border-t border-border-subtle text-on-surface-variant bg-surface text-sm">
                <p className="mt-4 leading-relaxed">
                  Planned hospitalizations require cashless pre-authorization submission at least 48 hours in advance. Emergency admissions must be notified to the hospital TPA desk within 24 hours of admission.
                </p>
              </div>
            </details>

            <details className="group bg-surface-container-lowest rounded-2xl border border-border-subtle card-shadow overflow-hidden">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-body-md font-semibold text-on-surface hover:bg-surface transition-colors list-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container">info</span>
                  Policy exclusions & Non-medical charges
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform duration-200">
                  expand_more
                </span>
              </summary>
              <div className="p-6 pt-0 border-t border-border-subtle text-on-surface-variant bg-surface text-sm">
                <div className="mt-4 space-y-2">
                  <p>Common excluded non-medical consumables include registration fees, hygiene kits, gloves, and administrative charges.</p>
                  {policy?.exclusions && policy.exclusions.length > 0 && (
                    <ul className="list-disc list-inside text-xs mt-2 space-y-1">
                      {policy.exclusions.map((exc, idx) => (
                        <li key={idx}>{exc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Your Policy Section */}
        <div className="mb-12">
          <h3 className="font-headline-lg text-xl md:text-2xl text-primary mb-6 font-bold">
            Your policy document
          </h3>
          <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-fixed/20 rounded-xl flex items-center justify-center text-primary-container shrink-0">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div>
                <p className="font-body-md font-semibold text-on-surface text-base">
                  {policy?.sourceDocument || 'StarHealth_FamilyOptima_Sample.pdf'}
                </p>
                <p className="font-label-sm text-xs text-on-surface-variant">
                  {policy?.updatedAt ? `Updated ${new Date(policy.updatedAt).toLocaleDateString()}` : 'Active in database'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <button
                onClick={openUploadModal}
                className="text-primary hover:text-primary-container font-label-sm text-sm font-semibold transition-colors"
              >
                Replace policy
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps CTA */}
        <div className="bg-surface-container-low rounded-3xl p-8 md:p-12 text-center border border-border-subtle">
          <h2 className="font-headline-lg text-2xl md:text-3xl text-primary mb-3 font-bold">
            Ready to compare hospitals?
          </h2>
          <p className="font-body-md text-on-surface-variant mb-8 max-w-xl mx-auto text-sm md:text-base">
            Use your active policy parameters to find the most suitable hospitals in your network and estimate potential out-of-pocket costs.
          </p>
          <NextLink
            href="/hospitals"
            className="bg-primary-container text-on-primary font-label-sm px-8 py-4 rounded-full hover:bg-primary transition-colors text-base font-medium inline-flex items-center gap-2 shadow-sm"
          >
            Find hospitals
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </NextLink>
        </div>
      </main>

      <GlobalFooter />

      {/* Upload Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="bg-surface-container-lowest rounded-3xl shadow-2xl border border-border-subtle w-full max-w-lg relative z-10 overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-border-subtle flex justify-between items-center">
              <h3 className="font-headline-lg text-xl text-primary font-bold">
                {modalStep === 'confirm' ? 'Confirm Extracted Parameters' : 'Upload Policy Document'}
              </h3>
              <button className="text-on-surface-variant hover:text-on-surface" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {uploadError && (
              <div className="mx-8 mt-4 p-3 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {uploadError}
              </div>
            )}

            {/* Upload State */}
            {modalStep === 'upload' && (
              <div className="p-8">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-subtle rounded-2xl p-8 text-center hover:bg-surface-container-low transition-colors cursor-pointer group mb-6"
                >
                  <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-fixed/20 transition-colors text-primary-container">
                    <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                  </div>
                  <p className="font-body-md font-semibold text-primary mb-1 text-sm">
                    Click to upload or drag and drop
                  </p>
                  <p className="font-label-sm text-on-surface-variant text-xs">PDF, JPG, or PNG (up to 25MB)</p>
                </div>

                <div className="pt-4 border-t border-border-subtle">
                  <p className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-3 font-semibold text-center">
                    Or Test with Synthetic Policy PDF:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSampleSelect('star')}
                      className="px-3 py-2 bg-surface border border-border-subtle rounded-xl text-xs font-semibold text-primary hover:bg-primary-container hover:text-white transition-colors text-center"
                    >
                      Star Health
                    </button>
                    <button
                      onClick={() => handleSampleSelect('hdfc')}
                      className="px-3 py-2 bg-surface border border-border-subtle rounded-xl text-xs font-semibold text-primary hover:bg-primary-container hover:text-white transition-colors text-center"
                    >
                      HDFC ERGO
                    </button>
                    <button
                      onClick={() => handleSampleSelect('care')}
                      className="px-3 py-2 bg-surface border border-border-subtle rounded-xl text-xs font-semibold text-primary hover:bg-primary-container hover:text-white transition-colors text-center"
                    >
                      Care Health
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Processing State */}
            {modalStep === 'processing' && (
              <div className="p-12 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <svg className="animate-spin text-primary-container w-full h-full" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-2xl">{processingIcon}</span>
                  </div>
                </div>
                <h4 className="font-headline-lg text-lg text-primary mb-1 font-bold">{processingTitle}</h4>
                <p className="font-body-md text-on-surface-variant text-xs">{processingDesc}</p>
              </div>
            )}

            {/* Confirm State */}
            {modalStep === 'confirm' && (
              <div className="p-6 md:p-8 space-y-4">
                <p className="text-xs text-on-surface-variant">
                  Review the extracted policy limits. You can edit any parameter before saving:
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-on-surface-variant font-semibold mb-1">Insurer Name</label>
                    <input
                      type="text"
                      value={editForm.insurerName}
                      onChange={(e) => setEditForm({ ...editForm, insurerName: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-on-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-on-surface-variant font-semibold mb-1">Plan / Policy Name</label>
                    <input
                      type="text"
                      value={editForm.policyType}
                      onChange={(e) => setEditForm({ ...editForm, policyType: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-on-surface text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-on-surface-variant font-semibold mb-1">Sum Insured (₹)</label>
                      <input
                        type="number"
                        value={editForm.coverageLimit}
                        onChange={(e) => setEditForm({ ...editForm, coverageLimit: e.target.value })}
                        className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-on-surface text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-on-surface-variant font-semibold mb-1">Daily Room Limit (₹)</label>
                      <input
                        type="number"
                        value={editForm.roomLimit}
                        onChange={(e) => setEditForm({ ...editForm, roomLimit: e.target.value })}
                        className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-on-surface text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-on-surface-variant font-semibold mb-1">Room Category</label>
                    <input
                      type="text"
                      value={editForm.roomCategory}
                      onChange={(e) => setEditForm({ ...editForm, roomCategory: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-on-surface text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle flex gap-3 justify-end">
                  <button
                    onClick={() => setModalStep('upload')}
                    className="px-4 py-2 border border-border-subtle rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmPolicy}
                    className="px-6 py-2 bg-primary-container text-on-primary rounded-full text-xs font-semibold hover:bg-primary"
                  >
                    Confirm & Activate
                  </button>
                </div>
              </div>
            )}

            {/* Success State */}
            {modalStep === 'success' && (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-status-safe/10 rounded-full flex items-center justify-center mx-auto mb-4 text-status-safe">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h4 className="font-headline-lg text-xl text-primary mb-2 font-bold">Policy Updated & Active</h4>
                <p className="font-body-md text-on-surface-variant text-sm mb-6">
                  Extracted policy constraints are now active for deterministic hospital matching.
                </p>
                <button
                  onClick={closeModal}
                  className="bg-primary-container text-on-primary font-label-sm w-full py-3 rounded-full hover:bg-primary transition-colors text-sm font-semibold"
                >
                  View updated coverage
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
