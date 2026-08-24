import React from 'react';
import { RoomEvaluationDto } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils/formatters';

interface RoomMatrixTableProps {
  evaluations?: RoomEvaluationDto[];
  policyLimit?: number;
}

export default function RoomMatrixTable({
  evaluations = [],
  policyLimit = 5000,
}: RoomMatrixTableProps) {
  const defaultEvaluations: RoomEvaluationDto[] = [
    {
      roomId: 1,
      roomName: 'General Sharing Ward (4-Bed)',
      dailyCost: 1800,
      policyLimit: 5000,
      costDifference: -3200,
      withinPolicyLimit: true,
      available: true,
      compatibilityStatus: 'WITHIN_STATED_LIMIT',
      advisoryNote: 'Fully covered within stated policy limit of ₹5,000/day. ₹3,200 headroom available.',
    },
    {
      roomId: 2,
      roomName: 'Semi-Private Room (Twin Sharing)',
      dailyCost: 3800,
      policyLimit: 5000,
      costDifference: -1200,
      withinPolicyLimit: true,
      available: true,
      compatibilityStatus: 'WITHIN_STATED_LIMIT',
      advisoryNote: 'Fully covered. Stated daily room rent is within policy limit. ₹1,200 headroom.',
    },
    {
      roomId: 3,
      roomName: 'Single Private Deluxe AC',
      dailyCost: 6500,
      policyLimit: 5000,
      costDifference: 1500,
      withinPolicyLimit: false,
      available: true,
      compatibilityStatus: 'POLICY_CONSIDERATION',
      advisoryNote: 'Exceeds stated limit by ₹1,500/day. Differential room rent is typically an out-of-pocket expense.',
    },
    {
      roomId: 4,
      roomName: 'Super Deluxe Suite',
      dailyCost: 12500,
      policyLimit: 5000,
      costDifference: 7500,
      withinPolicyLimit: false,
      available: true,
      compatibilityStatus: 'EXCEEDS_STATED_LIMIT',
      advisoryNote: 'Exceeds limit by ₹7,500/day (>40%). Proportionate deductions may apply across doctor, nursing & OT charges.',
    },
    {
      roomId: 5,
      roomName: 'Intensive Care Unit (ICU)',
      dailyCost: 11000,
      policyLimit: 5000,
      costDifference: 6000,
      withinPolicyLimit: false,
      available: true,
      compatibilityStatus: 'POLICY_CONSIDERATION',
      advisoryNote: 'Critical care ICU charges are adjudicated under specialized procedural limits per policy terms.',
    },
  ];

  const items = evaluations.length > 0 ? evaluations : defaultEvaluations;

  return (
    <div className="overflow-x-auto my-4">
      <div className="min-w-[700px] border-t border-outline-variant/30">
        <div className="grid grid-cols-12 gap-4 py-3 border-b border-outline-variant/20 font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-bold">
          <div className="col-span-4">Room Category Tier</div>
          <div className="col-span-2 text-right">Published Rate</div>
          <div className="col-span-2 text-right">Policy Limit</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Headroom / Excess</div>
        </div>

        <div className="divide-y divide-outline-variant/20">
          {items.map((room, idx) => {
            const isCovered = room.compatibilityStatus === 'WITHIN_STATED_LIMIT';
            const isExcess = room.compatibilityStatus === 'EXCEEDS_STATED_LIMIT';

            return (
              <div
                key={idx}
                className="grid grid-cols-12 gap-4 py-4 items-center hover:bg-surface-container-low/50 transition-colors"
              >
                <div className="col-span-4">
                  <h5 className="font-title-lg text-base font-bold text-on-surface mb-0.5">
                    {room.roomName}
                  </h5>
                  <p className="font-body-lg text-xs text-on-surface-variant leading-relaxed">
                    {room.advisoryNote}
                  </p>
                </div>

                <div className="col-span-2 text-right font-body-lg text-sm font-bold text-on-surface">
                  {formatCurrency(room.dailyCost)}
                  <span className="text-xs font-normal text-on-surface-variant">/day</span>
                </div>

                <div className="col-span-2 text-right font-body-lg text-xs text-on-surface-variant">
                  {formatCurrency(room.policyLimit || policyLimit)}
                  <span className="text-xs">/day</span>
                </div>

                <div className="col-span-2 flex justify-center">
                  <StatusBadge status={room.compatibilityStatus} size="sm" />
                </div>

                <div className="col-span-2 text-right">
                  {room.costDifference <= 0 ? (
                    <span className="text-primary font-bold text-xs">
                      +{formatCurrency(Math.abs(room.costDifference))} (Covered)
                    </span>
                  ) : (
                    <span className={isExcess ? 'text-tertiary font-bold text-xs' : 'text-amber-accent font-bold text-xs'}>
                      +{formatCurrency(room.costDifference)}/day excess
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
