'use client';

import React from 'react';

interface SubmitProposalSidebarProps {
  bidAmount: number;
  agreedToArbitration: boolean;
  onToggleArbitration: () => void;
  clientName?: string;
}

export const SubmitProposalSidebar: React.FC<SubmitProposalSidebarProps> = ({
  bidAmount,
  agreedToArbitration,
  onToggleArbitration,
  clientName = 'Kroma Labs DAO',
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Client On-Chain Profile */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Client Profile</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-mono text-[10px] flex items-center gap-1 border border-outline-variant/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Verified Hirer
          </span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm">
            {clientName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-bold text-on-surface block">{clientName}</span>
            <span className="font-mono text-[11px] text-on-surface-variant">0x3C49...81B7</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase block">Escrow History</span>
            <span className="font-bold text-on-surface">100%</span>
            <span className="text-[10px] text-primary block">Fully Funded</span>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase block">Settled Jobs</span>
            <span className="font-bold text-on-surface">14</span>
            <span className="text-[10px] text-on-surface-variant block">0 Disputes</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant/20 text-xs text-on-surface-variant flex items-start gap-2">
          <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">shield</span>
          <p className="leading-relaxed text-[11px]">100% of funds are immediately locked into the decentralized escrow contract before you initiate work.</p>
        </div>
      </div>

      {/* Financial Breakdown & Protocol Fee Transparency */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-on-surface mb-3">Financial &amp; Gas Economics</h3>
        <div className="space-y-2 font-mono text-xs pb-3 border-b border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-sans">Gross Bid Volume</span>
            <span className="text-on-surface font-bold">${bidAmount.toLocaleString()}.00 USDC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-sans">Protocol Fee (0%)</span>
            <span className="text-primary font-semibold">$0.00 USDC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-sans">Gas Sponsorship</span>
            <span className="text-secondary font-semibold">SPONSORED (0 ETH)</span>
          </div>
        </div>
        <div className="pt-3">
          <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Freelancer Net Payout</span>
            <span className="font-mono text-base font-bold text-primary">${bidAmount.toLocaleString()}.00 USDC</span>
          </div>
        </div>
      </div>

      {/* Decentralized Dispute Arbitration Standard Card */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="material-symbols-outlined text-primary text-[18px]">gavel</span>
          <h3 className="text-xs font-bold text-on-surface">Decentralized Arbitration Clause</h3>
        </div>
        <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">
          Milestones are subject to autonomous adjudication via Kleros Court DeFi Subcourt in the event of deadlock.
        </p>
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedToArbitration}
            onChange={onToggleArbitration}
            className="mt-0.5 accent-primary rounded bg-surface-container cursor-pointer"
          />
          <span className="text-[11px] text-on-surface-variant">
            I agree to Banglance Non-Custodial Protocol Escrow Rules and Kleros juror jurisdiction.
          </span>
        </label>
      </div>
    </div>
  );
};
