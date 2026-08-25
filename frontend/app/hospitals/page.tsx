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

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-lg text-lg md:text-xl text-primary font-bold">
            Hospitals matching your policy — {filteredMatches.length} facilities
          </h2>
          <div className="flex items-center gap-2 font-label-sm text-xs text-on-surface-variant">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-primary border-none cursor-pointer focus:outline-none"
            >
              <option value="SCORE">Best Match</option>
              <option value="NAME">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Hospital Result Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-on-surface-variant">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Evaluating hospital compatibility...</p>
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
                          <div className="md:hidden">
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-base ${scoreColor}`}>
                              {hospital.compatibilityScore}
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
                      <div className="hidden md:flex flex-col items-end min-w-[200px] border-l border-border-subtle pl-6">
                        <div className="font-label-caps text-xs text-on-surface-variant mb-1 tracking-widest font-semibold">
                          COMPATIBILITY SCORE
                        </div>
                        <div className={`flex items-baseline gap-1 ${scoreColor}`}>
                          <span className="font-metric-value text-3xl font-bold">{hospital.compatibilityScore}</span>
                          <span className="font-body-md text-sm text-on-surface-variant">/100</span>
                        </div>
                        <div className={`font-label-sm text-xs px-2.5 py-1 rounded-full mt-2 font-medium ${scoreBg}`}>
                          {hospital.scoreRating ? hospital.scoreRating.replace('_', ' ') : 'Match Rating'}
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
                          <div className="space-y-3 max-w-md">
                            <div>
                              <div className="flex justify-between font-label-sm text-xs mb-1">
                                <span className="text-on-surface-variant">Network Status (40%)</span>
                                <span className="font-semibold text-status-safe">{hospital.networkScore}/40</span>
                              </div>
                              <div className="w-full bg-surface-container rounded-full h-1.5">
                                <div
                                  className="bg-status-safe h-1.5 rounded-full"
                                  style={{ width: `${(hospital.networkScore / 40) * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between font-label-sm text-xs mb-1">
                                <span className="text-on-surface-variant">Room Rent Cap (30%)</span>
                                <span className="font-semibold text-status-safe">{hospital.roomScore}/30</span>
                              </div>
                              <div className="w-full bg-surface-container rounded-full h-1.5">
                                <div
                                  className="bg-status-safe h-1.5 rounded-full"
                                  style={{ width: `${(hospital.roomScore / 30) * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between font-label-sm text-xs mb-1">
                                <span className="text-on-surface-variant">Clinical Specialty (20%)</span>
                                <span className="font-semibold text-status-warning">{hospital.specialtyScore}/20</span>
                              </div>
                              <div className="w-full bg-surface-container rounded-full h-1.5">
                                <div
                                  className="bg-status-warning h-1.5 rounded-full"
                                  style={{ width: `${(hospital.specialtyScore / 20) * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between font-label-sm text-xs mb-1">
                                <span className="text-on-surface-variant">Policy Baseline (10%)</span>
                                <span className="font-semibold text-status-safe">{hospital.policyConstraintScore}/10</span>
                              </div>
                              <div className="w-full bg-surface-container rounded-full h-1.5">
                                <div
                                  className="bg-status-safe h-1.5 rounded-full"
                                  style={{ width: `${(hospital.policyConstraintScore / 10) * 100}%` }}
                                ></div>
                              </div>
                            </div>
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
