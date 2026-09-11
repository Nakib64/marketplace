import React from 'react';
import { ProposalMilestone } from '../types/proposalsTypes';

interface ProposalMilestoneListProps {
  milestones: ProposalMilestone[];
}

export const ProposalMilestoneList: React.FC<ProposalMilestoneListProps> = ({ milestones }) => {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div>
      <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
        Escrow Milestone Execution Plan
      </div>
      <div className="flex flex-col gap-1.5">
        {milestones.map((m) => (
          <div
            key={m.step}
            className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold">
                {m.step}
              </span>
              <div className="truncate">
                <span className="text-xs font-semibold text-on-surface">{m.title}</span>
                <span className="text-on-surface-variant text-xs hidden sm:inline ml-2">• {m.durationDays} Days</span>
              </div>
            </div>
            <span className="font-mono text-xs font-semibold text-on-surface shrink-0">
              ${m.amount.toLocaleString()} {m.currency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
