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
      {/* Breadcrumb & SLA Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-on-surface-variant">
          <Link href="/client/jobs" className="hover:text-on-surface transition-colors">Client Workspace</Link>
          <span>/</span>
          <Link href={`/contracts/${contractId}`} className="hover:text-on-surface transition-colors">Contract #{contractAddress}</Link>
          <span>/</span>
          <span className="text-primary font-medium">Milestone 2 Review</span>
        </nav>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-low border border-outline-variant/30">
            <span className="material-symbols-outlined text-[15px] text-primary">lock_clock</span>
            <span className="text-on-surface-variant">Review Grace:</span>
            <span className="font-mono font-semibold text-primary">{graceHoursRemaining}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-low border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-on-surface">Arbitrum Safe</span>
            <span className="font-mono text-on-surface-variant">(2/3 Multi-Sig)</span>
          </div>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 shadow-sm">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono uppercase tracking-wider">
              Milestone 2 of 3
            </span>
            <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Pending Hirer Sign-off
            </span>
            <span className="font-mono text-on-surface-variant">Vault: 0x811a...ef34</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface font-mono">
            Milestone Deliverable Review &amp; Escrow Release
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Audit the verified cryptographic CI artifacts, test suites, and gas benchmarks. Executing the approval triggers on-chain multi-sig disbursement of locked milestone collateral.
          </p>
        </div>

        <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between gap-2 shrink-0 bg-surface-container p-3.5 rounded-xl border border-outline-variant/20">
          <div>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">Locked Collateral</span>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-bold text-on-surface">${amount.toLocaleString()}</span>
              <span className="text-xs font-bold text-primary">{currency}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px] text-primary">security</span> Arbitrum Synced
          </span>
        </div>
      </div>
    </div>
  );
};
