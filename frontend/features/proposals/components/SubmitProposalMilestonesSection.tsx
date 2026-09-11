'use client';

import React from 'react';
import { ProposalMilestone } from '../types/proposalsTypes';

interface SubmitProposalMilestonesSectionProps {
  milestones: ProposalMilestone[];
  onAddMilestone: () => void;
  onRemoveMilestone: (index: number) => void;
  totalBid: number;
}

export const SubmitProposalMilestonesSection: React.FC<SubmitProposalMilestonesSectionProps> = ({
  milestones,
  onAddMilestone,
  onRemoveMilestone,
  totalBid,
}) => {
  const allocatedSum = milestones.reduce((sum, m) => sum + m.amount, 0);
  const delta = totalBid - allocatedSum;

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center font-mono text-primary font-bold text-xs">
            03
          </span>
          <div>
            <h2 className="text-base font-bold text-on-surface">Milestone Breakdown &amp; Escrow Allocation</h2>
            <p className="text-xs text-on-surface-variant">Phase definitions mapped directly into autonomous release triggers.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full border border-outline-variant/20">
          <span className={`w-2 h-2 rounded-full ${delta === 0 ? 'bg-primary' : 'bg-secondary animate-pulse'}`} />
          <span className="font-mono text-xs text-on-surface">
            Allocated: ${allocatedSum.toLocaleString()} / ${totalBid.toLocaleString()} USDC
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {milestones.map((m, idx) => (
          <div key={m.step} className="bg-surface-container border border-outline-variant/20 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center font-mono text-[11px] text-primary font-bold">
                  {m.step}
                </span>
                <span className="text-xs font-bold text-on-surface">{m.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-on-surface">${m.amount.toLocaleString()} USDC</span>
                {milestones.length > 1 && (
                  <button type="button" onClick={() => onRemoveMilestone(idx)} className="text-on-surface-variant hover:text-error text-xs">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/10">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-primary">task_alt</span>
                Deliverable specifications and unit tests required
              </span>
              <span className="font-mono">{m.durationDays} Days</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onAddMilestone}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
        >
          <span className="text-primary font-bold">+</span>
          <span>Add Another Milestone</span>
        </button>
        <div className="flex items-center gap-2 text-right">
          <div className="text-[11px] font-mono text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">lock_clock</span>
            <span>{delta === 0 ? '100% Escrow Sum Reconciled' : `Delta: $${delta} USDC`}</span>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <div>
            <span className="font-semibold text-on-surface">Escrow Integrity Verified</span>
            <div className="text-on-surface-variant text-[11px]">Total allocated matches bid: ${totalBid.toLocaleString()} USDC locked sequentially.</div>
          </div>
        </div>
        <span className="font-mono font-bold text-primary">{delta === 0 ? '0.00 Delta' : `-$${delta}`}</span>
      </div>
    </div>
  );
};
