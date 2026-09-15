import React from 'react';
import { ProposalItem } from '../types/proposalsTypes';

interface ProposalEscrowSummaryWidgetProps {
  budget?: number;
  proposals?: ProposalItem[];
}

export const ProposalEscrowSummaryWidget: React.FC<ProposalEscrowSummaryWidgetProps> = ({
  budget = 0,
  proposals = [],
}) => {
  const bids = proposals.map((p) => Number(p.bidAmount || 0));
  const avgBid = bids.length > 0 ? Math.round(bids.reduce((a, b) => a + b, 0) / bids.length) : budget;
  const minBid = bids.length > 0 ? Math.min(...bids) : budget;
  const maxBid = bids.length > 0 ? Math.max(...bids) : budget;

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">Project Budget &amp; Escrow</span>
        <span className="material-symbols-outlined text-[20px] text-primary">account_balance</span>
      </div>

      <div className="flex flex-col gap-2.5 text-xs">
        <div className="flex justify-between items-baseline">
          <span className="text-on-surface-variant font-medium">Target Project Budget:</span>
          <span className="text-on-surface font-extrabold text-sm">৳{Number(budget).toLocaleString()} BDT</span>
        </div>
        {proposals.length > 0 && (
          <>
            <div className="flex justify-between items-baseline">
              <span className="text-on-surface-variant font-medium">Average Candidate Bid:</span>
              <span className="text-primary font-bold">৳{avgBid.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-on-surface-variant font-medium">Bid Range:</span>
              <span className="text-on-surface font-semibold">৳{minBid.toLocaleString()} — ৳{maxBid.toLocaleString()} BDT</span>
            </div>
          </>
        )}
      </div>

      <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-on-surface text-xs font-semibold">
          <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
          <span>Escrow Protection Included</span>
        </div>
        <ul className="text-xs text-on-surface-variant space-y-1.5 pl-1">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <span>Multi-sig escrow protection on every milestone</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <span>48-Hour milestone inspection and feedback window</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <span>Funds released only upon your final sign-off</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
