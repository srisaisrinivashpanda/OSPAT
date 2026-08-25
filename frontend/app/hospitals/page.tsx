'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import TopNavBar from '@/components/layout/TopNavBar';
import GlobalFooter from '@/components/layout/GlobalFooter';
import { api } from '@/lib/api/apiClient';
import { HospitalMatchResultDto, PolicyResponseDto } from '@/lib/types';

export default function HospitalsPage() {
  const [matches, setMatches] = useState<HospitalMatchResultDto[]>([]);
  const [policy, setPolicy] = useState<PolicyResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [networkFilter, setNetworkFilter] = useState<'ALL' | 'IN_NETWORK' | 'OUT_OF_NETWORK'>('ALL');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'SCORE' | 'NAME'>('SCORE');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [activePol, matchResults] = await Promise.all([
          api.getActivePolicy(1),
          api.matchHospitals({ patientId: 1 }),
        ]);
        setPolicy(activePol);
        setMatches(matchResults);
      } catch (e) {
        console.warn('Failed to load hospital matches:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Reset to page 1 whenever filters, search, or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, networkFilter, selectedSpecialty, sortBy]);

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  // Collect all distinct specialties
  const allSpecialties = Array.from(
    new Set(matches.flatMap((m) => m.specialties || []))
  ).filter(Boolean);

  const filteredMatches = matches
    .filter((h) => {
      const matchSearch =
        h.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchNetwork =
        networkFilter === 'ALL' || h.networkStatus === networkFilter;
      const matchSpecialty =
        selectedSpecialty === 'ALL' ||
        (h.specialties && h.specialties.includes(selectedSpecialty));
      return matchSearch && matchNetwork && matchSpecialty;
    })
    .sort((a, b) => {
      if (sortBy === 'SCORE') {
        return (b.compatibilityScore || 0) - (a.compatibilityScore || 0);
      }
      return a.hospitalName.localeCompare(b.hospitalName);
    });

  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMatches = filteredMatches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="font-display-hero text-3xl md:text-display-hero text-primary mb-2 font-bold tracking-tight">
            Hospitals that fit your coverage
          </h1>
          <p className="font-body-md text-on-surface-variant text-base md:text-lg max-w-3xl">
            Compare hospitals using your insurance information, care needs, and room considerations.
          </p>
        </section>

        {/* Current Context Bar */}
        <section className="mb-8 bg-surface-container-lowest border border-border-subtle rounded-xl p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
            <div>
              <div className="font-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                YOUR COVERAGE
              </div>
              <div className="font-body-md text-base font-semibold text-primary">
                {policy ? formatCurrency(policy.coverageLimit) : '₹10,00,000'}
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-border-subtle"></div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">bed</span>
            </div>
            <div>
              <div className="font-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                ROOM LIMIT
              </div>
              <div className="font-body-md text-base font-semibold text-primary">
                {policy && policy.roomLimit ? `${formatCurrency(policy.roomLimit)}/day` : '₹8,000/day'}
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-border-subtle"></div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <div>
              <div className="font-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                ACTIVE POLICY
              </div>
              <div className="font-body-md text-base font-semibold text-primary">
                {policy ? policy.insurerName : 'Star Health'}
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search by hospital name or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors font-body-md text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value as any)}
              className="px-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-xl font-label-sm text-xs text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <option value="ALL">All Network Types</option>
              <option value="IN_NETWORK">In Network Only</option>
              <option value="OUT_OF_NETWORK">Out of Network</option>
            </select>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-xl font-label-sm text-xs text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <option value="ALL">All Specialties</option>
              {allSpecialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Results Summary & How Score is Calculated Trigger */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="font-headline-lg text-lg md:text-xl text-primary font-bold">
              {loading ? (
                <span>Hospitals matching your policy</span>
              ) : (
                <span>Hospitals matching your policy — {filteredMatches.length} facilities</span>
              )}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-label-sm text-xs text-on-surface-variant">
            <button
              type="button"
              onClick={() => setShowScoreInfo(!showScoreInfo)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer font-medium ${
                showScoreInfo
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-primary border-border-subtle hover:border-primary/40'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>How is this score calculated?</span>
              <span className="material-symbols-outlined text-[14px]">
                {showScoreInfo ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            <div className="flex items-center gap-1.5">
              <span>Sort by:</span>
              <select
                value={sortBy}
                disabled={loading}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface-container-lowest border border-border-subtle rounded-lg px-2.5 py-1.5 font-semibold text-primary cursor-pointer focus:outline-none disabled:opacity-50"
              >
                <option value="SCORE">Best Match</option>
                <option value="NAME">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expandable "How your compatibility score is calculated" Panel */}
        {showScoreInfo && (
          <div className="mb-8 p-5 sm:p-6 bg-surface-container-lowest rounded-2xl border border-primary/20 card-shadow transition-all duration-200 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-border-subtle">
              <div>
                <h3 className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider">
                  How your compatibility score is calculated
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                  OSPAT evaluates each hospital against your policy rules using a transparent, weighted deterministic model:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScoreInfo(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors"
                aria-label="Close calculation explanation"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Factor 1: Network (40%) */}
              <div className="p-3.5 bg-surface rounded-xl border border-border-subtle flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-on-surface">Network</span>
                  <span className="font-bold text-primary">40%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Whether the hospital is in your insurer&apos;s network for cashless admission.
                </p>
              </div>

              {/* Factor 2: Room Rent (30%) */}
              <div className="p-3.5 bg-surface rounded-xl border border-border-subtle flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-on-surface">Room Rent</span>
                  <span className="font-bold text-primary">30%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Whether available room categories fit within your policy room limit without proportionate deduction.
                </p>
              </div>

              {/* Factor 3: Specialty (20%) */}
              <div className="p-3.5 bg-surface rounded-xl border border-border-subtle flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-on-surface">Specialty</span>
                  <span className="font-bold text-primary">20%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  How well the hospital&apos;s available specialties align with the care requirement.
                </p>
              </div>

              {/* Factor 4: Policy Terms (10%) */}
              <div className="p-3.5 bg-surface rounded-xl border border-border-subtle flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-on-surface">Policy Terms</span>
                  <span className="font-bold text-primary">10%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Other relevant policy constraints and eligibility conditions.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-on-surface-variant">
              <span className="inline-flex items-center gap-1 font-medium text-primary">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Scores are calculated from your policy and hospital data using OSPAT&apos;s deterministic matching engine.
              </span>
              <span className="font-bold text-on-surface">TOTAL: 100%</span>
            </div>
          </div>
        )}

        {/* Hospital Result Cards Grid */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-6 animate-pulse"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-grow space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="h-6 w-56 md:w-72 bg-surface-container rounded-md"></div>
                        <div className="h-4 w-36 bg-surface-container rounded-md"></div>
                      </div>
                      <div className="md:hidden w-12 h-12 rounded-full bg-surface-container"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-28 bg-surface-container rounded-full"></div>
                      <div className="h-6 w-36 bg-surface-container rounded-full"></div>
                    </div>
                    <div className="h-16 bg-surface-container/60 rounded-xl"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="h-12 bg-surface-container/40 rounded-lg"></div>
                      <div className="h-12 bg-surface-container/40 rounded-lg"></div>
                      <div className="h-12 bg-surface-container/40 rounded-lg"></div>
                      <div className="h-12 bg-surface-container/40 rounded-lg"></div>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-end justify-between min-w-[200px] border-t md:border-t-0 md:border-l border-border-subtle pt-4 md:pt-0 md:pl-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-surface-container"></div>
                    <div className="h-10 w-full bg-surface-container rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-2xl border border-border-subtle text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 text-primary-container">search_off</span>
            <h3 className="font-bold text-lg text-primary mb-1">No matching hospitals found</h3>
            <p className="text-sm">Try adjusting your search criteria or network filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {paginatedMatches.map((hospital) => {
                const isHigh = hospital.compatibilityScore >= 80;
                const isMod = hospital.compatibilityScore >= 60 && hospital.compatibilityScore < 80;
                const scoreColor = isHigh
                  ? 'text-status-safe'
                  : isMod
                  ? 'text-status-warning'
                  : 'text-status-critical';
                const scoreBg = isHigh
                  ? 'bg-status-safe/10 text-status-safe'
                  : isMod
                  ? 'bg-status-warning/10 text-status-warning'
                  : 'bg-status-critical/10 text-status-critical';

                const scoreRatingText = isHigh
                  ? 'HIGH COMPATIBILITY'
                  : isMod
                  ? 'GOOD COMPATIBILITY'
                  : 'REVIEW POLICY TERMS';

                return (
                  <article
                    key={hospital.hospitalId}
                    className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-6 metric-card"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-headline-lg text-xl md:text-2xl text-primary font-bold">
                              {hospital.hospitalName}
                            </h3>
                            <div className="flex items-center gap-1 text-on-surface-variant font-body-md text-sm mt-1">
                              <span className="material-symbols-outlined text-[16px]">location_on</span>
                              {hospital.location}
                            </div>
                          </div>
                          {/* Mobile Score Badge */}
                          <div className="md:hidden text-right">
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-base ${scoreColor}`}>
                              {hospital.compatibilityScore}
                            </div>
                            <div className={`font-label-sm text-[10px] font-bold mt-1 ${scoreColor}`}>
                              {scoreRatingText}
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-3 mt-3">
                          <span className="inline-flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full font-label-sm text-xs font-medium">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                hospital.networkStatus === 'IN_NETWORK' ? 'bg-status-safe' : 'bg-status-warning'
                              }`}
                            ></span>
                            {hospital.networkStatus === 'IN_NETWORK' ? 'In network' : 'Out of network'}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-surface-container px-3 py-1 rounded-full font-label-sm text-xs font-medium">
                            <span className="material-symbols-outlined text-[14px]">
                              {hospital.hasEligibleRoom ? 'check_circle' : 'warning'}
                            </span>
                            {hospital.hasEligibleRoom ? 'Rooms within stated limit' : 'Room limit considerations'}
                          </span>
                          {hospital.specialties && hospital.specialties[0] && (
                            <span className="inline-flex items-center gap-1 bg-surface-container px-3 py-1 rounded-full font-label-sm text-xs text-on-surface-variant">
                              Specialty: {hospital.specialties[0]}
                            </span>
                          )}
                        </div>

                        {/* Caregiver Summary */}
                        {hospital.caregiverSummary && (
                          <p className="text-xs text-on-surface-variant font-body-md leading-relaxed mt-2 mb-1">
                            {hospital.caregiverSummary}
                          </p>
                        )}
                      </div>

                      {/* Desktop Score Column */}
                      <div className="hidden md:flex flex-col items-end min-w-[210px] border-l border-border-subtle pl-6">
                        <div className="font-label-caps text-xs text-on-surface-variant mb-1 tracking-widest font-semibold">
                          COMPATIBILITY SCORE
                        </div>
                        <div className={`flex items-baseline gap-1 ${scoreColor}`}>
                          <span className="font-metric-value text-3xl font-bold">{hospital.compatibilityScore}</span>
                          <span className="font-body-md text-sm text-on-surface-variant">/100</span>
                        </div>
                        <div className={`font-label-sm text-[11px] px-3 py-1 rounded-full mt-2 font-bold tracking-wide uppercase ${scoreBg}`}>
                          {scoreRatingText}
                        </div>
                      </div>
                    </div>

                    {/* Why this matches Accordion */}
                    <div className="mt-4 pt-4 border-t border-border-subtle">
                      <details className="group">
                        <summary className="flex justify-between items-center cursor-pointer list-none font-label-sm text-xs text-primary hover:text-primary-container transition-colors font-semibold">
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] group-open:rotate-180 transition-transform">
                              expand_more
                            </span>
                            Why this matches
                          </span>
                          <NextLink
                            href={`/hospitals/${hospital.hospitalId}`}
                            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-sm text-xs hover:bg-primary-container transition-colors hidden md:inline-block"
                          >
                            View hospital & rooms →
                          </NextLink>
                        </summary>

                        <div className="mt-4 pl-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl text-xs">
                            <div className="p-3 bg-surface rounded-xl border border-border-subtle flex justify-between items-center">
                              <span className="text-on-surface flex items-center gap-1.5 font-medium">
                                <span className={`material-symbols-outlined text-[16px] ${hospital.networkScore >= 35 ? 'text-status-safe' : 'text-status-warning'}`}>
                                  {hospital.networkScore >= 35 ? 'check_circle' : 'warning'}
                                </span>
                                {hospital.networkStatus === 'IN_NETWORK' ? 'In network' : 'Out of network'}
                              </span>
                              <span className={`font-bold ${hospital.networkScore >= 35 ? 'text-status-safe' : 'text-status-warning'}`}>
                                {hospital.networkScore}/40
                              </span>
                            </div>

                            <div className="p-3 bg-surface rounded-xl border border-border-subtle flex justify-between items-center">
                              <span className="text-on-surface flex items-center gap-1.5 font-medium">
                                <span className={`material-symbols-outlined text-[16px] ${hospital.roomScore >= 25 ? 'text-status-safe' : 'text-status-warning'}`}>
                                  {hospital.roomScore >= 25 ? 'check_circle' : 'warning'}
                                </span>
                                {hospital.roomScore >= 25 ? 'Room categories within limit' : 'Room limit considerations'}
                              </span>
                              <span className={`font-bold ${hospital.roomScore >= 25 ? 'text-status-safe' : 'text-status-warning'}`}>
                                {hospital.roomScore}/30
                              </span>
                            </div>

                            <div className="p-3 bg-surface rounded-xl border border-border-subtle flex justify-between items-center">
                              <span className="text-on-surface flex items-center gap-1.5 font-medium">
                                <span className={`material-symbols-outlined text-[16px] ${hospital.specialtyScore >= 18 ? 'text-status-safe' : hospital.specialtyScore >= 10 ? 'text-primary' : 'text-status-warning'}`}>
                                  {hospital.specialtyScore >= 18 ? 'check_circle' : hospital.specialtyScore >= 10 ? 'info' : 'warning'}
                                </span>
                                Specialty alignment
                              </span>
                              <span className="font-bold text-on-surface">
                                {hospital.specialtyScore}/20
                              </span>
                            </div>

                            <div className="p-3 bg-surface rounded-xl border border-border-subtle flex justify-between items-center">
                              <span className="text-on-surface flex items-center gap-1.5 font-medium">
                                <span className="material-symbols-outlined text-status-safe text-[16px]">check_circle</span>
                                Policy constraints satisfied
                              </span>
                              <span className="font-bold text-status-safe">
                                {hospital.policyConstraintScore}/10
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 text-xs text-on-surface-variant flex items-center gap-2">
                            <span className="font-semibold text-on-surface">Total compatibility:</span>
                            <span className="font-bold text-primary text-sm">{hospital.compatibilityScore}/100</span>
                            <span className="text-[11px] text-on-surface-variant">
                              ({hospital.networkScore} + {hospital.roomScore} + {hospital.specialtyScore} + {hospital.policyConstraintScore} = {hospital.compatibilityScore})
                            </span>
                          </div>

                          {hospital.matchingFactors && hospital.matchingFactors.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-border-subtle">
                              <p className="text-xs font-semibold text-on-surface mb-1">Positive Match Factors:</p>
                              <ul className="list-disc list-inside text-xs text-on-surface-variant space-y-0.5">
                                {hospital.matchingFactors.map((factor, idx) => (
                                  <li key={idx}>{factor}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <NextLink
                            href={`/hospitals/${hospital.hospitalId}`}
                            className="w-full mt-4 bg-primary text-on-primary px-4 py-3 rounded-lg font-label-sm text-xs text-center block md:hidden"
                          >
                            View hospital & rooms →
                          </NextLink>
                        </div>
                      </details>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav aria-label="Hospital directory pagination" className="pt-8 pb-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-border-subtle bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  Previous
                </button>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-9 h-9 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center ${
                          isActive
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'bg-surface-container-lowest text-on-surface border border-border-subtle hover:bg-surface-container'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-border-subtle bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-xs"
                >
                  Next
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </nav>
            )}
          </div>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
}
