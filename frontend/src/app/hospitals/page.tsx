'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, TrendingUp } from 'lucide-react';
import { matchHospitals } from '@/lib/api/hospitalApi';
import { HospitalCard } from '@/components/hospitals/HospitalCard';
import { HospitalCardSkeleton } from '@/components/hospitals/HospitalCardSkeleton';
import { HospitalFilters } from '@/components/hospitals/HospitalFilters';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';

// Filter params committed to the query (updated only on search click)
interface FilterParams {
  specialty: string;
  location: string;
}

const PATIENT_ID = 1;

export default function HospitalsPage() {
  // Controlled input state (not yet submitted)
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  // Committed filter params drive the query key
  const [committed, setCommitted] = useState<FilterParams>({
    specialty: '',
    location: '',
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['hospitals', 'match', committed],
    queryFn: () =>
      matchHospitals({
        patientId: PATIENT_ID,
        specialty: committed.specialty || null,
        location: committed.location || null,
      }),
  });

  function handleSearch() {
    setCommitted({ specialty: specialtyInput, location: locationInput });
  }

  const results = data ?? [];
  const hasHighCompatibility = results.some((r) => r.scoreRating === 'HIGH_COMPATIBILITY');

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Find a hospital compatible with your policy
        </h1>
        <p className="text-slate-500 text-sm">
          Hospitals are ranked by policy compatibility score. Scores reflect network
          status, room coverage, and specialty alignment — not a medical recommendation.
        </p>
      </div>

      {/* Filters */}
      <HospitalFilters
        specialty={specialtyInput}
        location={locationInput}
        onSpecialtyChange={setSpecialtyInput}
        onLocationChange={setLocationInput}
        onSearch={handleSearch}
        loading={isLoading}
      />

      {/* Results area */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <HospitalCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No matching hospitals found"
          message="No matching hospitals found from the available data. Try adjusting your location or specialty filters."
        />
      ) : (
        <div className="space-y-4">
          {/* Result meta */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing{' '}
              <span className="font-semibold text-slate-800">{results.length}</span>{' '}
              hospital{results.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* High compatibility callout */}
          {hasHighCompatibility && (
            <div className="flex items-center gap-2 text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-4 py-2.5">
              <TrendingUp className="w-4 h-4 shrink-0" />
              Hospitals below are sorted by policy compatibility score (highest first).
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {results.map((result) => (
              <HospitalCard key={result.hospitalId} result={result} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
