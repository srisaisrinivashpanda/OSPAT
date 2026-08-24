import React from 'react';

export default function WhyThisMatchesGrid() {
  const points = [
    {
      num: '01',
      title: 'In-Network Facility',
      desc: 'Fully covered under your primary health plan tier, ensuring zero out-of-network copay penalties.',
      highlight: false,
    },
    {
      num: '02',
      title: 'Private Room Availability',
      desc: 'Confirmed availability for single-occupancy recovery rooms matching your ₹5,000/day policy cap.',
      highlight: false,
    },
    {
      num: '03',
      title: 'Direct TPA Liaison',
      desc: 'On-site Star Health cashless desk facilitating fast-track 2-hour pre-authorization and final clearance.',
      highlight: false,
    },
    {
      num: '04',
      title: 'Specialty Coverage',
      desc: 'Tertiary cardiovascular and orthopedic infrastructure with 24x7 emergency surgical suites.',
      highlight: false,
    },
  ];

  return (
    <section className="mb-12 reveal stagger-2">
      <div className="border-b border-on-surface/30 pb-3 mb-6">
        <h3 className="font-headline-section text-xl md:text-2xl text-on-surface uppercase tracking-tight font-extrabold">
          WHY THIS MATCHES
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {points.map((pt, idx) => (
          <div key={idx} className="flex gap-5 group items-start">
            <div className="font-display-hero-mobile text-3xl md:text-4xl text-outline-variant/30 leading-none font-bold select-none group-hover:text-primary transition-colors flex-shrink-0">
              {pt.num}
            </div>
            <div>
              <h4
                className={`font-title-lg text-base md:text-lg font-bold mb-1 ${
                  pt.highlight ? 'text-tertiary' : 'text-on-surface'
                }`}
              >
                {pt.title}
              </h4>
              <p className="font-body-lg text-xs md:text-sm text-on-surface-variant leading-relaxed">
                {pt.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
