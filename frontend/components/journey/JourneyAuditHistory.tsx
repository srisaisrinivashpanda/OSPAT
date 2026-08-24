import React from 'react';
import { JourneyEventDto } from '@/lib/types';
import { formatDate } from '@/lib/utils/formatters';
import { Clock } from 'lucide-react';

interface JourneyAuditHistoryProps {
  events?: JourneyEventDto[];
}

export default function JourneyAuditHistory({ events = [] }: JourneyAuditHistoryProps) {
  const defaultEvents: JourneyEventDto[] = [
    {
      stage: 'ADMISSION',
      description: 'Patient checked in at Apex Multi-Specialty Hospital TPA Cashless Desk. Policy verified.',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      stage: 'ADMISSION',
      description: 'Pre-authorization request of INR 45,000 submitted to Star Health Allied Insurance.',
      timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
    {
      stage: 'INVESTIGATION',
      description: 'Cardiology diagnostic workup and angiogram completed.',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      stage: 'PROCEDURE',
      description: 'Therapeutic intervention performed in Cath Lab 2. Patient stabilized.',
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      stage: 'RECOVERY',
      description: 'Patient transferred to Post-Op Deluxe recovery ward. Discharge planning initiated.',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  return (
    <section className="mb-10 md:mb-12 reveal stagger-4">
      <div className="border-b border-on-surface/30 pb-2 mb-4">
        <h3 className="font-headline-section-mobile text-lg md:text-xl font-bold text-on-surface uppercase tracking-tight">
          CARE JOURNEY AUDIT LOG
        </h3>
      </div>

      <div className="relative pl-6 border-l-2 border-primary/30 space-y-4">
        {items.map((evt, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-surface" />

            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="font-label-caps text-[10px] bg-mint-surface text-primary px-2 py-0.5 rounded-full font-bold">
                {evt.stage}
              </span>
              <span className="text-xs text-on-surface-variant/60 flex items-center gap-1 font-body-lg">
                <Clock className="w-3 h-3" />
                {formatDate(evt.timestamp)}
              </span>
            </div>

            <p className="font-body-lg text-sm text-on-surface leading-relaxed">
              {evt.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
