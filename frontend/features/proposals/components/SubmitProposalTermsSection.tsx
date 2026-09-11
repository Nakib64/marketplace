'use client';

import React from 'react';

interface SubmitProposalTermsSectionProps {
  bidAmount: number;
  onBidAmountChange: (val: number) => void;
  durationWeeks: number;
  onDurationChange: (weeks: number) => void;
  strategy: 'MILESTONE' | 'LUMP_SUM';
  onStrategyChange: (strategy: 'MILESTONE' | 'LUMP_SUM') => void;
  targetBudget?: number;
}

export const SubmitProposalTermsSection: React.FC<SubmitProposalTermsSectionProps> = ({
  bidAmount,
  onBidAmountChange,
  durationWeeks,
  onDurationChange,
  strategy,
  onStrategyChange,
  targetBudget = 8500,
}) => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5 pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center font-mono text-primary font-bold text-xs">
            01
          </span>
          <div>
            <h2 className="text-base font-bold text-on-surface">Proposal Terms &amp; Bid Parameters</h2>
            <p className="text-xs text-on-surface-variant">Specify settlement currency, total contract volume, and sprint horizon.</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded bg-surface-container font-mono text-xs text-primary">ERC-20 Settlement</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-on-surface flex items-center justify-between">
            <span>Proposed Total Compensation</span>
            <span className="font-mono text-[11px] text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {bidAmount === targetBudget ? 'Matching Target Budget' : `${bidAmount < targetBudget ? '-' : '+'}$${Math.abs(bidAmount - targetBudget)} vs. budget`}
            </span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-lg text-on-surface-variant font-bold">$</span>
            <input
              type="number"
              value={bidAmount || ''}
              onChange={(e) => onBidAmountChange(Number(e.target.value))}
              className="w-full bg-surface-container border border-outline-variant/30 pl-8 pr-20 py-2 rounded-lg font-mono text-lg font-bold text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
            <div className="absolute right-2 flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded text-xs text-on-surface font-mono">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>USDC</span>
            </div>
          </div>
          <span className="text-[11px] text-on-surface-variant">Total funds locked in client smart vault prior to milestone initiation.</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-on-surface flex items-center justify-between">
            <span>Estimated Contract Horizon</span>
            <span className="font-mono text-[11px] text-on-surface-variant">Suggested: 2-4 Weeks</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[2, 3, 4].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => onDurationChange(w)}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors border ${
                  durationWeeks === w
                    ? 'bg-surface-container-high border-primary text-primary shadow-sm'
                    : 'bg-surface-container border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {w} Weeks
              </button>
            ))}
          </div>
          <span className="text-[11px] text-on-surface-variant">Dispute cooldown grace triggers after +7 days overdue.</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Vault Locking Protocol Strategy</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => onStrategyChange('MILESTONE')}
            className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
              strategy === 'MILESTONE' ? 'bg-surface-container border-primary shadow-sm' : 'bg-surface-container/50 border-outline-variant/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">account_tree</span>
                <span className="text-xs font-bold text-on-surface">Milestone-Based Escrow</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[10px] font-bold">RECOMMENDED</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">Phased smart-contract releases upon on-chain cryptographic deliverable verification and multisig signoff.</p>
          </div>
          <div
            onClick={() => onStrategyChange('LUMP_SUM')}
            className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
              strategy === 'LUMP_SUM' ? 'bg-surface-container border-primary shadow-sm' : 'bg-surface-container/40 border-outline-variant/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">payments</span>
              <span className="text-xs font-bold text-on-surface">Single Lump Sum</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">100% full release on final mainnet deployment approval. Requires unified review.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
