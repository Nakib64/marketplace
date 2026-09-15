'use client';

import React from 'react';
import Link from 'next/link';

interface MilestoneReviewHeaderProps {
  contractId: string;
  contractAddress?: string;
  milestoneTitle?: string;
  amount?: number;
  currency?: string;
  graceHoursRemaining?: string;
}

export const MilestoneReviewHeader: React.FC<MilestoneReviewHeaderProps> = ({
  contractId,
  contractAddress = '0x71c8...39A1',
  amount = 3500,
  currency = 'USDC',
  graceHoursRemaining = '36h 14m Remaining',
}) => {
  return (
    <div className="flex flex-col gap-5 mb-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-on-surface-variant">
          <Link href="/client/jobs" className="hover:text-on-surface transition-colors">Workspace</Link>
          <span>/</span>
          <Link href={`/contracts/${contractId}`} className="hover:text-on-surface transition-colors">Contract</Link>
          <span>/</span>
          <span className="text-primary font-medium">Milestone Review</span>
        </nav>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-low border border-outline-variant/30">
            <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
            <span className="text-on-surface-variant">Review Window:</span>
            <span className=" font-semibold text-primary">{graceHoursRemaining}</span>
          </div>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 shadow-sm">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-medium">
              Milestone 2 of 3
            </span>
            <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Pending Review
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Milestone Review &amp; Payment Approval
          </h1>
        </div>

        <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between gap-2 shrink-0 bg-surface-container p-3.5 rounded-xl border border-outline-variant/20">
          <div>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">Protected Payment</span>
            <div className="flex items-baseline gap-1 ">
              <span className="text-2xl font-bold text-on-surface">${amount.toLocaleString()}</span>
              <span className="text-xs font-bold text-primary">{currency}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium">
            <span className="material-symbols-outlined text-[14px]">verified_user</span> Payment Protected
          </span>
        </div>
      </div>
    </div>
  );
};
