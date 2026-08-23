import { Shield, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, getStageLabel } from '@/lib/utils';
import type { StageGuidance } from '@/lib/types';

interface StageIntelligenceCardProps {
  guidance: StageGuidance;
  className?: string;
}

interface SectionProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  items: string[];
  bulletColor: string;
}

function Section({ icon: Icon, iconColor, iconBg, title, items, bulletColor }: SectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-3.5 h-3.5', iconColor)} />
        </div>
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      </div>
      <ul className="space-y-1.5 pl-8">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
            <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', bulletColor)} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StageIntelligenceCard({ guidance, className }: StageIntelligenceCardProps) {
  const {
    stage,
    stageTitle,
    description,
    insuranceInsights,
    potentialConstraints,
    requiredDocuments,
    disclaimer,
  } = guidance;

  const hasSections =
    insuranceInsights.length > 0 ||
    potentialConstraints.length > 0 ||
    requiredDocuments.length > 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Badge variant="default">{getStageLabel(stage)}</Badge>
        </div>
        <CardTitle className="text-base leading-snug">{stageTitle}</CardTitle>
        <p className="text-sm text-slate-500 leading-relaxed mt-1">{description}</p>
      </CardHeader>

      {hasSections && (
        <CardContent className="space-y-5 pt-0">
          <div className="border-t border-slate-100 pt-4 space-y-5">
            <Section
              icon={Shield}
              iconColor="text-teal-600"
              iconBg="bg-teal-50"
              title="Policy Insights"
              items={insuranceInsights}
              bulletColor="bg-teal-400"
            />

            <Section
              icon={AlertTriangle}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
              title="Potential Constraints"
              items={potentialConstraints}
              bulletColor="bg-amber-400"
            />

            <Section
              icon={FileText}
              iconColor="text-slate-600"
              iconBg="bg-slate-100"
              title="Required Documents"
              items={requiredDocuments}
              bulletColor="bg-slate-400"
            />
          </div>

          {disclaimer && (
            <p className="text-xs italic text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
              {disclaimer}
            </p>
          )}
        </CardContent>
      )}

      {!hasSections && disclaimer && (
        <CardContent className="pt-0">
          <p className="text-xs italic text-slate-400 leading-relaxed">{disclaimer}</p>
        </CardContent>
      )}
    </Card>
  );
}
