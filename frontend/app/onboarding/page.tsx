'use client';

import React, { useState, useEffect, useRef } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalFooter from '@/components/layout/GlobalFooter';
import { api } from '@/lib/api/apiClient';
import { ExtractedPolicyDto } from '@/lib/types';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1 Form Data
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Step 2 Policy Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Reading your policy...');
  const [extractedData, setExtractedData] = useState<ExtractedPolicyDto | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing profile from localStorage if any
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ospat_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPersonalDetails({
          fullName: parsed.fullName || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!personalDetails.fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    }
    if (!personalDetails.email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalDetails.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!personalDetails.phone.trim()) {
      errs.phone = 'Please enter your phone number';
    } else if (personalDetails.phone.trim().length < 8) {
      errs.phone = 'Please enter a valid phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinueToPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      try {
        localStorage.setItem('ospat_user_profile', JSON.stringify(personalDetails));
      } catch (err) {
        console.warn('Failed to save to localStorage', err);
      }
      setCurrentStep(2);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      setExtractedData(null);
      setProcessingStatus('Reading your policy...');

      const statusInterval = setInterval(() => {
        setProcessingStatus((prev) => {
          if (prev === 'Reading your policy...') return 'Extracting coverage limits & room caps...';
          if (prev === 'Extracting coverage limits & room caps...') return 'Structuring policy terms with AI engine...';
          return 'Finalizing extraction...';
        });
      }, 700);

      const result = await api.uploadPolicyPdf(file, 1);
      clearInterval(statusInterval);

      setExtractedData(result);
    } catch (err: any) {
      setUploadError(err.message || 'We could not read this policy. Please try another PDF or a sample policy.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSampleSelect = async (type: 'star' | 'hdfc' | 'care') => {
    try {
      setIsUploading(true);
      setUploadError(null);
      setExtractedData(null);
      setProcessingStatus('Generating sample policy document...');

      const blob = await api.fetchSamplePdfBlob(type);
      const filename = `${type}_sample_policy.pdf`;
      const file = new File([blob], filename, { type: 'application/pdf' });
      await handleFileUpload(file);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to load sample policy. Please try again.');
      setIsUploading(false);
    }
  };

  const handleConfirmAndProceed = async () => {
    if (!extractedData || !extractedData.policyId) {
      setUploadError('Please upload a policy before continuing.');
      return;
    }

    try {
      setIsConfirming(true);
      setUploadError(null);

      const cov = extractedData.coverageLimit ?? 1000000;
      const room = extractedData.roomLimit ?? 8000;

      await api.confirmPolicy(extractedData.policyId, {
        insurerName: extractedData.insurerName || 'Star Health Allied Insurance',
        policyType: extractedData.policyType || 'Family Health Optima',
        coverageLimit: cov,
        remainingCoverage: cov,
        roomLimit: room,
        roomCategory: extractedData.roomCategory || 'Single Private Room',
        confirmed: true,
        exclusions: extractedData.exclusions || [],
        networkHospitalIds: [],
      });

      router.push('/insurance');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to confirm policy. Please try again.');
      setIsConfirming(false);
    }
  };

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col">
      {/* Onboarding Product TopNavBar */}
      <nav className="h-20 bg-surface/90 backdrop-blur-md border-b border-border-subtle/80 sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-full">
          <NextLink
            href="/"
            className="font-headline-lg text-[18px] font-semibold text-[#111827] tracking-tight leading-[24px] whitespace-nowrap flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d4e5c]"></span>
            OSPAT Intelligence
          </NextLink>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Patient Intake
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center items-center py-10 md:py-16 px-margin-mobile md:px-margin-desktop w-full">
        <div className="w-full max-w-xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= 1 ? 'bg-[#0d4e5c] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                1
              </span>
              <span
                className={`text-xs md:text-sm font-semibold tracking-tight ${
                  currentStep === 1 ? 'text-[#111827]' : 'text-slate-500'
                }`}
              >
                Your details
              </span>
            </div>

            <div className="flex-grow mx-4 h-[2px] bg-slate-200 relative overflow-hidden">
              <div
                className={`h-full bg-[#0d4e5c] transition-all duration-300 ${
                  currentStep === 2 ? 'w-full' : 'w-0'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === 2 ? 'bg-[#0d4e5c] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
              <span
                className={`text-xs md:text-sm font-semibold tracking-tight ${
                  currentStep === 2 ? 'text-[#111827]' : 'text-slate-500'
                }`}
              >
                Your policy
              </span>
            </div>
          </div>

          {/* Intro Heading */}
          <header className="mb-8 text-center md:text-left">
            <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-2">
              Let&apos;s start with your care.
            </h1>
            <p className="font-body-md text-slate-600 text-sm md:text-base leading-relaxed">
              Tell us a little about yourself and add your insurance policy. We&apos;ll use this information to make your coverage and hospital options easier to understand.
            </p>
          </header>

          {/* Form Step Container with AnimatePresence */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 card-shadow border border-border-subtle relative overflow-hidden">
            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                /* STEP 1: Personal Details */
                <motion.form
                  key="step-1"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={handleContinueToPolicy}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalDetails.fullName}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Sharma"
                      className={`w-full px-4 py-3 bg-surface rounded-xl border ${
                        errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-border-subtle focus:border-[#0d4e5c]'
                      } text-[#111827] placeholder:text-slate-400 focus:outline-none transition-colors text-sm`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={personalDetails.email}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                      placeholder="e.g. ramesh.sharma@example.com"
                      className={`w-full px-4 py-3 bg-surface rounded-xl border ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-border-subtle focus:border-[#0d4e5c]'
                      } text-[#111827] placeholder:text-slate-400 focus:outline-none transition-colors text-sm`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={personalDetails.phone}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full px-4 py-3 bg-surface rounded-xl border ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-border-subtle focus:border-[#0d4e5c]'
                      } text-[#111827] placeholder:text-slate-400 focus:outline-none transition-colors text-sm`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full bg-[#0d4e5c] hover:bg-[#003641] text-white font-semibold py-3.5 px-6 rounded-full transition-all duration-200 text-sm shadow-sm flex items-center justify-center gap-2"
                    >
                      Continue to policy
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </motion.form>
              ) : (
                /* STEP 2: Policy Upload & Extraction */
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-headline-lg text-lg font-bold text-[#111827] mb-1">
                      Add your insurance policy
                    </h3>
                    <p className="text-xs text-slate-600">
                      Upload your policy document so OSPAT can identify your coverage, room limits, exclusions, and network information.
                    </p>
                  </div>

                  {uploadError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm shrink-0">error</span>
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Processing State */}
                  {isUploading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-full border-3 border-slate-200 border-t-[#0d4e5c] animate-spin"></div>
                      <div>
                        <p className="font-semibold text-sm text-[#111827]">{processingStatus}</p>
                        <p className="text-xs text-slate-500 mt-1">Please wait while we structure your coverage parameters</p>
                      </div>
                    </div>
                  ) : extractedData ? (
                    /* Policy Extracted Compact Review State */
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                        <span className="material-symbols-outlined text-status-safe text-2xl">check_circle</span>
                        <div>
                          <p className="font-bold text-xs text-status-safe uppercase tracking-wider">Policy ready to review</p>
                          <p className="text-xs text-slate-700">Parameters extracted with AI precision</p>
                        </div>
                      </div>

                      <div className="bg-surface p-4 rounded-2xl border border-border-subtle space-y-2.5 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-border-subtle/60">
                          <span className="text-slate-500">Insurer</span>
                          <span className="font-bold text-[#111827] text-right">{extractedData.insurerName || 'Star Health Allied Insurance'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-border-subtle/60">
                          <span className="text-slate-500">Policy Plan</span>
                          <span className="font-semibold text-[#111827] text-right">{extractedData.policyType || 'Family Health Optima'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-border-subtle/60">
                          <span className="text-slate-500">Coverage Sum</span>
                          <span className="font-bold text-[#0d4e5c] text-sm">{formatCurrency(extractedData.coverageLimit || 1000000)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-border-subtle/60">
                          <span className="text-slate-500">Room Rent Cap</span>
                          <span className="font-semibold text-[#111827]">{formatCurrency(extractedData.roomLimit || 8000)} / day</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">Eligible Room</span>
                          <span className="font-semibold text-slate-700">{extractedData.roomCategory || 'Single Private Room'}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => setExtractedData(null)}
                          className="w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-full text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                        >
                          Replace File
                        </button>
                        <button
                          type="button"
                          disabled={isConfirming}
                          onClick={handleConfirmAndProceed}
                          className="flex-grow bg-[#0d4e5c] hover:bg-[#003641] text-white font-semibold py-3 px-6 rounded-full transition-colors text-xs flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                        >
                          {isConfirming ? 'Activating Coverage...' : 'Continue to my coverage'}
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Prominent Upload Area */
                    <div className="space-y-4">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-[#0d4e5c] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-surface hover:bg-surface-container-low group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 text-[#0d4e5c] group-hover:scale-105 transition-transform shadow-xs">
                          <span className="material-symbols-outlined text-2xl">upload_file</span>
                        </div>
                        <p className="font-bold text-sm text-[#111827] mb-1">
                          Upload your policy document
                        </p>
                        <p className="text-xs text-slate-500 mb-3">
                          PDF, JPG or PNG (Up to 10MB)
                        </p>
                        <button
                          type="button"
                          className="bg-white border border-slate-300 px-4 py-1.5 rounded-full text-xs font-semibold text-[#111827] group-hover:bg-[#0d4e5c] group-hover:text-white group-hover:border-[#0d4e5c] transition-colors"
                        >
                          Choose file
                        </button>
                      </div>

                      {/* Sample Policies Quick-Load */}
                      <div className="pt-2">
                        <p className="text-xs text-slate-500 font-semibold mb-2">Or test instantly with a verified sample:</p>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleSampleSelect('star')}
                            className="p-2.5 bg-surface border border-border-subtle rounded-xl text-center hover:border-[#0d4e5c] transition-colors group"
                          >
                            <span className="block text-[11px] font-bold text-[#111827] group-hover:text-[#0d4e5c]">Star Health</span>
                            <span className="block text-[10px] text-slate-500">₹10L • ₹8k Room</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSampleSelect('hdfc')}
                            className="p-2.5 bg-surface border border-border-subtle rounded-xl text-center hover:border-[#0d4e5c] transition-colors group"
                          >
                            <span className="block text-[11px] font-bold text-[#111827] group-hover:text-[#0d4e5c]">HDFC ERGO</span>
                            <span className="block text-[10px] text-slate-500">₹5L • ₹5k Room</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSampleSelect('care')}
                            className="p-2.5 bg-surface border border-border-subtle rounded-xl text-center hover:border-[#0d4e5c] transition-colors group"
                          >
                            <span className="block text-[11px] font-bold text-[#111827] group-hover:text-[#0d4e5c]">Care Health</span>
                            <span className="block text-[10px] text-slate-500">₹7.5L • 1% Cap</span>
                          </button>
                        </div>
                      </div>

                      {/* Back to Step 1 Button */}
                      <div className="pt-4 border-t border-border-subtle flex justify-start">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-xs font-semibold text-slate-600 hover:text-[#111827] flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_back</span>
                          Back to personal details
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
