'use client';

import React from 'react';
import Link from 'next/link';

interface ProposalHeaderTelemetryProps {
  jobId: string;
  jobTitle?: string;
  totalProposals?: number;
  shortlistedCount?: number;
  budget?: number;
}

export const ProposalHeaderTelemetry: React.FC<ProposalHeaderTelemetryProps> = ({
  jobId,
  jobTitle = 'Arbitrum Stylus Rust AMM DEX V2',
  totalProposals = 14,
  shortlistedCount = 3,
  budget = 15000,
}) => {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {/* Breadcrumb Hierarchy */}
      <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium flex-wrap">
        <Link href="/client/jobs" className="hover:text-on-surface transition-colors">Client Workspace</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href="/client/jobs" className="hover:text-on-surface transition-colors">My Job RFPs</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-mono text-on-surface truncate max-w-xs">
          {jobTitle} (#{jobId.slice(0, 8)})
        </span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary font-medium">Review Proposals</span>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mt-1">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface">
              Candidate Proposals &amp; Bid Matrix
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono text-xs border border-outline-variant/30">
              v2.4 Contract
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1 max-w-4xl">
            Evaluate on-chain verifiable credentials, algorithmic invariant test scores, milestone schedules, and multi-sig escrow bids.
          </p>
        </div>

        {/* Telemetry Pill Indicators */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-container-low border border-outline-variant/30 p-1.5 rounded-xl">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-xs text-on-surface font-medium">{totalProposals} Total Proposals</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="text-xs text-on-surface font-medium">{shortlistedCount} Shortlisted</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container">
            <span className="font-mono text-xs text-on-surface-variant">Escrow:</span>
            <span className="font-mono text-xs text-on-surface font-semibold">${budget.toLocaleString()} USDC</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-primary">security</span>
            <span className="text-xs text-on-surface">Arbitrum One Vault</span>
          </div>
        </div>
      </div>
    </div>
  );
};
