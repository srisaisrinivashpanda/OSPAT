'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';

export default function LandingPage() {
  const [activeClause, setActiveClause] = useState<'coinsurance' | 'roomRent' | 'waitingPeriod'>('coinsurance');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      document.querySelectorAll('.reveal').forEach((el) => {
        observer.observe(el);
      });
      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('active');
      });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const clauseExplanations = {
    coinsurance: {
      raw: 'The insured is responsible for coinsurance amounts equal to 20% of the allowed amount for covered services up to the out-of-pocket maximum, after which the plan pays 100%...',
      plain: 'You pay 20% of the bill until you hit your yearly limit. After that, insurance pays everything.',
    },
    roomRent: {
      raw: 'Room Rent, Boarding and Nursing Expenses shall be capped at 1% of Sum Insured per day. If the insured occupies a room category higher than eligibility, proportionate deductions shall apply to all associated medical expenses...',
      plain: 'Your daily room rent is capped. Choosing a costlier room reduces payouts across doctor fees and surgeries proportionally.',
    },
    waitingPeriod: {
      raw: 'A waiting period of 24/36 months of continuous coverage shall apply to specified pre-existing diseases and surgeries listed in Section 4.2 prior to cashless admissibility...',
      plain: 'Pre-existing conditions and specific procedures are only covered after the required policy waiting period has passed.',
    },
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-surface/95 backdrop-blur-md shadow-sm border-b border-border-subtle/80'
            : 'bg-surface/80 backdrop-blur-sm border-b border-border-subtle/40'
        }`}
      >
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-20">
          <NextLink
            href="/"
            className="font-headline-lg text-[18px] font-semibold text-primary tracking-tight leading-[24px] whitespace-nowrap"
          >
            OSPAT Intelligence
          </NextLink>
          <div className="hidden md:flex items-center gap-gutter text-base">
            <a
              className="text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#how-it-works"
            >
              How it works
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#responsible-use"
            >
              Responsible use
            </a>
            <NextLink
              href="/insurance"
              className="bg-primary-container text-on-primary font-label-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-base font-medium btn-interactive"
            >
              Get Started
            </NextLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 px-margin-mobile md:px-margin-desktop overflow-hidden hero-gradient">
        <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          <h1 className="font-display-hero text-3xl sm:text-4xl md:text-[48px] lg:text-[56px] xl:text-[64px] leading-[1.08] text-primary max-w-5xl mb-4 sm:mb-5 font-bold tracking-tight hero-reveal-heading">
            Care decisions, made clearer.
          </h1>
          <p className="font-body-md text-on-surface-variant text-base sm:text-lg md:text-[19px] lg:text-[20px] leading-[26px] sm:leading-[28px] lg:leading-[30px] max-w-2xl lg:max-w-3xl hero-reveal-desc">
            Understand your coverage, compare hospital options, and know what matters at every stage of care.
          </p>
        </div>

        {/* Premium Product Visual Bento */}
        <div className="mt-8 sm:mt-10 lg:mt-12 w-full max-w-6xl mx-auto relative hero-reveal-bento">
          <div className="bg-surface-container-lowest rounded-3xl card-shadow border border-border-subtle p-5 sm:p-6 lg:p-8 overflow-hidden relative">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-fixed-dim rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-container rounded-full blur-3xl opacity-30"></div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {/* Insurance Flow */}
              <div className="bg-surface p-5 lg:p-6 rounded-2xl border border-border-subtle flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 bg-primary-container rounded-full flex items-center justify-center text-on-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px] lg:text-[22px]">shield</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[13px] lg:text-[14px] font-semibold">
                    Insurance
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1 text-[13px] lg:text-[14px]">Coverage</p>
                  <p className="font-headline-lg text-primary text-2xl lg:text-[28px] font-bold">₹10,00,000</p>
                </div>
                <div className="pt-3.5 border-t border-border-subtle">
                  <p className="font-label-sm text-on-surface-variant mb-1 text-[12px] lg:text-[13px]">Room Limit</p>
                  <p className="font-headline-lg text-primary text-base lg:text-[17px] font-semibold">₹8,000/day</p>
                </div>
              </div>

              {/* Hospital Flow */}
              <div className="bg-surface p-5 lg:p-6 rounded-2xl border border-border-subtle flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 bg-secondary rounded-full flex items-center justify-center text-on-secondary shrink-0">
                    <span className="material-symbols-outlined text-[20px] lg:text-[22px]">local_hospital</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[13px] lg:text-[14px] font-semibold">
                    Hospital
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1 text-[13px] lg:text-[14px]">Compatibility</p>
                  <p className="font-headline-lg text-status-safe text-2xl lg:text-[28px] font-bold flex items-center gap-1.5">
                    86 <span className="material-symbols-outlined text-2xl">check_circle</span>
                  </p>
                </div>
                <div className="pt-3.5 border-t border-border-subtle">
                  <p className="font-label-sm text-status-safe font-medium flex items-center gap-1 text-[13px] lg:text-[14px]">
                    <span className="w-2 h-2 rounded-full bg-status-safe"></span> In Network
                  </p>
                </div>
              </div>

              {/* Room Flow */}
              <div className="bg-surface p-5 lg:p-6 rounded-2xl border border-border-subtle flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 bg-tertiary-container rounded-full flex items-center justify-center text-on-tertiary-container shrink-0">
                    <span className="material-symbols-outlined text-[20px] lg:text-[22px]">bed</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[13px] lg:text-[14px] font-semibold">
                    Room
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1 text-[13px] lg:text-[14px]">Status</p>
                  <p className="font-headline-lg text-status-safe text-xl lg:text-[24px] font-bold">Within limit</p>
                </div>
                <div className="pt-3.5 border-t border-border-subtle">
                  <p className="font-label-sm text-on-surface-variant text-[13px] lg:text-[14px]">Private AC Room</p>
                </div>
              </div>

              {/* Journey Flow */}
              <div className="bg-surface p-5 lg:p-6 rounded-2xl border border-border-subtle flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 bg-primary-fixed-dim rounded-full flex items-center justify-center text-primary-container shrink-0">
                    <span className="material-symbols-outlined text-[20px] lg:text-[22px]">timeline</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[13px] lg:text-[14px] font-semibold">
                    Care Journey
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1 text-[13px] lg:text-[14px]">Current Stage</p>
                  <p className="font-headline-lg text-primary text-xl lg:text-[24px] font-bold">Admission</p>
                </div>
                <div className="pt-3.5 border-t border-border-subtle">
                  <p className="font-label-sm text-on-surface-variant text-[13px] lg:text-[14px]">Pre-auth initiated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Sections */}
      <main>
        {/* Features Section */}
        <section className="py-24 md:py-32 px-margin-desktop bg-surface scroll-mt-20" id="features">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-20 reveal">
              <h2 className="editorial-text mb-4 text-3xl md:text-headline-lg font-semibold">
                Everything you need, in one place.
              </h2>
              <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto text-lg">
                A comprehensive framework designed to bring clarity to every aspect of the patient admission experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="flex flex-col gap-4 reveal reveal-delay-1 p-8 bg-surface-container-lowest rounded-3xl card-shadow border border-border-subtle card-interactive">
                <span className="material-symbols-outlined text-primary-container text-4xl mb-2">policy</span>
                <h3 className="font-headline-lg text-primary uppercase tracking-wider font-bold text-lg">
                  Insurance Intelligence
                </h3>
                <p className="font-body-md text-on-surface-variant text-base">
                  Extracts sum insured, room rent limits, pre-authorization windows, and exclusions from policy documents with AI accuracy and deterministic fallback.
                </p>
              </div>

              <div className="flex flex-col gap-4 reveal reveal-delay-2 p-8 bg-surface-container-lowest rounded-3xl card-shadow border border-border-subtle card-interactive">
                <span className="material-symbols-outlined text-secondary text-4xl mb-2">domain</span>
                <h3 className="font-headline-lg text-primary uppercase tracking-wider font-bold text-lg">
                  Deterministic Hospital Matching
                </h3>
                <p className="font-body-md text-on-surface-variant text-base">
                  Calculates a 0-100 Compatibility Score across Network (40%), Room Rent (30%), Specialty (20%), and Policy Terms (10%).
                </p>
                <div className="mt-2 pt-4 border-t border-border-subtle">
                  <p className="font-label-sm text-on-surface-variant mb-2 text-xs font-semibold">Multi-Factor Weighting:</p>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-on-surface-variant">
                    <span className="bg-surface px-2.5 py-1 rounded-full border border-border-subtle">Network: 40%</span>
                    <span className="bg-surface px-2.5 py-1 rounded-full border border-border-subtle">Room Rent: 30%</span>
                    <span className="bg-surface px-2.5 py-1 rounded-full border border-border-subtle">Specialty: 20%</span>
                    <span className="bg-surface px-2.5 py-1 rounded-full border border-border-subtle">Policy: 10%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 reveal reveal-delay-3 p-8 bg-surface-container-lowest rounded-3xl card-shadow border border-border-subtle card-interactive">
                <span className="material-symbols-outlined text-tertiary-container text-4xl mb-2">bed</span>
                <h3 className="font-headline-lg text-primary uppercase tracking-wider font-bold text-lg">
                  Room Category Matrix
                </h3>
                <p className="font-body-md text-on-surface-variant text-base">
                  Evaluates each hospital room against policy daily caps, flagging proportionate deduction risks so caregivers avoid unexpected co-pays.
                </p>
                <p className="text-xs text-on-surface-variant italic mt-1">
                  Advisory tool for financial transparency; does not guarantee hospital tariffs.
                </p>
              </div>

              <div className="flex flex-col gap-4 reveal reveal-delay-4 p-8 bg-surface-container-lowest rounded-3xl card-shadow border border-border-subtle card-interactive">
                <span className="material-symbols-outlined text-primary-fixed-dim text-4xl mb-2">route</span>
                <h3 className="font-headline-lg text-primary uppercase tracking-wider font-bold text-lg">
                  Care Journey State Machine
                </h3>
                <p className="font-body-md text-on-surface-variant text-base">
                  Guides patient caregivers through Admission, Investigation, Procedure, and Recovery with checklist guidance and questions for the TPA desk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Caregiver Companion Section */}
        <section className="py-24 md:py-32 px-margin-desktop bg-surface-container-low">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="reveal">
              <h2 className="editorial-text mb-6 text-3xl md:text-headline-lg font-semibold">
                Peace of mind for those who care most.
              </h2>
              <p className="font-body-md text-on-surface-variant mb-8 text-lg">
                Navigating a loved one&apos;s hospital admission is stressful enough without having to decipher medical billing codes or policy sub-limits. OSPAT acts as a dedicated companion for caregivers, organizing complex data into clear choices.
              </p>
              <blockquote className="border-l-4 border-primary-container pl-6 italic text-on-surface-variant text-base md:text-lg">
                &ldquo;When my father needed urgent surgery, OSPAT helped me understand our network options in minutes, not hours. It felt like having an insurance advocate right beside me.&rdquo;
                <footer className="mt-4 font-label-sm text-primary font-semibold text-base not-italic">
                  — Sarah M., Caregiver
                </footer>
              </blockquote>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 card-shadow reveal reveal-delay-2 relative overflow-hidden border border-border-subtle">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary-fixed-dim rounded-full blur-3xl opacity-30"></div>
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-4 border-b border-border-subtle pb-6">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">family_restroom</span>
                  </div>
                  <div>
                    <h4 className="font-headline-lg text-primary text-xl font-semibold">Caregiver Assistant</h4>
                    <p className="font-label-sm text-on-surface-variant text-xs">Real-time status updates</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-border-subtle">
                    <span className="text-on-surface text-sm font-medium">Pre-Authorization Status</span>
                    <span className="text-status-safe font-semibold text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span> Approved
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-border-subtle">
                    <span className="text-on-surface text-sm font-medium">Estimated Daily Co-Pay</span>
                    <span className="text-primary font-semibold text-sm">₹0 (Within Limit)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 md:py-32 px-margin-desktop bg-surface scroll-mt-20" id="how-it-works">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16 reveal">
              <h2 className="editorial-text mb-4 text-3xl md:text-headline-lg font-semibold">
                How OSPAT Works
              </h2>
              <p className="font-body-md text-on-surface-variant text-lg">
                Four simple steps from confusion to clarity.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="step-indicator flex flex-col items-center text-center reveal reveal-delay-1">
                <div className="w-16 h-16 rounded-full bg-surface-container border-2 border-primary-container flex items-center justify-center mb-6 relative z-10 text-primary font-headline-lg font-bold text-xl">
                  1
                </div>
                <h4 className="font-headline-lg text-primary mb-2 font-semibold text-lg">Upload</h4>
                <p className="font-body-md text-on-surface-variant text-sm">
                  Upload your health insurance policy schedule. We extract room caps and exclusions.
                </p>
              </div>
              <div className="step-indicator flex flex-col items-center text-center reveal reveal-delay-2">
                <div className="w-16 h-16 rounded-full bg-surface-container border-2 border-primary-container flex items-center justify-center mb-6 relative z-10 text-primary font-headline-lg font-bold text-xl">
                  2
                </div>
                <h4 className="font-headline-lg text-primary mb-2 font-semibold text-lg">Compare</h4>
                <p className="font-body-md text-on-surface-variant text-sm">
                  We compare your coverage against hospitals to calculate transparent match scores.
                </p>
              </div>
              <div className="step-indicator flex flex-col items-center text-center reveal reveal-delay-3">
                <div className="w-16 h-16 rounded-full bg-surface-container border-2 border-primary-container flex items-center justify-center mb-6 relative z-10 text-primary font-headline-lg font-bold text-xl">
                  3
                </div>
                <h4 className="font-headline-lg text-primary mb-2 font-semibold text-lg">Review</h4>
                <p className="font-body-md text-on-surface-variant text-sm">
                  Review side-by-side room category limits and proportionate deduction warnings.
                </p>
              </div>
              <div className="step-indicator flex flex-col items-center text-center reveal reveal-delay-4">
                <div className="w-16 h-16 rounded-full bg-surface-container border-2 border-primary-container flex items-center justify-center mb-6 relative z-10 text-primary font-headline-lg font-bold text-xl">
                  4
                </div>
                <h4 className="font-headline-lg text-primary mb-2 font-semibold text-lg">Navigate</h4>
                <p className="font-body-md text-on-surface-variant text-sm">
                  Advance through Admission, Investigation, Procedure, and Recovery with checklists.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Clause Explanation Section */}
        <section className="py-24 md:py-32 px-margin-desktop bg-surface-container-highest">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1 bg-surface-container-lowest rounded-3xl p-8 card-shadow reveal reveal-delay-1 border border-border-subtle">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveClause('coinsurance')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeClause === 'coinsurance' ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant'
                  }`}
                >
                  Coinsurance
                </button>
                <button
                  onClick={() => setActiveClause('roomRent')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeClause === 'roomRent' ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant'
                  }`}
                >
                  Room Rent Cap
                </button>
                <button
                  onClick={() => setActiveClause('waitingPeriod')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeClause === 'waitingPeriod' ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant'
                  }`}
                >
                  Waiting Period
                </button>
              </div>

              <div className="bg-surface p-4 rounded-xl mb-4 border border-border-subtle">
                <p className="font-label-caps text-on-surface-variant mb-2 text-xs font-semibold">Complex Policy Clause</p>
                <p className="font-body-md text-on-surface text-sm opacity-75 font-mono">
                  &ldquo;{clauseExplanations[activeClause].raw}&rdquo;
                </p>
              </div>
              <div className="flex justify-center my-3">
                <span className="material-symbols-outlined text-primary-container">arrow_downward</span>
              </div>
              <div className="bg-primary-fixed-dim/20 p-6 rounded-xl border border-primary-fixed">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-sm">info</span>
                  <p className="font-label-caps text-primary text-xs font-bold">Plain Language Explanation</p>
                </div>
                <p className="font-body-md text-primary font-medium text-base">
                  {clauseExplanations[activeClause].plain}
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2 reveal">
              <h2 className="editorial-text mb-6 text-3xl md:text-headline-lg font-semibold">
                Complex information, explained simply.
              </h2>
              <p className="font-body-md text-on-surface-variant mb-6 text-lg">
                OSPAT translates dense health insurance clauses and hospital room tariffs into clear language so caregivers can make informed decisions.
              </p>
              <ul className="space-y-4 mb-8 text-base">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container mt-1 text-sm">check</span>
                  <span className="text-on-surface-variant">Deterministic mathematical matching for policy limits</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container mt-1 text-sm">check</span>
                  <span className="text-on-surface-variant">Plain-language explanations powered by Google Gemini API</span>
                </li>
              </ul>
              <p className="text-xs text-on-surface-variant italic">
                AI explanations are non-binding decision-support summaries; policy wording remains authoritative.
              </p>
            </div>
          </div>
        </section>

        {/* Trust & Privacy Section */}
        <section className="py-20 md:py-24 px-margin-desktop bg-[#001f26] text-white scroll-mt-20" id="responsible-use">
          <div className="max-w-container-max mx-auto text-center reveal">
            <span className="material-symbols-outlined text-4xl text-primary-fixed mb-4">lock</span>
            <h2 className="font-headline-lg text-2xl md:text-3xl mb-4 font-bold">
              Built for clarity, not decisions made for you.
            </h2>
            <p className="font-body-md text-primary-fixed-dim max-w-2xl mx-auto mb-8 text-base md:text-lg">
              Health information is deeply personal. OSPAT provides objective decision-support without overstepping clinical or insurer boundaries.
            </p>
            <div className="bg-surface-tint/20 max-w-3xl mx-auto rounded-2xl p-6 md:p-8 mb-8 text-left border border-primary-container">
              <h3 className="text-primary-fixed font-bold mb-3 text-lg">OSPAT does not:</h3>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-status-warning mt-0.5 text-sm">close</span>
                  <span className="text-primary-fixed-dim">Provide medical diagnoses or replace physician judgment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-status-warning mt-0.5 text-sm">close</span>
                  <span className="text-primary-fixed-dim">Guarantee insurer claim approval or reimbursement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-status-warning mt-0.5 text-sm">close</span>
                  <span className="text-primary-fixed-dim">Sell or share personal patient health information</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary-fixed text-2xl">verified_user</span>
                <span className="font-label-sm text-primary-fixed-dim">Secure Processing</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary-fixed text-2xl">enhanced_encryption</span>
                <span className="font-label-sm text-primary-fixed-dim">Zero Data Selling</span>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-margin-desktop bg-surface-container-low text-center">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary mb-stack-md font-bold">
              Ready to navigate your care?
            </h2>
            <NextLink
              href="/insurance"
              className="bg-primary-container text-on-primary font-label-sm px-10 py-4 rounded-full hover:bg-primary transition-colors text-base font-medium inline-block shadow-md btn-interactive"
            >
              Start with clarity
            </NextLink>
          </div>
        </section>
      </main>

      {/* Marketing Footer */}
      <footer className="w-full py-stack-lg px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container-low border-t border-border-subtle">
        <div className="font-headline-lg text-lg text-primary font-bold">OSPAT Intelligence</div>
        <div className="font-label-sm text-xs text-on-surface-variant text-center md:text-left">
          © 2024 OSPAT Intelligence. All rights reserved. Information support only; not medical advice.
        </div>
        <div className="flex gap-4 text-xs">
          <NextLink className="text-on-surface-variant hover:text-primary transition-opacity font-label-sm" href="/insurance">
            Insurance
          </NextLink>
          <NextLink className="text-on-surface-variant hover:text-primary transition-opacity font-label-sm" href="/hospitals">
            Hospitals
          </NextLink>
          <NextLink className="text-on-surface-variant hover:text-primary transition-opacity font-label-sm" href="/journey">
            Care Journey
          </NextLink>
          <a className="text-on-surface-variant hover:text-primary transition-opacity font-label-sm" href="#responsible-use">
            Responsible Use
          </a>
        </div>
      </footer>
    </div>
  );
}
