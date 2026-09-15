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
        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Payment Summary</span>
        <div className="flex items-center gap-1 text-primary  text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Protected Payment
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Milestone Amount:</span>
          <span className=" font-semibold text-on-surface">${amount.toLocaleString()} {currency}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Platform Fee:</span>
          <span className=" text-primary">0.00% ($0.00)</span>
        </div>
        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="font-bold text-on-surface">Total Payment Release:</span>
          <span className=" text-base font-bold text-on-surface">${amount.toLocaleString()} {currency}</span>
        </div>
      </div>

      {/* Remaining Funds */}
      <div className="flex items-center justify-between px-3 py-2 rounded bg-surface-container-low text-on-surface-variant text-xs  border border-outline-variant/20">
        <span>Remaining in Protection:</span>
        <span className="font-semibold text-on-surface">$2,500.00 USDC</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          type="button"
          disabled={isApproving}
          onClick={onApprove}
          className="w-full py-2.5 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
        >
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{isApproving ? 'Approving Payment...' : `Approve & Release Payment ($${amount.toLocaleString()})`}</span>
        </button>

        <button
          type="button"
          onClick={onRequestChanges}
          className="w-full py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[16px]">sync_problem</span>
          <span>Request Changes</span>
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onDispute}
            className="text-[11px] text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">help_outline</span>
            <span>Need Help? Contact Resolution Support</span>
          </button>
        </div>
      </div>

      {/* Review window note */}
      <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/20 flex items-center gap-2 text-[11px] text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[16px] shrink-0">schedule</span>
        <span>Review Window: 48 hours to request revisions before automatic release.</span>
      </div>
    </div>
  );
};
