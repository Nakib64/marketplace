import React from 'react';
import { ProposalItem } from '../types/proposalsTypes';

interface ProposalBenchmarkMatrixWidgetProps {
  proposals?: ProposalItem[];
}

export const ProposalBenchmarkMatrixWidget: React.FC<ProposalBenchmarkMatrixWidgetProps> = ({
  proposals = [],
}) => {
  if (proposals.length === 0) {
    return (
      <div className="bg-surface-container-low border border-outline-variant/30 p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-on-surface">Candidate Benchmark Matrix</span>
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">analytics</span>
        </div>
        <p className="text-xs text-on-surface-variant">
          Benchmark metrics and bid comparisons will automatically populate as candidates submit proposals.
        </p>
      </div>
    );
  }

  const bids = proposals.map((p) => Number(p.bidAmount || 0));
  const minBid = Math.min(...bids);
  const maxBid = Math.max(...bids);
  const avgBid = Math.round(bids.reduce((a, b) => a + b, 0) / bids.length);

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">Candidate Benchmark Matrix</span>
        <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
          {proposals.length} Evaluated
        </span>
      </div>

      <div className="flex flex-col gap-3.5 text-xs">
        {/* Bid Distribution */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-on-surface text-xs font-semibold">
            <span>Proposal Bid Range</span>
            <span className="text-primary font-bold">৳{minBid.toLocaleString()} — ৳{maxBid.toLocaleString()}</span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: '100%' }} />
          </div>
          <div className="flex justify-between text-on-surface-variant text-[11px] pt-0.5">
            <span>Lowest: ৳{minBid.toLocaleString()}</span>
            <span>Avg: ৳{avgBid.toLocaleString()}</span>
            <span>Highest: ৳{maxBid.toLocaleString()}</span>
          </div>
        </div>

        {/* Candidate Breakdown */}
        <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/20">
          <span className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">Candidate Bids</span>
          <div className="flex flex-col gap-1.5">
            {proposals.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 rounded-xl bg-surface-container border border-outline-variant/20"
              >
                <span className="text-xs font-semibold text-on-surface truncate">{p.freelancerName}</span>
                <span className="text-xs font-bold text-primary shrink-0">৳{p.bidAmount.toLocaleString()} BDT</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
