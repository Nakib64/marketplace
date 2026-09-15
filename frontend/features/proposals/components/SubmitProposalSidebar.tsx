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
  clientName = 'Client',
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Client Profile */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Client Profile</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm border border-outline-variant/30">
            {clientName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-bold text-on-surface block">{clientName}</span>
            <span className="text-[11px] text-on-surface-variant">Verified Client</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 text-xs text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[16px] shrink-0">shield</span>
          <p className="text-[11px]">100% of milestone funds are securely held in escrow before you start working.</p>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-on-surface mb-3">Payment Breakdown</h3>
        <div className="space-y-2 text-xs pb-3 border-b border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Gross Bid Amount</span>
            <span className="text-on-surface font-bold">৳{bidAmount.toLocaleString()} BDT</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Platform Fee (0%)</span>
            <span className="text-primary font-semibold">৳0 BDT</span>
          </div>
        </div>
        <div className="pt-3">
          <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Net Freelancer Payout</span>
            <span className="text-base font-bold text-primary">৳{bidAmount.toLocaleString()} BDT</span>
          </div>
        </div>
      </div>

      {/* Terms & Protection */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
          <h3 className="text-xs font-bold text-on-surface">Payment Protection</h3>
        </div>
        <label className="flex items-start gap-2 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={agreedToArbitration}
            onChange={onToggleArbitration}
            className="mt-0.5 accent-primary rounded bg-surface-container cursor-pointer"
          />
          <span className="text-[11px] text-on-surface-variant">
            I agree to the marketplace terms and payment protection policy.
          </span>
        </label>
      </div>
    </div>
  );
};
