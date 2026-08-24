'use client';

import React, { useEffect, useState, useRef } from 'react';
import NextLink from 'next/link';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import Lenis from 'lenis';

export default function LandingPage() {
  const [activeClause, setActiveClause] = useState<'coinsurance' | 'roomRent' | 'waitingPeriod'>('coinsurance');
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const lastScrollY = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // 2. Header Scroll listener & Direction Tracker
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 100);

      if (Math.abs(currentScrollY - lastScrollY.current) > 3) {
        setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
        lastScrollY.current = currentScrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetId, { offset: -80 });
    } else {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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

  // Reusable Direction-Aware Framer Motion Variants
  const appleEase = [0.16, 1, 0.3, 1] as const;

  const fadeVariants: Variants = {
    hidden: (direction: 'down' | 'up') => ({
      opacity: 0,
      y: shouldReduceMotion ? 0 : (direction === 'down' ? 40 : -40),
    }),
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        ease: appleEase,
      },
    },
  };

  const containerStaggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: (direction: 'down' | 'up') => ({
      opacity: 0,
      y: shouldReduceMotion ? 0 : (direction === 'down' ? 32 : -32),
    }),
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.65,
        ease: appleEase,
      },
    },
  };

  // Hero Headline Typing Animation Data
  const headlineLine1 = "Care decisions";
  const headlineLine2Part1 = "made ";
  const headlineLine2Part2 = "clearer";
  const headlineLine3 = "for you.";

  return (
    <div className="bg-gradient-to-b from-[#FAF8F9] via-[#f1f6f8] to-[#FAF8F9] text-[#191C1D] font-body-md antialiased overflow-x-hidden min-h-screen">
      {/* Shrinking Glass Sticky TopNavBar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          scrolled
            ? 'h-16 bg-surface/85 backdrop-blur-xl shadow-sm border-b border-border-subtle/80'
            : 'h-20 bg-surface/70 backdrop-blur-sm border-b border-border-subtle/30'
        }`}
      >
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-full transition-all duration-300">
          <NextLink
            href="/"
            className="font-headline-lg text-[18px] font-semibold text-[#111827] tracking-tight leading-[24px] whitespace-nowrap flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d4e5c]"></span>
            OSPAT Intelligence
          </NextLink>
          <div className="hidden md:flex items-center gap-gutter text-base">
            <a
              className="text-slate-600 hover:text-[#111827] transition-colors duration-200"
              href="#how-it-works"
              onClick={(e) => handleAnchorClick(e, '#how-it-works')}
            >
              How it works
            </a>
            <a
              className="text-slate-600 hover:text-[#111827] transition-colors duration-200"
              href="#features"
              onClick={(e) => handleAnchorClick(e, '#features')}
            >
              Features
            </a>
            <a
              className="text-slate-600 hover:text-[#111827] transition-colors duration-200"
              href="#responsible-use"
              onClick={(e) => handleAnchorClick(e, '#responsible-use')}
            >
              Responsible use
            </a>
            <NextLink
              href="/onboarding"
              className={`bg-[#0d4e5c] hover:bg-[#003641] text-white font-label-sm rounded-full transition-all duration-200 font-medium btn-interactive ${
                scrolled ? 'px-5 py-2 text-sm' : 'px-6 py-3 text-base'
              }`}
            >
              Get Started
            </NextLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 px-margin-mobile md:px-margin-desktop overflow-hidden hero-gradient">
        <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Main Hero Headline: Three-Line Editorial Composition with Handwritten Indigo "clearer" */}
          <h1 className="text-[44px] sm:text-[60px] md:text-[76px] lg:text-[86px] xl:text-[92px] text-[#111827] tracking-tight leading-[0.96] sm:leading-[0.98] lg:leading-[1.0] text-center mb-6 sm:mb-8 max-w-5xl">
            {/* Line 1: Care decisions (bold modern dark neutral sans) */}
            <span className="block whitespace-nowrap font-hero-display font-extrabold">
              {headlineLine1.split('').map((char, index) => (
                <motion.span
                  key={`l1-${index}`}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.25,
                    delay: shouldReduceMotion ? 0 : index * 0.05,
                    ease: appleEase,
                  }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>

            {/* Line 2: made clearer ("made " in bold sans, "clearer" in messy handwritten ink-blue) */}
            <span className="block whitespace-nowrap">
              {/* "made " */}
              <span className="font-hero-display font-extrabold">
                {headlineLine2Part1.split('').map((char, index) => {
                  const totalIndex = headlineLine1.length + index;
                  return (
                    <motion.span
                      key={`l2-p1-${index}`}
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.25,
                        delay: shouldReduceMotion ? 0 : totalIndex * 0.05,
                        ease: appleEase,
                      }}
                      className="inline-block"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  );
                })}
              </span>

              {/* "clearer" (handwritten ink-blue accent) */}
              <span className="font-editorial-handwritten font-bold text-[#4F6FD8] text-[1.14em] tracking-normal inline-block -rotate-1 transform-gpu">
                {headlineLine2Part2.split('').map((char, index) => {
                  const totalIndex = headlineLine1.length + headlineLine2Part1.length + index;
                  return (
                    <motion.span
                      key={`l2-p2-${index}`}
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.25,
                        delay: shouldReduceMotion ? 0 : totalIndex * 0.05,
                        ease: appleEase,
                      }}
                      className="inline-block"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  );
                })}
              </span>
            </span>

            {/* Line 3: for you. (bold modern dark neutral sans) */}
            <span className="block whitespace-nowrap font-hero-display font-extrabold">
              {headlineLine3.split('').map((char, index) => {
                const totalIndex = headlineLine1.length + headlineLine2Part1.length + headlineLine2Part2.length + index;
                return (
                  <motion.span
                    key={`l3-${index}`}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.25,
                      delay: shouldReduceMotion ? 0 : totalIndex * 0.05,
                      ease: appleEase,
                    }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                );
              })}
            </span>
          </h1>

          {/* Supporting Text: Reveals smoothly after typing completion */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              delay: shouldReduceMotion ? 0 : 1.75,
              ease: appleEase,
            }}
            className="font-body-md text-slate-600 text-base sm:text-lg md:text-[19px] lg:text-[20px] leading-[26px] sm:leading-[28px] lg:leading-[30px] max-w-2xl lg:max-w-3xl"
          >
            Understand your coverage, compare hospital options, and know what matters at every stage of care.
          </motion.p>
        </div>

        {/* Premium Product Visual Bento (Enters smoothly as ONE composed unit after text) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.75,
            delay: shouldReduceMotion ? 0 : 1.95,
            ease: appleEase,
          }}
          className="mt-8 sm:mt-10 lg:mt-12 w-full max-w-6xl mx-auto relative"
        >
          <div className="bg-surface-container-lowest rounded-3xl card-shadow border border-border-subtle p-5 sm:p-6 lg:p-8 overflow-hidden relative">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0d4e5c]/10 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl opacity-30"></div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {/* Insurance Flow */}
              <div className="bg-surface p-5 lg:p-6 rounded-2xl border border-border-subtle flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 bg-[#0d4e5c] rounded-full flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-[20px] lg:text-[22px]">shield</span>
                  </div>
                  <span className="font-label-sm text-slate-500 uppercase tracking-wider text-[13px] lg:text-[14px] font-semibold">
                    Insurance
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-slate-500 mb-1 text-[13px] lg:text-[14px]">Coverage</p>
                  <p className="font-headline-lg text-[#111827] text-2xl lg:text-[28px] font-bold">₹10,00,000</p>
                </div>
                <div className="pt-3.5 border-t border-border-subtle">
                  <p className="font-label-sm text-slate-500 mb-1 text-[12px] lg:text-[13px]">Room Limit</p>
                  <p className="font-headline-lg text-[#111827] text-base lg:text-[17px] font-semibold">₹8,000/day</p>
                </div>
              </div>

              {/* Hospital Flow */}
              <div className="bg-surface p-5 lg:p-6 rounded-2xl border border-border-subtle flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 bg-slate-700 rounded-full flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-[20px] lg:text-[22px]">local_hospital</span>
                  </div>
                  <span className="font-label-sm text-slate-500 uppercase tracking-wider text-[13px] lg:text-[14px] font-semibold">
                    Hospital
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-slate-500 mb-1 text-[13px] lg:text-[14px]">Compatibility</p>
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
                  <div className="w-11 h-11 lg:w-12 lg:h-12 bg-[#673d18] rounded-full flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-[20px] lg:text-[22px]">bed</span>
                  </div>
                  <span className="font-label-sm text-slate-500 uppercase tracking-wider text-[13px] lg:text-[14px] font-semibold">
                    Room
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-slate-500 mb-1 text-[13px] lg:text-[14px]">Status</p>
                  <p className="font-headline-lg text-status-safe text-xl lg:text-[24px] font-bold">Within limit</p>
                </div>
                <div className="pt-3.5 border-t border-border-subtle">
                  <p className="font-label-sm text-slate-600 text-[13px] lg:text-[14px]">Private AC Room</p>
                </div>
              </div>

              {/* Journey Flow */}
              <div className="bg-surface p-5 lg:p-6 rounded-2xl border border-border-subtle flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 bg-[#0d4e5c]/15 rounded-full flex items-center justify-center text-[#0d4e5c] shrink-0">
                    <span className="material-symbols-outlined text-[20px] lg:text-[22px]">timeline</span>
                  </div>
                  <span className="font-label-sm text-slate-500 uppercase tracking-wider text-[13px] lg:text-[14px] font-semibold">
                    Care Journey
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-slate-500 mb-1 text-[13px] lg:text-[14px]">Current Stage</p>
                  <p className="font-headline-lg text-[#111827] text-xl lg:text-[24px] font-bold">Admission</p>
                </div>
                <div className="pt-3.5 border-t border-border-subtle">
                  <p className="font-label-sm text-slate-600 text-[13px] lg:text-[14px]">Pre-auth initiated</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Sections */}
      <main>
        {/* Features Section */}
        <section className="py-24 md:py-32 px-margin-desktop bg-surface scroll-mt-20" id="features">
          <div className="max-w-container-max mx-auto">
            <motion.div
              custom={scrollDirection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeVariants}
              className="text-center mb-20"
            >
              <h2 className="editorial-text mb-4 text-3xl md:text-headline-lg font-semibold text-[#111827]">
                Everything you need, in one place.
              </h2>
              <p className="font-body-md text-slate-600 max-w-2xl mx-auto text-lg">
                A comprehensive framework designed to bring clarity to every aspect of the patient admission experience.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={containerStaggerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            >
              <motion.div
                custom={scrollDirection}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.2, ease: appleEase } }}
                className="flex flex-col gap-4 p-8 bg-surface-container-lowest rounded-3xl card-shadow border border-border-subtle card-interactive"
              >
                <span className="material-symbols-outlined text-[#0d4e5c] text-4xl mb-2">policy</span>
                <h3 className="font-headline-lg text-[#111827] uppercase tracking-wider font-bold text-lg">
                  Insurance Intelligence
                </h3>
                <p className="font-body-md text-slate-600 text-base">
                  Extracts sum insured, room rent limits, pre-authorization windows, and exclusions from policy documents with AI accuracy and deterministic fallback.
                </p>
              </motion.div>

              <motion.div
                custom={scrollDirection}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.2, ease: appleEase } }}
                className="flex flex-col gap-4 p-8 bg-surface-container-lowest rounded-3xl card-shadow border border-border-subtle card-interactive"
              >
                <span className="material-symbols-outlined text-slate-700 text-4xl mb-2">domain</span>
                <h3 className="font-headline-lg text-[#111827] uppercase tracking-wider font-bold text-lg">
                  Deterministic Hospital Matching
                </h3>
                <p className="font-body-md text-slate-600 text-base">
                  Calculates a 0-100 Compatibility Score across Network (40%), Room Rent (30%), Specialty (20%), and Policy Terms (10%).
                </p>
                <div className="mt-2 pt-4 border-t border-border-subtle">
                  <p className="font-label-sm text-slate-500 mb-2 text-xs font-semibold">Multi-Factor Weighting:</p>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600">
                    <span className="bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">Network: 40%</span>
                    <span className="bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">Room Rent: 30%</span>
                    <span className="bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">Specialty: 20%</span>
                    <span className="bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">Policy: 10%</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={scrollDirection}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.2, ease: appleEase } }}
                className="flex flex-col gap-4 p-8 bg-surface-container-lowest rounded-3xl card-shadow border border-border-subtle card-interactive"
              >
                <span className="material-symbols-outlined text-[#673d18] text-4xl mb-2">bed</span>
                <h3 className="font-headline-lg text-[#111827] uppercase tracking-wider font-bold text-lg">
                  Room Category Matrix
                </h3>
                <p className="font-body-md text-slate-600 text-base">
                  Evaluates each hospital room against policy daily caps, flagging proportionate deduction risks so caregivers avoid unexpected co-pays.
                </p>
                <p className="text-xs text-slate-400 italic mt-1">
                  Advisory tool for financial transparency; does not guarantee hospital tariffs.
                </p>
              </motion.div>

              <motion.div
                custom={scrollDirection}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.2, ease: appleEase } }}
                className="flex flex-col gap-4 p-8 bg-surface-container-lowest rounded-3xl card-shadow border border-border-subtle card-interactive"
              >
                <span className="material-symbols-outlined text-[#0d4e5c] text-4xl mb-2">route</span>
                <h3 className="font-headline-lg text-[#111827] uppercase tracking-wider font-bold text-lg">
                  Care Journey State Machine
                </h3>
                <p className="font-body-md text-slate-600 text-base">
                  Guides patient caregivers through Admission, Investigation, Procedure, and Recovery with checklist guidance and questions for the TPA desk.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Caregiver Companion Section */}
        <section className="py-24 md:py-32 px-margin-desktop bg-surface-container-low">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              custom={scrollDirection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeVariants}
            >
              <h2 className="editorial-text mb-6 text-3xl md:text-headline-lg font-semibold text-[#111827]">
                Peace of mind for those who care most.
              </h2>
              <p className="font-body-md text-slate-600 mb-8 text-lg">
                Navigating a loved one&apos;s hospital admission is stressful enough without having to decipher medical billing codes or policy sub-limits. OSPAT acts as a dedicated companion for caregivers, organizing complex data into clear choices.
              </p>
              <blockquote className="border-l-4 border-[#0d4e5c] pl-6 italic text-slate-700 text-base md:text-lg">
                &ldquo;When my father needed urgent surgery, OSPAT helped me understand our network options in minutes, not hours. It felt like having an insurance advocate right beside me.&rdquo;
                <footer className="mt-4 font-label-sm text-[#0d4e5c] font-semibold text-base not-italic">
                  — Sarah M., Caregiver
                </footer>
              </blockquote>
            </motion.div>

            <motion.div
              custom={scrollDirection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeVariants}
              className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 card-shadow relative overflow-hidden border border-border-subtle"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-200/30 rounded-full blur-3xl opacity-30"></div>
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-4 border-b border-border-subtle pb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-700">family_restroom</span>
                  </div>
                  <div>
                    <h4 className="font-headline-lg text-[#111827] text-xl font-semibold">Caregiver Assistant</h4>
                    <p className="font-label-sm text-slate-500 text-xs">Real-time status updates</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-border-subtle">
                    <span className="text-slate-800 text-sm font-medium">Pre-Authorization Status</span>
                    <span className="text-status-safe font-semibold text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span> Approved
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-border-subtle">
                    <span className="text-slate-800 text-sm font-medium">Estimated Daily Co-Pay</span>
                    <span className="text-[#111827] font-semibold text-sm">₹0 (Within Limit)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 md:py-32 px-margin-desktop bg-surface scroll-mt-20" id="how-it-works">
          <div className="max-w-container-max mx-auto">
            <motion.div
              custom={scrollDirection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeVariants}
              className="text-center mb-16"
            >
              <h2 className="editorial-text mb-4 text-3xl md:text-headline-lg font-semibold text-[#111827]">
                How OSPAT Works
              </h2>
              <p className="font-body-md text-slate-600 text-lg">
                Four simple steps from confusion to clarity.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={containerStaggerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
            >
              {/* Step 1 */}
              <motion.div
                custom={scrollDirection}
                variants={itemVariants}
                className="group relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl transition-all duration-300 ease-out hover:bg-[#0d4e5c]/[0.04] cursor-pointer"
              >
                {/* Segment Line to Step 2 on Desktop */}
                <div className="hidden md:block absolute top-[52px] left-1/2 w-full h-[2px] bg-slate-200 pointer-events-none z-0 group-hover:bg-[#0d4e5c]/40 transition-colors duration-300" />

                <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-300 group-hover:border-[#0d4e5c] group-hover:bg-[#0d4e5c] group-hover:shadow-[0_0_20px_rgba(13,78,92,0.25)] flex items-center justify-center mb-5 relative z-10 text-[#111827] group-hover:text-white font-headline-lg font-bold text-xl transition-all duration-300 ease-out group-hover:scale-110 shadow-xs">
                  1
                </div>
                <h4 className="font-headline-lg text-[#111827] mb-2 font-semibold text-lg transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  Upload
                </h4>
                <p className="font-body-md text-slate-600 text-sm opacity-80 group-hover:opacity-100 transition-all duration-300 ease-out">
                  Upload your health insurance policy schedule. We extract room caps and exclusions.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                custom={scrollDirection}
                variants={itemVariants}
                className="group relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl transition-all duration-300 ease-out hover:bg-[#0d4e5c]/[0.04] cursor-pointer"
              >
                {/* Segment Line to Step 3 on Desktop */}
                <div className="hidden md:block absolute top-[52px] left-1/2 w-full h-[2px] bg-slate-200 pointer-events-none z-0 group-hover:bg-[#0d4e5c]/40 transition-colors duration-300" />

                <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-300 group-hover:border-[#0d4e5c] group-hover:bg-[#0d4e5c] group-hover:shadow-[0_0_20px_rgba(13,78,92,0.25)] flex items-center justify-center mb-5 relative z-10 text-[#111827] group-hover:text-white font-headline-lg font-bold text-xl transition-all duration-300 ease-out group-hover:scale-110 shadow-xs">
                  2
                </div>
                <h4 className="font-headline-lg text-[#111827] mb-2 font-semibold text-lg transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  Compare
                </h4>
                <p className="font-body-md text-slate-600 text-sm opacity-80 group-hover:opacity-100 transition-all duration-300 ease-out">
                  We compare your coverage against hospitals to calculate transparent match scores.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                custom={scrollDirection}
                variants={itemVariants}
                className="group relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl transition-all duration-300 ease-out hover:bg-[#0d4e5c]/[0.04] cursor-pointer"
              >
                {/* Segment Line to Step 4 on Desktop */}
                <div className="hidden md:block absolute top-[52px] left-1/2 w-full h-[2px] bg-slate-200 pointer-events-none z-0 group-hover:bg-[#0d4e5c]/40 transition-colors duration-300" />

                <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-300 group-hover:border-[#0d4e5c] group-hover:bg-[#0d4e5c] group-hover:shadow-[0_0_20px_rgba(13,78,92,0.25)] flex items-center justify-center mb-5 relative z-10 text-[#111827] group-hover:text-white font-headline-lg font-bold text-xl transition-all duration-300 ease-out group-hover:scale-110 shadow-xs">
                  3
                </div>
                <h4 className="font-headline-lg text-[#111827] mb-2 font-semibold text-lg transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  Review
                </h4>
                <p className="font-body-md text-slate-600 text-sm opacity-80 group-hover:opacity-100 transition-all duration-300 ease-out">
                  Review side-by-side room category limits and proportionate deduction warnings.
                </p>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                custom={scrollDirection}
                variants={itemVariants}
                className="group relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl transition-all duration-300 ease-out hover:bg-[#0d4e5c]/[0.04] cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-300 group-hover:border-[#0d4e5c] group-hover:bg-[#0d4e5c] group-hover:shadow-[0_0_20px_rgba(13,78,92,0.25)] flex items-center justify-center mb-5 relative z-10 text-[#111827] group-hover:text-white font-headline-lg font-bold text-xl transition-all duration-300 ease-out group-hover:scale-110 shadow-xs">
                  4
                </div>
                <h4 className="font-headline-lg text-[#111827] mb-2 font-semibold text-lg transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  Navigate
                </h4>
                <p className="font-body-md text-slate-600 text-sm opacity-80 group-hover:opacity-100 transition-all duration-300 ease-out">
                  Advance through Admission, Investigation, Procedure, and Recovery with checklists.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* AI Clause Explanation Section */}
        <section className="py-24 md:py-32 px-margin-desktop bg-surface-container-highest">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              custom={scrollDirection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeVariants}
              className="order-2 md:order-1 bg-surface-container-lowest rounded-3xl p-8 card-shadow border border-border-subtle"
            >
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveClause('coinsurance')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeClause === 'coinsurance' ? 'bg-[#111827] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Coinsurance
                </button>
                <button
                  onClick={() => setActiveClause('roomRent')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeClause === 'roomRent' ? 'bg-[#111827] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Room Rent Cap
                </button>
                <button
                  onClick={() => setActiveClause('waitingPeriod')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeClause === 'waitingPeriod' ? 'bg-[#111827] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Waiting Period
                </button>
              </div>

              <div className="bg-surface p-4 rounded-xl mb-4 border border-border-subtle">
                <p className="font-label-caps text-slate-500 mb-2 text-xs font-semibold">Complex Policy Clause</p>
                <p className="font-body-md text-slate-700 text-sm font-mono">
                  &ldquo;{clauseExplanations[activeClause].raw}&rdquo;
                </p>
              </div>
              <div className="flex justify-center my-3">
                <span className="material-symbols-outlined text-[#0d4e5c] animate-bounce">arrow_downward</span>
              </div>
              <div className="bg-[#0d4e5c]/5 p-6 rounded-xl border border-[#0d4e5c]/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#0d4e5c] text-sm">info</span>
                  <p className="font-label-caps text-[#0d4e5c] text-xs font-bold">Plain Language Explanation</p>
                </div>
                <p className="font-body-md text-[#111827] font-medium text-base">
                  {clauseExplanations[activeClause].plain}
                </p>
              </div>
            </motion.div>

            <motion.div
              custom={scrollDirection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeVariants}
              className="order-1 md:order-2"
            >
              <h2 className="editorial-text mb-6 text-3xl md:text-headline-lg font-semibold text-[#111827]">
                Complex information, explained simply.
              </h2>
              <p className="font-body-md text-slate-600 mb-6 text-lg">
                OSPAT translates dense health insurance clauses and hospital room tariffs into clear language so caregivers can make informed decisions.
              </p>
              <ul className="space-y-4 mb-8 text-base">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#0d4e5c] mt-1 text-sm font-bold">check</span>
                  <span className="text-slate-700">Deterministic mathematical matching for policy limits</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#0d4e5c] mt-1 text-sm font-bold">check</span>
                  <span className="text-slate-700">Plain-language explanations powered by Google Gemini API</span>
                </li>
              </ul>
              <p className="text-xs text-slate-400 italic">
                AI explanations are non-binding decision-support summaries; policy wording remains authoritative.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trust & Privacy Section */}
        <section className="py-20 md:py-24 px-margin-desktop bg-[#091E24] text-white scroll-mt-20" id="responsible-use">
          <motion.div
            custom={scrollDirection}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeVariants}
            className="max-w-container-max mx-auto text-center"
          >
            <span className="material-symbols-outlined text-4xl text-[#87bece] mb-4">lock</span>
            <h2 className="font-headline-lg text-2xl md:text-3xl mb-4 font-bold text-white">
              Built for clarity, not decisions made for you.
            </h2>
            <p className="font-body-md text-slate-300 max-w-2xl mx-auto mb-8 text-base md:text-lg">
              Health information is deeply personal. OSPAT provides objective decision-support without overstepping clinical or insurer boundaries.
            </p>
            <div className="bg-white/5 max-w-3xl mx-auto rounded-2xl p-6 md:p-8 mb-8 text-left border border-white/10">
              <h3 className="text-white font-bold mb-3 text-lg">OSPAT does not:</h3>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-400 mt-0.5 text-sm">close</span>
                  <span className="text-slate-300">Provide medical diagnoses or replace physician judgment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-400 mt-0.5 text-sm">close</span>
                  <span className="text-slate-300">Guarantee insurer claim approval or reimbursement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-400 mt-0.5 text-sm">close</span>
                  <span className="text-slate-300">Sell or share personal patient health information</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-[#87bece] text-2xl">verified_user</span>
                <span className="font-label-sm text-slate-300">Secure Processing</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-[#87bece] text-2xl">enhanced_encryption</span>
                <span className="font-label-sm text-slate-300">Zero Data Selling</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-margin-desktop bg-surface-container-low text-center">
          <motion.div
            custom={scrollDirection}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeVariants}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-headline-lg text-2xl md:text-headline-lg text-[#111827] mb-stack-md font-bold">
              Ready to navigate your care?
            </h2>
            <motion.div whileHover={shouldReduceMotion ? undefined : { y: -1 }}>
              <NextLink
                href="/onboarding"
                className="bg-[#0d4e5c] hover:bg-[#003641] text-white font-label-sm px-10 py-4 rounded-full transition-colors text-base font-medium inline-block shadow-md btn-interactive"
              >
                Start with clarity
              </NextLink>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Marketing Footer (Full Viewport Width Background + Centered Content Container) */}
      <footer className="w-full bg-surface-container-low border-t border-border-subtle py-6 md:py-8">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          {/* LEFT: Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d4e5c]"></span>
            <span className="font-headline-lg text-base lg:text-lg text-[#111827] font-bold tracking-tight whitespace-nowrap">
              OSPAT Intelligence
            </span>
          </div>

          {/* CENTER: Copyright & Disclaimer */}
          <div className="font-label-sm text-xs text-slate-500 text-center max-w-md lg:max-w-xl leading-relaxed">
            © 2024 OSPAT Intelligence. All rights reserved. Information support only; not medical advice.
          </div>

          {/* RIGHT: Navigation Links */}
          <div className="flex items-center gap-5 sm:gap-6 text-xs lg:text-sm font-medium shrink-0">
            <NextLink className="text-slate-600 hover:text-[#111827] transition-colors" href="/insurance">
              Insurance
            </NextLink>
            <NextLink className="text-slate-600 hover:text-[#111827] transition-colors" href="/hospitals">
              Hospitals
            </NextLink>
            <NextLink className="text-slate-600 hover:text-[#111827] transition-colors" href="/journey">
              Care Journey
            </NextLink>
            <a
              className="text-slate-600 hover:text-[#111827] transition-colors"
              href="#responsible-use"
              onClick={(e) => handleAnchorClick(e, '#responsible-use')}
            >
              Responsible Use
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
