'use client';

import React from 'react';

interface MilestoneContributorCardProps {
  scopeTitle?: string;
  amount?: number;
  currency?: string;
  contributorName?: string;
  contributorEns?: string;
  contributorRole?: string;
  successRate?: string;
  submittedAgo?: string;
  commitHash?: string;
  onCopyHash?: (hash: string) => void;
}

export const MilestoneContributorCard: React.FC<MilestoneContributorCardProps> = ({
  scopeTitle = 'Foundry Fuzz Testing & Slither CI Pipeline',
  amount = 3500,
  currency = 'USDC',
  contributorName = 'Alex Rivera',
  contributorEns = 'alexr.eth',
  contributorRole = 'Tier 4 Smart Contract Engineer',
  successRate = '99.4%',
  submittedAgo = '8 hours ago',
  commitHash = '0x9a3e7912b4ca927ef1a4c9b8849c95d9e0394f18',
  onCopyHash,
}) => {
  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/20">
        <div>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Milestone Scope Definition</span>
          <h2 className="text-base font-bold text-on-surface mt-0.5">{scopeTitle}</h2>
        </div>
        <div className="text-left sm:text-right font-mono">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">Escrowed Value</span>
          <span className="text-xs font-bold text-on-surface">${amount.toLocaleString()} {currency} (100% Funded)</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center relative font-bold text-sm text-primary">
            AR
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-surface-container-low" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-on-surface">{contributorName}</span>
              <span className="material-symbols-outlined text-[14px] text-primary" title="Verified Contributor">verified</span>
              <span className="font-mono text-[11px] text-on-surface-variant">({contributorEns})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant mt-0.5">
              <span>{contributorRole}</span>
              <span>•</span>
              <span className="text-primary font-medium">{successRate} Success</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end text-xs font-mono">
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span>Submitted:</span>
            <span className="text-on-surface font-medium">{submittedAgo}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-on-surface-variant">Hash:</span>
            <button
              type="button"
              onClick={() => onCopyHash?.(commitHash)}
              className="text-primary hover:underline flex items-center gap-0.5 text-[11px]"
            >
              <span>{commitHash.slice(0, 8)}...{commitHash.slice(-4)}</span>
              <span className="material-symbols-outlined text-[13px]">content_copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
