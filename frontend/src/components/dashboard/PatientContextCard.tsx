import { User, MapPin, Hospital, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStageLabel } from '@/lib/utils';
import type { DashboardSummary } from '@/lib/types';

interface PatientContextCardProps {
  data: DashboardSummary;
}

export function PatientContextCard({ data }: PatientContextCardProps) {
  const { patientName, patientAge, activeJourney, activePolicy } = data;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Patient identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 leading-snug">
                {patientName}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">Age {patientAge}</p>
            </div>
          </div>

          {/* Policy info */}
          {activePolicy ? (
            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <p className="text-sm text-slate-500">
                {activePolicy.insurerName ?? 'Unknown Insurer'}
                {activePolicy.policyType && (
                  <span className="text-slate-400"> · {activePolicy.policyType}</span>
                )}
              </p>
              <Badge variant={activePolicy.policyStatus === 'ACTIVE' ? 'active' : 'draft'}>
                {activePolicy.policyStatus === 'ACTIVE' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Active Policy
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    Draft Policy
                  </>
                )}
              </Badge>
            </div>
          ) : (
            <Badge variant="secondary">No active policy</Badge>
          )}
        </div>

        {/* Journey details */}
        {activeJourney && (
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <Hospital className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">
                  Hospital
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {activeJourney.hospitalName}
                </p>
                {activeJourney.hospitalLocation && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">
                      {activeJourney.hospitalLocation}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-4 h-4 mt-0.5 shrink-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">
                  Current Stage
                </p>
                <p className="text-sm font-semibold text-teal-700">
                  {getStageLabel(activeJourney.currentStage)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
