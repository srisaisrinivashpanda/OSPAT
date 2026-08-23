import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AlertsCardProps {
  alerts: string[];
  actions: string[];
}

export function AlertsCard({ alerts, actions }: AlertsCardProps) {
  if (alerts.length === 0 && actions.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        {alerts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Considerations
            </h3>
            <ul className="space-y-2">
              {alerts.map((alert, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{alert}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {alerts.length > 0 && actions.length > 0 && (
          <div className="border-t border-slate-100" />
        )}

        {actions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Suggested Next Steps
            </h3>
            <ul className="space-y-2">
              {actions.map((action, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3 h-3 text-teal-600" />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{action}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
