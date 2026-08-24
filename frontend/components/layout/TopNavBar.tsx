'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Policy', href: '/policy' },
  { label: 'Hospitals', href: '/hospitals' },
  { label: 'Care Journey', href: '/journey' },
];

export default function TopNavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 z-50 transition-all duration-300">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-page max-w-[1440px] mx-auto w-full h-full">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <span className="font-title-lg text-xl md:text-2xl font-bold tracking-tight text-primary">
            OSPAT Intelligence
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/dashboard' && pathname === '/') ||
              (item.href === '/hospitals' && pathname.startsWith('/hospitals/'));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-body-lg text-base md:text-lg h-full flex items-center transition-colors duration-300 relative pb-0.5 ${
                  isActive
                    ? 'text-primary font-semibold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Trailing Action & Patient Context */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
              Rajesh Verma (58y)
            </span>
          </div>

          <div className="w-8 h-8 rounded-full border border-outline-variant/40 flex items-center justify-center text-primary hover:bg-surface-container transition-colors cursor-pointer">
            <User className="w-4 h-4" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl border-b border-outline-variant/20 px-margin-mobile py-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="mb-3 pb-2 border-b border-outline-variant/20 flex items-center justify-between">
            <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">
              Rajesh Verma • 58y
            </span>
            <span className="font-label-caps text-[10px] bg-mint-surface text-primary px-2 py-0.5 rounded-full font-bold">
              Active: Recovery
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === '/dashboard' && pathname === '/') ||
                (item.href === '/hospitals' && pathname.startsWith('/hospitals/'));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-body-lg text-base flex items-center justify-between ${
                    isActive
                      ? 'bg-primary text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {item.label}
                  {isActive && <span className="text-xs">●</span>}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
