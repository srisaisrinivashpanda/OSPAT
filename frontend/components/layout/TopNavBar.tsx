'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import HelpModal from '../common/HelpModal';

export default function TopNavBar() {
  const pathname = usePathname();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const isInsuranceActive = pathname === '/insurance' || pathname === '/policy';
  const isHospitalsActive = pathname?.startsWith('/hospitals');
  const isJourneyActive = pathname === '/journey';

  return (
    <>
      <header className="bg-surface-container-lowest border-b border-border-subtle sticky top-0 z-50 h-[60px]">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-full flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NextLink
              href="/"
              className="text-[18px] font-semibold font-headline-lg text-primary tracking-tight leading-[24px] whitespace-nowrap hover:opacity-90 transition-opacity"
            >
              OSPAT Intelligence
            </NextLink>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 h-full">
            <NextLink
              href="/insurance"
              className={`text-[14px] font-body-md leading-[20px] transition-colors flex items-center h-full ${
                isInsuranceActive
                  ? 'text-primary font-medium border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Insurance
            </NextLink>
            <NextLink
              href="/hospitals"
              className={`text-[14px] font-body-md leading-[20px] transition-colors flex items-center h-full ${
                isHospitalsActive
                  ? 'text-primary font-medium border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Hospitals
            </NextLink>
            <NextLink
              href="/journey"
              className={`text-[14px] font-body-md leading-[20px] transition-colors flex items-center h-full ${
                isJourneyActive
                  ? 'text-primary font-medium border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Care Journey
            </NextLink>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <div className="h-6 w-px bg-border-subtle hidden sm:block"></div>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="px-4 py-1.5 border border-border-subtle rounded-full text-[12px] font-medium font-body-md text-on-surface-variant hover:bg-surface-container transition-colors"
              type="button"
            >
              Get Help
            </button>
            <NextLink
              href="/profile"
              aria-label="User Profile"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </NextLink>
          </div>
        </div>
      </header>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
