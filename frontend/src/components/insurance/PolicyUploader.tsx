'use client';

import { useRef, useState } from 'react';
import { Upload, CheckCircle, Loader2, AlertTriangle, FileText } from 'lucide-react';
import { uploadPolicy } from '@/lib/api/policyApi';
import type { ExtractedPolicy } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PolicyUploaderProps {
  patientId: number;
  onUploaded: (policy: ExtractedPolicy) => void;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

const PIPELINE_STEPS = [
  { id: 1, label: 'PDF uploaded' },
  { id: 2, label: 'Reading policy...' },
  { id: 3, label: 'Extracting information...' },
  { id: 4, label: 'Validating...' },
  { id: 5, label: 'Ready for review' },
];

export function PolicyUploader({ patientId, onUploaded }: PolicyUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (!file || file.type !== 'application/pdf') {
      setErrorMessage('Please upload a valid PDF file.');
      setUploadState('error');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25 MB limit.');
      setUploadState('error');
      return;
    }

    setSelectedFileName(file.name);
    setErrorMessage(null);
    setUploadState('uploading');

    try {
      const result = await uploadPolicy(file, patientId);
      setUploadState('success');
      // Small delay so user sees the "Ready for review" step complete
      setTimeout(() => onUploaded(result), 600);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Upload failed. Please try again.';
      setErrorMessage(msg);
      setUploadState('error');
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so the same file can be re-selected after an error
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function resetToIdle() {
    setUploadState('idle');
    setErrorMessage(null);
    setSelectedFileName(null);
  }

  // ── Pipeline progress display ────────────────────────────────
  if (uploadState === 'uploading' || uploadState === 'success') {
    const isSuccess = uploadState === 'success';

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-teal-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {selectedFileName ?? 'Policy document'}
            </p>
            <p className="text-xs text-slate-500">Processing your policy document</p>
          </div>
        </div>

        <div className="space-y-3">
          {PIPELINE_STEPS.map((step) => {
            // Step 1 is immediately done once we start uploading
            const isDone = isSuccess
              ? true
              : step.id === 1;
            const isInProgress = !isSuccess && step.id > 1;

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  ) : isInProgress ? (
                    <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm',
                    isDone
                      ? 'text-teal-700 font-medium'
                      : isInProgress
                      ? 'text-slate-600'
                      : 'text-slate-400',
                  )}
                >
                  {step.id === 5 && isSuccess ? 'Ready for review ✓' : step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────
  if (uploadState === 'error') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-800">Upload failed</p>
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        </div>
        <button
          onClick={resetToIdle}
          className="text-sm font-medium text-red-700 underline-offset-4 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Idle drop zone ───────────────────────────────────────────
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload insurance policy PDF"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'min-h-[200px] rounded-xl border-2 border-dashed cursor-pointer',
        'flex flex-col items-center justify-center gap-3 p-8 text-center',
        'transition-colors duration-150',
        isDragOver
          ? 'border-teal-400 bg-teal-50'
          : 'border-slate-300 bg-white hover:border-teal-300 hover:bg-slate-50',
      )}
    >
      <div
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center transition-colors',
          isDragOver ? 'bg-teal-100' : 'bg-slate-100',
        )}
      >
        <Upload
          className={cn(
            'w-7 h-7 transition-colors',
            isDragOver ? 'text-teal-600' : 'text-slate-400',
          )}
        />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-700">
          Upload your insurance policy
        </p>
        <p className="text-sm text-slate-500">
          Drag and drop here, or{' '}
          <span className="text-teal-600 font-medium">click to browse</span>
        </p>
        <p className="text-xs text-slate-400 pt-1">PDF documents, up to 25 MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="sr-only"
        onChange={handleFileChange}
        aria-hidden
      />
    </div>
  );
}
