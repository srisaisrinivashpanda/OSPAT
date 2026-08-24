'use client';

import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl border border-border-subtle w-full max-w-lg relative z-10 overflow-hidden p-6 md:p-8">
        <div className="flex justify-between items-center pb-4 border-b border-border-subtle mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">help</span>
            </div>
            <div>
              <h3 className="font-headline-lg text-xl text-primary font-bold">Caregiver Support</h3>
              <p className="font-label-sm text-on-surface-variant">OSPAT Admission Assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4 text-on-surface text-sm">
          <div className="bg-surface p-4 rounded-xl border border-border-subtle">
            <h4 className="font-semibold text-primary mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-status-safe text-[18px]">verified</span>
              How to Use OSPAT
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-on-surface-variant text-xs">
              <li><strong>Upload Policy:</strong> Upload your health insurance schedule PDF on the Insurance page.</li>
              <li><strong>Compare Hospitals:</strong> Check deterministic compatibility scores (0-100) and in-network status.</li>
              <li><strong>Inspect Room Matrix:</strong> Verify that your room category is within the stated policy cap to avoid proportionate deductions.</li>
              <li><strong>Track Care Journey:</strong> Follow the 4-stage checklist at the hospital TPA desk.</li>
            </ol>
          </div>

          <div className="bg-status-warning/10 p-4 rounded-xl border border-status-warning/30">
            <h4 className="font-semibold text-status-warning mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              Key TPA Desk Checklist
            </h4>
            <p className="text-xs text-on-surface-variant">
              Always request initial cashless pre-authorization 48 hours in advance for planned procedures, or within 24 hours for emergency admissions.
            </p>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-border-subtle flex justify-between items-center">
            <div>
              <p className="font-semibold text-primary text-xs">Hospital TPA Emergency Desk</p>
              <p className="text-on-surface-variant text-xs">+91 1800-425-2255 (24x7 Toll-Free)</p>
            </div>
            <a
              href="tel:18004252255"
              className="bg-primary text-on-primary px-3 py-1.5 rounded-full text-xs font-medium hover:bg-primary-container transition-colors"
            >
              Call TPA
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="bg-primary-container text-on-primary px-6 py-2 rounded-full text-sm font-medium hover:bg-primary transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
