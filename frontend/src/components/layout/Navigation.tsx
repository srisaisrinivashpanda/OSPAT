'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  Building2,
  Route,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/insurance', label: 'Insurance', icon: Shield },
  { href: '/hospitals', label: 'Hospitals', icon: Building2 },
  { href: '/journey/1', label: 'Care Journey', icon: Route },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    if (href === '/journey/1') return pathname.startsWith('/journey');
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
              <Activity className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div className="text-base font-bold text-slate-900 tracking-tight">
                OSPAT
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Healthcare Intelligence
              </div>
            </div>
          </Link>

          {/* Primary nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(href)
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                )}
                aria-current={isActive(href) ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Patient badge */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-xs font-medium text-slate-600">Patient ID: 1</span>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav
          className="flex md:hidden items-center gap-1 pb-2 overflow-x-auto"
          aria-label="Mobile navigation"
        >
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                isActive(href)
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
