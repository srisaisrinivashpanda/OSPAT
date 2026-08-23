'use client';

import { MapPin, Stethoscope, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HospitalFiltersProps {
  specialty: string;
  location: string;
  onSpecialtyChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export function HospitalFilters({
  specialty,
  location,
  onSpecialtyChange,
  onLocationChange,
  onSearch,
  loading,
}: HospitalFiltersProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') onSearch();
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {/* Location */}
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <Input
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Filter by location..."
          className="pl-9"
          disabled={loading}
        />
      </div>

      {/* Specialty */}
      <div className="relative flex-1">
        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <Input
          value={specialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Cardiology..."
          className="pl-9"
          disabled={loading}
        />
      </div>

      {/* Search button */}
      <Button
        onClick={onSearch}
        disabled={loading}
        className="sm:shrink-0 gap-2"
      >
        <Search className="w-4 h-4" />
        {loading ? 'Searching...' : 'Find Compatible Hospitals'}
      </Button>
    </div>
  );
}
