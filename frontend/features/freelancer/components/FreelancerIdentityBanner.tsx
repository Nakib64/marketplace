'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';

export const FreelancerIdentityBanner: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.name || user?.email?.split('@')[0] || 'Alex Rivera';

  return (
    <div className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 lg:p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant/40 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-[24px]">terminal</span>
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-primary ring-2 ring-surface-container-low" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold text-on-surface tracking-tight">
              Welcome back, <span className="capitalize">{displayName}</span>
            </h1>
            <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/30">
              alexr.eth
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant font-medium">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Full-Time Available
            </span>
            <span className="text-outline-variant">•</span>
            <span>UTC-4</span>
            <span className="text-outline-variant">•</span>
            <span className="inline-flex items-center gap-1 text-on-surface">
              <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
              Level 4 Builder (Soulbound #0418)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-stretch lg:self-auto shrink-0">
        <Link
          href="/jobs"
          className="flex-1 lg:flex-initial px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">explore</span>
          <span>Browse Open Gigs</span>
        </Link>
        <button
          type="button"
          onClick={() => alert('Select a live contract to upload deliverable artifact.')}
          className="flex-1 lg:flex-initial px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          <span>Submit Deliverable</span>
        </button>
      </div>
    </div>
  );
};
