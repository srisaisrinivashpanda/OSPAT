import Link from 'next/link';
import { Shield, Building2, Route, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ActionItem {
  href: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

const ACTIONS: ActionItem[] = [
  {
    href: '/insurance',
    icon: Shield,
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    title: 'Review Insurance Policy',
    description: 'View coverage details and policy constraints',
  },
  {
    href: '/hospitals',
    icon: Building2,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    title: 'Find Compatible Hospitals',
    description: 'Match hospitals to your policy coverage',
  },
  {
    href: '/journey/1',
    icon: Route,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    title: 'View Care Journey',
    description: 'Track stages and get stage-specific guidance',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-5 space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Quick Actions
        </h3>
        {ACTIONS.map(({ href, icon: Icon, iconColor, iconBg, title, description }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all group cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 leading-snug truncate">{title}</p>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5 truncate">
                {description}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
