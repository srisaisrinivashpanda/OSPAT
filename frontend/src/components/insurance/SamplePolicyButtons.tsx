'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSamplePdf } from '@/lib/api/policyApi';
import type { SamplePdfType } from '@/lib/types';

const SAMPLE_POLICIES: { label: string; type: SamplePdfType; filename: string }[] = [
  { label: 'Star Health', type: 'star', filename: 'star-health-sample.pdf' },
  { label: 'HDFC ERGO', type: 'hdfc', filename: 'hdfc-ergo-sample.pdf' },
  { label: 'Care Health', type: 'care', filename: 'care-health-sample.pdf' },
];

export function SamplePolicyButtons() {
  const [downloading, setDownloading] = useState<SamplePdfType | null>(null);

  async function handleDownload(type: SamplePdfType, filename: string) {
    if (downloading) return;
    setDownloading(type);
    try {
      const blob = await getSamplePdf(type);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download sample PDF', err);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        Try a sample policy
      </p>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_POLICIES.map(({ label, type, filename }) => {
          const isLoading = downloading === type;
          return (
            <Button
              key={type}
              variant="outline"
              size="sm"
              disabled={downloading !== null}
              onClick={() => handleDownload(type, filename)}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
