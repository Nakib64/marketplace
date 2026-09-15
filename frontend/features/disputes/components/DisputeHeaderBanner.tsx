'use client';

import React from 'react';
import Link from 'next/link';

interface DisputeHeaderBannerProps {
  onInitiateDispute: () => void;
}

export const DisputeHeaderBanner: React.FC<DisputeHeaderBannerProps> = ({ onInitiateDispute }) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-xs text-on-surface-variant font-medium">
        <Link href="/client/jobs" className="hover:text-on-surface transition-colors">Workspace</Link>
        <span>/</span>
        <span>Support</span>
        <span>/</span>
        <span className="text-on-surface font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Resolution Center
        </span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container rounded-xl p-5 border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="flex items-center gap-1 text-primary font-medium">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              Resolution Support Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">
            Resolution &amp; Support Center
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
          <button
            type="button"
            onClick={onInitiateDispute}
            className="px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">shield</span>
            <span>Open Resolution Case</span>
          </button>
        </div>
      </div>
    </div>
  );
};
