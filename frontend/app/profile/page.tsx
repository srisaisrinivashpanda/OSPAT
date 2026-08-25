'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/layout/TopNavBar';
import GlobalFooter from '@/components/layout/GlobalFooter';
import { api } from '@/lib/api/apiClient';
import { PolicyResponseDto } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const [policy, setPolicy] = useState<PolicyResponseDto | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [userProfile, setUserProfile] = useState<{ fullName: string; email: string; phone: string }>({
    fullName: 'Demo User',
    email: 'demo.patient@ospat-intelligence.health',
    phone: '+91 98765 43210',
  });

  const handleSignOut = () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      // 1. Remove all client-side OSPAT session keys specifically without wiping unrelated browser storage
      const OSPAT_STORAGE_KEYS = [
        'ospat_user_profile',
        'ospat_journey_intro_seen',
      ];
      OSPAT_STORAGE_KEYS.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch {
          // ignore
        }
      });

      // Also clean up any dynamic ospat_ prefixed keys
      if (typeof window !== 'undefined') {
        try {
          Object.keys(localStorage).forEach((k) => {
            if (k.startsWith('ospat_')) localStorage.removeItem(k);
          });
        } catch {
          // ignore
        }
        try {
          Object.keys(sessionStorage).forEach((k) => {
            if (k.startsWith('ospat_')) sessionStorage.removeItem(k);
          });
        } catch {
          // ignore
        }
      }

      // Reset client state
      setUserProfile({
        fullName: 'Demo User',
        email: 'demo.patient@ospat-intelligence.health',
        phone: '+91 98765 43210',
      });
    } catch (e) {
      console.warn('Error during client sign out cleanup:', e);
    } finally {
      // 2. Redirect to landing page /
      router.push('/');
    }
  };

  useEffect(() => {
    async function loadProfileData() {
      try {
        const saved = localStorage.getItem('ospat_user_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUserProfile({
            fullName: parsed.fullName || 'Demo User',
            email: parsed.email || 'demo.patient@ospat-intelligence.health',
            phone: parsed.phone || '+91 98765 43210',
          });
        }
        const activePol = await api.getActivePolicy(1);
        setPolicy(activePol);
      } catch (e) {
        console.warn('Failed to load profile policy data:', e);
      }
    }
    loadProfileData();
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-grow pt-8 pb-margin-desktop px-margin-mobile md:px-margin-desktop w-full mx-auto max-w-4xl">
        {/* Page Header */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="font-headline-lg text-2xl md:text-3xl text-primary mb-1 font-bold">
            Your profile
          </h1>
          <p className="text-secondary font-body-md text-sm md:text-base">
            Manage your account information, active coverage, and decision-support preferences.
          </p>
        </header>

        <div className="space-y-6">
          {/* Profile Information Section */}
          <section className="border-b border-outline-variant/30 pb-6">
            <h2 className="font-label-caps text-xs text-secondary mb-3 tracking-wider font-semibold">
              PROFILE
            </h2>
            <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 border border-border-subtle card-shadow">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-md">
                <span className="material-symbols-outlined text-4xl">person</span>
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold text-on-surface mb-1">
                  {userProfile.fullName || policy?.patientName || 'Demo User'}
                </h3>
                <div className="flex flex-col gap-1 text-sm text-secondary">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    <span>{userProfile.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section className="border-b border-outline-variant/30 pb-6">
            <h2 className="font-label-caps text-xs text-secondary mb-3 tracking-wider font-semibold">
              ACCOUNT & COVERAGE
            </h2>
            <div className="bg-surface-container-low rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border border-border-subtle card-shadow text-sm">
              <div className="flex flex-col">
                <span className="font-label-sm text-xs text-secondary mb-1">Account Status</span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-safe"></span>
                  <span className="font-semibold text-on-surface">Active Patient Profile</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs text-secondary mb-1">Primary Policy</span>
                <span className="font-semibold text-on-surface">
                  {policy ? `${policy.insurerName} (${policy.policyStatus})` : 'Star Health Family Optima'}
                </span>
              </div>
            </div>
          </section>

          {/* Privacy & Security Section */}
          <section className="border-b border-outline-variant/30 pb-6">
            <h2 className="font-label-caps text-xs text-secondary mb-3 tracking-wider font-semibold">
              PRIVACY & SECURITY
            </h2>
            <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-border-subtle card-shadow divide-y divide-border-subtle">
              <div className="flex items-center gap-4 p-4 hover:bg-surface transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">shield</span>
                </div>
                <div className="flex-grow">
                  <div className="font-semibold text-on-surface text-sm">Data Privacy</div>
                  <div className="text-xs text-secondary">
                    Your insurance schedules and identity documents remain private and are processed locally.
                  </div>
                </div>
                <span className="material-symbols-outlined text-status-safe text-sm">check_circle</span>
              </div>

              <div className="flex items-center gap-4 p-4 hover:bg-surface transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <div className="flex-grow">
                  <div className="font-semibold text-on-surface text-sm">Security Architecture</div>
                  <div className="text-xs text-secondary">
                    Deterministic calculation engine runs with strict validation bounds.
                  </div>
                </div>
                <span className="material-symbols-outlined text-status-safe text-sm">verified_user</span>
              </div>

              <div className="flex items-center gap-4 p-4 hover:bg-surface transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">gavel</span>
                </div>
                <div className="flex-grow">
                  <div className="font-semibold text-on-surface text-sm">Decision-Support Boundaries</div>
                  <div className="text-xs text-secondary">
                    OSPAT never provides medical diagnoses or binding reimbursement claims.
                  </div>
                </div>
                <span className="material-symbols-outlined text-status-safe text-sm">info</span>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="border-b border-outline-variant/30 pb-6">
            <h2 className="font-label-caps text-xs text-secondary mb-3 tracking-wider font-semibold">
              PREFERENCES
            </h2>
            <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-border-subtle card-shadow divide-y divide-border-subtle text-sm">
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium text-on-surface">Stage Guidance Alerts</div>
                  <div className="text-xs text-secondary">Receive reminders for TPA desk pre-authorization steps</div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    emailNotifications ? 'bg-primary text-white' : 'bg-surface border border-border-subtle text-secondary'
                  }`}
                >
                  {emailNotifications ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium text-on-surface">SMS Critical Room Alerts</div>
                  <div className="text-xs text-secondary">Notify if room upgrade triggers proportionate deduction warning</div>
                </div>
                <button
                  onClick={() => setSmsAlerts(!smsAlerts)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    smsAlerts ? 'bg-primary text-white' : 'bg-surface border border-border-subtle text-secondary'
                  }`}
                >
                  {smsAlerts ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </section>

          {/* Sign Out Section (Rule 10: Sign out belongs inside Profile) */}
          <section className="pt-2">
            <div className="bg-surface-container-low rounded-2xl p-6 border border-border-subtle card-shadow">
              <h2 className="font-label-caps text-xs text-secondary mb-2 tracking-wider font-semibold">
                SIGN OUT
              </h2>
              <p className="font-body-md text-secondary text-xs mb-4">
                Sign out of your OSPAT Intelligence session on this device.
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="px-6 py-2 border border-status-critical/40 text-status-critical rounded-full hover:bg-error-container/30 transition-colors font-label-sm text-xs font-semibold disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isSigningOut ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-status-critical border-t-transparent rounded-full animate-spin"></span>
                    <span>Signing out...</span>
                  </>
                ) : (
                  <span>Sign out</span>
                )}
              </button>
            </div>
          </section>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
