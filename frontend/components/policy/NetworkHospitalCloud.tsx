import React from 'react';
import Link from 'next/link';
import { PolicyResponseDto } from '@/lib/types';

interface NetworkHospitalCloudProps {
  policy?: PolicyResponseDto | null;
}

export default function NetworkHospitalCloud({ policy }: NetworkHospitalCloudProps) {
  const hospitals = [
    { name: 'Columbia Asia Hospital', id: 2, isApex: false },
    { name: 'Apex Multi-Specialty Hospital', id: 1, isApex: true },
    { name: 'Manipal Hospitals', id: 3, isApex: false },
    { name: 'Fortis Healthcare', id: 4, isApex: false },
  ];

  return (
    <section className="mb-28 reveal stagger-3">
      <div className="text-center mb-16">
        <h3 className="font-headline-section-mobile md:font-headline-section text-on-surface uppercase tracking-tight font-bold">
          WHERE YOUR POLICY CONNECTS.
        </h3>
        <p className="font-body-xl text-lg md:text-xl text-on-surface-variant mt-4 max-w-3xl mx-auto leading-relaxed">
          Premium healthcare facilities within your direct billing network, mapped to your specific coverage tiers. Click any facility to inspect room matrix alignment.
        </p>
      </div>

      <div className="relative py-12">
        {/* Connecting Lines (Abstracted with borders) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-full h-px bg-primary absolute top-1/2 -translate-y-1/2" />
          <div className="w-px h-full bg-primary absolute left-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-6 md:gap-8 items-center max-w-5xl mx-auto">
          {hospitals.map((hosp) => {
            if (hosp.isApex) {
              return (
                <Link
                  key={hosp.id}
                  href={`/hospitals/${hosp.id}`}
                  className="px-10 py-8 bg-mint-surface rounded-full border-2 border-primary shadow-md transform scale-105 md:scale-110 z-20 transition-all hover:scale-115 hover:shadow-lg cursor-pointer group"
                >
                  <span className="font-title-lg text-lg md:text-2xl font-bold text-primary group-hover:underline">
                    {hosp.name}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={hosp.id}
                href={`/hospitals/${hosp.id}`}
                className="px-8 py-6 bg-surface-container-high hover:bg-surface-container rounded-full border border-outline-variant/20 hover:border-primary/40 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer group"
              >
                <span className="font-title-lg text-lg md:text-2xl text-on-surface group-hover:text-primary transition-colors">
                  {hosp.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
