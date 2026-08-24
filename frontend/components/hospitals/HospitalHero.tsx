'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HospitalHeroProps {
  locationQuery: string;
  setLocationQuery: (val: string) => void;
  specialtyQuery: string;
  setSpecialtyQuery: (val: string) => void;
  onSearch: () => void;
}

export default function HospitalHero({
  locationQuery,
  setLocationQuery,
  specialtyQuery,
  setSpecialtyQuery,
  onSearch,
}: HospitalHeroProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className="mb-8 md:mb-12 pt-2 reveal active">
      <div className="max-w-4xl">
        <span className="font-label-caps text-xs text-tertiary mb-3 tracking-[0.2em] uppercase block font-bold">
          HOSPITAL MATCHING
        </span>
        <h1 className="font-display-hero-mobile md:font-display-hero text-on-surface mb-8 uppercase tracking-tight font-extrabold">
          FIND CARE THAT FITS.
        </h1>

        {/* Dual Search Bar directly matching Stitch Image 5 */}
        <form
          onSubmit={handleSubmit}
          className="relative w-full border-b border-on-surface/40 focus-within:border-primary transition-colors duration-300 pb-3 flex flex-col md:flex-row items-start md:items-center gap-4"
        >
          <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Location..."
              className="w-full sm:w-1/2 bg-transparent border-none focus:ring-0 text-base md:text-xl font-title-lg text-on-surface placeholder:text-on-surface-variant/40 p-0 focus:outline-none"
            />
            <div className="hidden sm:block w-[1px] bg-outline-variant/40 h-6 my-auto" />
            <input
              type="text"
              value={specialtyQuery}
              onChange={(e) => setSpecialtyQuery(e.target.value)}
              placeholder="Specialty..."
              className="w-full sm:w-1/2 bg-transparent border-none focus:ring-0 text-base md:text-xl font-title-lg text-on-surface placeholder:text-on-surface-variant/40 p-0 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-on-primary font-label-caps text-xs px-6 py-3 uppercase tracking-widest hover:bg-primary-container transition-all whitespace-nowrap self-stretch md:self-auto flex items-center justify-center gap-2 rounded-full shadow-sm cursor-pointer"
          >
            <span>FIND MATCHES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
}
