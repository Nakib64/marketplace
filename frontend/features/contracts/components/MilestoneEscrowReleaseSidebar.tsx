'use client';

import React from 'react';

interface MilestoneEscrowReleaseSidebarProps {
  amount?: number;
  currency?: string;
  isApproving?: boolean;
  onApprove: () => Promise<void>;
  onRequestChanges: () => void;
  onDispute: () => void;
}

export const MilestoneEscrowReleaseSidebar: React.FC<MilestoneEscrowReleaseSidebarProps> = ({
  amount = 3500,
  currency = 'USDC',
  isApproving,
  onApprove,
  onRequestChanges,
  onDispute,
}) => {
  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Release Execution</span>
        <div className="flex items-center gap-1 text-primary font-mono text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Arbitrum Escrow
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Disbursement Amount:</span>
          <span className="font-mono font-semibold text-on-surface">${amount.toLocaleString()} {currency}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Protocol Settlement Fee:</span>
          <span className="font-mono text-primary">0.00% ($0.00)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Est. Arbitrum Gas:</span>
          <span className="font-mono text-on-surface-variant">~0.00012 ETH ($0.42)</span>
        </div>
        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="font-bold text-on-surface">Total Escrow Debit:</span>
          <span className="font-mono text-base font-bold text-on-surface">${amount.toLocaleString()} {currency}</span>
        </div>
      </div>

      {/* Remaining in Vault */}
      <div className="flex items-center justify-between px-3 py-2 rounded bg-surface-container-low text-on-surface-variant text-xs font-mono border border-outline-variant/20">
        <span>Remaining in Vault:</span>
        <span className="font-semibold text-on-surface">$2,500.00 USDC</span>
      </div>

      {/* Multisig Signers */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Multi-Sig Consensus (2/3)</span>
          <span className="font-mono text-primary font-bold text-[11px]">1 / 2 Pending</span>
        </div>
        <div className="flex flex-col gap-1.5 text-xs font-mono">
          <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-on-surface text-[11px] truncate">Hirer Wallet (Connected)</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary shrink-0">Ready</span>
          </div>
          <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20 flex items-center justify-between opacity-80">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-surface-variant" />
              <span className="text-on-surface text-[11px] truncate">Tech Lead (0x84E1...99A2)</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-container-highest text-on-surface-variant shrink-0">Awaiting</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          type="button"
          disabled={isApproving}
          onClick={onApprove}
          className="w-full py-2.5 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
        >
          <span className="material-symbols-outlined text-[16px]">draw</span>
          <span>{isApproving ? 'Broadcasting Signature...' : `Sign & Authorize Escrow Release ($${amount.toLocaleString()})`}</span>
        </button>

        <button
          type="button"
          onClick={onRequestChanges}
          className="w-full py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[16px]">sync_problem</span>
          <span>Request Milestone Changes / Re-submission</span>
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onDispute}
            className="text-[11px] text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">balance</span>
            <span>Initiate Kleros Dispute Escalation</span>
          </button>
        </div>
      </div>

      {/* SLA notice */}
      <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1 text-[11px] text-on-surface-variant">
        <div className="flex items-center gap-1 text-on-surface font-semibold">
          <span className="material-symbols-outlined text-primary text-[14px]">schedule</span>
          <span>48-Hour Protocol Release SLA</span>
        </div>
        <p className="leading-normal">
          Funds automatically disburse if no formal change request is submitted within the grace countdown.
        </p>
      </div>
    </div>
  );
};
