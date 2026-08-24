'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';

export default function GlobalFooter() {
  const [modalTitle, setModalTitle] = useState<string | null>(null);

  return (
    <>
      <footer className="bg-surface-container-low border-t border-outline-variant/20 py-8 mt-auto">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-headline-lg text-[16px] font-semibold text-primary leading-[24px]">
              OSPAT Intelligence
            </span>
            <p className="font-body-md text-[11px] font-normal text-on-surface-variant opacity-75 leading-[16px]">
              © 2024 OSPAT Intelligence. All rights reserved. Decision support only; not medical advice.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2" aria-label="Footer Navigation">
            <button
              onClick={() => setModalTitle('Privacy Policy')}
              className="font-body-md text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors leading-[16px]"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalTitle('Responsible Use')}
              className="font-body-md text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors leading-[16px]"
            >
              Responsible Use
            </button>
            <button
              onClick={() => setModalTitle('Terms of Service')}
              className="font-body-md text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors leading-[16px]"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setModalTitle('Contact Support')}
              className="font-body-md text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors leading-[16px]"
            >
              Contact Support
            </button>
          </nav>
        </div>
      </footer>

      {/* Info Dialog Modal */}
      {modalTitle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-lg w-full border border-border-subtle shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-subtle">
              <h3 className="font-headline-lg text-xl text-primary font-bold">{modalTitle}</h3>
              <button
                onClick={() => setModalTitle(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="text-body-md text-on-surface-variant space-y-3 text-sm max-h-[60vh] overflow-y-auto">
              {modalTitle === 'Privacy Policy' && (
                <>
                  <p>OSPAT Intelligence processes health insurance policy documents locally and securely. No personal medical information is sold, shared with third parties, or used for automated medical diagnosis.</p>
                  <p>All extracted parameters remain confidential and are used solely to generate patient decision support.</p>
                </>
              )}
              {modalTitle === 'Responsible Use' && (
                <>
                  <p><strong>Clinical & Legal Disclaimer:</strong></p>
                  <p>OSPAT Intelligence is strictly an informational decision-support and admission intelligence system. It does not provide clinical diagnoses, medical advice, or binding reimbursement guarantees.</p>
                  <p>All policy compatibility calculations are indicative based on user-provided policy data. Always verify cashless pre-authorization with the hospital TPA desk and your insurance provider.</p>
                </>
              )}
              {modalTitle === 'Terms of Service' && (
                <>
                  <p>By using OSPAT Intelligence, you acknowledge that calculations and room matrices are indicative estimates based on your uploaded policy schedule. Final billing and reimbursement are subject to individual insurer terms and hospital tariffs.</p>
                </>
              )}
              {modalTitle === 'Contact Support' && (
                <>
                  <p>Need assistance or have feedback on OSPAT Intelligence?</p>
                  <p className="font-medium text-primary">Email: support@ospat-intelligence.health</p>
                  <p className="font-medium text-primary">Emergency Helpdesk: +91 1800-OSPAT-CARE</p>
                </>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-border-subtle flex justify-end">
              <button
                onClick={() => setModalTitle(null)}
                className="bg-primary-container text-on-primary px-5 py-2 rounded-full text-sm font-medium hover:bg-primary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
