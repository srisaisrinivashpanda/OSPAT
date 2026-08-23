import type { RoomEvaluation } from '@/lib/types';
import { formatCurrency, getCompatibilityStatusLabel, getCompatibilityStatusColor, cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface RoomComparisonTableProps {
  roomEvaluations: RoomEvaluation[];
  policyRoomLimit: number | null;
}

export function RoomComparisonTable({ roomEvaluations, policyRoomLimit }: RoomComparisonTableProps) {
  if (roomEvaluations.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">No room evaluation data available.</p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Policy limit callout */}
      {policyRoomLimit != null && (
        <div className="flex items-center gap-2 text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            Policy room limit:{' '}
            <span className="font-semibold">{formatCurrency(policyRoomLimit)}/day</span>
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                Room Category
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                Daily Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                Policy Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Advisory Note
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roomEvaluations.map((room) => (
              <tr key={room.roomId} className="hover:bg-slate-50 transition-colors">
                {/* Room name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700 font-medium">{room.roomName}</span>
                    {!room.available && (
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                        Unavailable
                      </span>
                    )}
                  </div>
                </td>

                {/* Daily cost */}
                <td className="px-4 py-3 text-right tabular-nums text-slate-700 font-medium whitespace-nowrap">
                  {formatCurrency(room.dailyCost)}
                  <span className="text-xs text-slate-400 font-normal">/day</span>
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
                      getCompatibilityStatusColor(room.compatibilityStatus),
                    )}
                  >
                    {getCompatibilityStatusLabel(room.compatibilityStatus)}
                  </span>
                </td>

                {/* Advisory note */}
                <td className="px-4 py-3">
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    {room.advisoryNote || '—'}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 italic flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        Room rates are indicative. Verify final costs with the hospital.
      </p>
    </div>
  );
}
