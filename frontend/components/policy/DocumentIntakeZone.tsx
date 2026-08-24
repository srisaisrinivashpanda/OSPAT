'use client';

import React, { useState, useRef } from 'react';
import { Loader2, AlertTriangle, FileText } from 'lucide-react';
import { uploadPolicyPdf, fetchSamplePdfBlob } from '@/lib/api/apiClient';
import { ExtractedPolicyDto } from '@/lib/types';

interface DocumentIntakeZoneProps {
  onExtractionComplete: (extracted: ExtractedPolicyDto) => void;
}

export default function DocumentIntakeZone({ onExtractionComplete }: DocumentIntakeZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please provide an insurance policy PDF schedule.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadStatus('Extracting text layers via Apache PDFBox...');

    try {
      setTimeout(() => setUploadStatus('Synthesizing structured policy parameters with AI engine...'), 800);
      const extracted = await uploadPolicyPdf(file, 1);
      setUploadStatus('Extraction complete. Ready for verification.');
      onExtractionComplete(extracted);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error extracting policy PDF.';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSampleSelect = async (type: 'star' | 'hdfc' | 'care') => {
    setIsUploading(true);
    setError(null);
    setUploadStatus(`Loading synthetic ${type.toUpperCase()} health insurance schedule...`);

    try {
      const blob = await fetchSamplePdfBlob(type);
      const fileName = `${type}_health_sample_schedule.pdf`;
      const file = new File([blob], fileName, { type: 'application/pdf' });
      await handleFileUpload(file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error downloading sample document.';
      setError(msg);
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <section className="mb-20 md:mb-24 reveal stagger-1 w-full">
      {/* Immersive Upload Section matching Stitch Picture 2 */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-[28px] md:rounded-[36px] p-12 md:py-28 md:px-20 flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-500 border ${
          isDragging
            ? 'bg-mint-surface border-primary scale-[1.01]'
            : 'border-primary/15 shadow-sm hover:shadow-md'
        }`}
      >
        {/* Background Medical Frosted Image matching Stitch */}
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full opacity-40 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPLoC9FvNXhnbA3nE9fIDA-s7T2a9tL3ugw4EaAIIv-3CVtppgow0x0RcVIzYbDfhAw9lrI1jA9n1H-ifTUu7-_LcJORyH9BuY9WdErehRd1DWon8GXbaSxHwIxALu71VTEZ-GrFnm8eoRzjSk7lhim2Nlzdnv0ftKOcdNAqWjLvQm0JEuDBWbe1-I3DjgVyJDDANBi3gG10vJiqMH5IH1OHgvPc5gzzM9wIJrtm2apJDdzxgo6OxE')",
          }}
        />

        {/* Mint backdrop wash */}
        <div className="absolute inset-0 bg-mint-surface/75 backdrop-blur-md pointer-events-none" />

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        {/* Scanner Icon */}
        <div className="relative z-10 bg-surface p-5 md:p-6 rounded-full shadow-md mb-6 text-primary group-hover:scale-105 transition-transform duration-700 ease-out">
          {isUploading ? (
            <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-primary" />
          ) : (
            <span className="material-symbols-outlined text-[40px] md:text-[48px]">document_scanner</span>
          )}
        </div>

        {/* Faint Eyebrow */}
        <span className="relative z-10 font-label-caps text-xs md:text-sm text-primary/70 tracking-[0.25em] uppercase mb-3 block font-bold">
          PREMIUM HEALTHCARE INTELLIGENCE
        </span>

        {/* Title */}
        <h2 className="relative z-10 font-headline-section text-3xl md:text-5xl font-bold text-on-surface mb-4">
          {isUploading ? 'Extracting Intelligence...' : 'Extract Intelligence'}
        </h2>

        {/* Subtitle */}
        <p className="relative z-10 font-body-xl text-base md:text-xl text-on-surface-variant/90 max-w-2xl mx-auto leading-relaxed">
          {uploadStatus ||
            'Drag and drop your insurance PDF to instantly extract clinical insights, hospital network coverage, and definitive coverage limits.'}
        </p>

        {error && (
          <div className="relative z-10 mt-6 flex items-center gap-2 text-tertiary bg-surface p-3 px-6 rounded-full border border-tertiary/30 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Select Document Button */}
        <button
          type="button"
          disabled={isUploading}
          className="relative z-10 mt-10 px-10 py-4.5 bg-primary text-on-primary rounded-full font-body-lg text-base md:text-lg font-semibold hover:bg-primary-container transition-all shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer"
        >
          {isUploading ? 'Processing...' : 'Select Document'}
        </button>
      </div>

      {/* Quick Test Samples Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-bold">
            Quick Test Samples:
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSampleSelect('star');
            }}
            disabled={isUploading}
            className="px-4 py-2 rounded-full bg-surface border border-outline-variant/40 hover:border-primary text-xs font-label-caps text-on-surface hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
          >
            Star Health Optima (₹5L)
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSampleSelect('hdfc');
            }}
            disabled={isUploading}
            className="px-4 py-2 rounded-full bg-surface border border-outline-variant/40 hover:border-primary text-xs font-label-caps text-on-surface hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
          >
            HDFC Ergo Restore (₹10L)
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSampleSelect('care');
            }}
            disabled={isUploading}
            className="px-4 py-2 rounded-full bg-surface border border-outline-variant/40 hover:border-primary text-xs font-label-caps text-on-surface hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
          >
            Care Advantage (₹7.5L)
          </button>
        </div>
      </div>
    </section>
  );
}
