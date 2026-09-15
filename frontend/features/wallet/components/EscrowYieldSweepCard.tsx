import React from 'react';

export const EscrowYieldSweepCard: React.FC = () => {
  return (
    <div className="rounded-xl bg-surface-container-low p-5 border border-outline-variant/30 flex flex-col gap-3.5 shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">percent</span>
          <h3 className="text-sm font-bold text-on-surface">Balance Rewards</h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-semibold">
          4.8% APY
        </span>
      </div>

      <div className="p-3 rounded-lg bg-surface-container flex flex-col gap-2 border border-outline-variant/20">
        <div className="flex justify-between items-baseline">
          <span className="text-on-surface-variant text-[11px]">Earned Rewards</span>
          <span className="text-base font-bold text-primary ">+৳1,840.00 BDT</span>
        </div>
        <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: '82%' }} />
        </div>
      </div>
    </div>
  );
};

