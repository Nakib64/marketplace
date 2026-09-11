import React from 'react';

interface ProposalEscrowSummaryWidgetProps {
  budget?: number;
}

export const ProposalEscrowSummaryWidget: React.FC<ProposalEscrowSummaryWidgetProps> = ({ budget = 15000 }) => {
  return (
    <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl flex flex-col gap-4 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">Job Escrow Summary</span>
        <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono text-xs flex items-center gap-1 border border-outline-variant/30">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          On-Chain Ready
        </span>
      </div>

      <div className="flex flex-col gap-2 font-mono text-xs">
        <div className="flex justify-between items-baseline">
          <span className="text-on-surface-variant font-sans text-xs">Target Project Budget:</span>
          <span className="text-on-surface font-bold text-sm">${budget.toLocaleString()}.00 USDC</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-on-surface-variant font-sans text-xs">Average Pool Bid:</span>
          <span className="text-on-surface">$14,230.00 USDC</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-on-surface-variant font-sans text-xs">Spread Range:</span>
          <span className="text-on-surface-variant">$12,000 — $16,500 USDC</span>
        </div>
      </div>

      {/* Pool Spread Visualization Bar */}
      <div>
        <div className="flex justify-between text-on-surface-variant font-mono text-[11px] mb-1.5">
          <span>$12.0k (Min)</span>
          <span className="text-primary font-semibold">$14.5k (Alex R.)</span>
          <span>$16.5k (Max)</span>
        </div>
        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden flex">
          <div className="w-1/4 bg-surface-container-highest" />
          <div className="w-2/5 bg-primary" />
          <div className="w-1/3 bg-surface-container-highest" />
        </div>
      </div>

      <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-on-surface text-xs font-semibold">
          <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
          <span>Hirer Security Protocols Active</span>
        </div>
        <ul className="text-xs text-on-surface-variant space-y-1.5">
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>48-Hour Automated Milestone Review Grace Period</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>Kleros ERC-792 Decentralized Court Arbitration</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>Dual-Signature Non-Custodial Release Trigger</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
