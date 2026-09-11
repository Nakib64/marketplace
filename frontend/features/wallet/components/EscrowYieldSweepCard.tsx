import React from 'react';

export const EscrowYieldSweepCard: React.FC = () => {
  return (
    <div className="rounded-xl bg-surface-container-low p-5 border border-outline-variant/30 flex flex-col gap-3.5 shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">percent</span>
          <h3 className="text-sm font-bold text-on-surface">Escrow Yield Sweep</h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs font-semibold">
          4.82% APY
        </span>
      </div>

      <p className="text-xs text-on-surface-variant leading-relaxed">
        Locked milestone capital automatically accrues low-risk interest in Aave-v3 liquidity pools prior to release approval.
      </p>

      <div className="p-3 rounded-lg bg-surface-container flex flex-col gap-2 border border-outline-variant/20">
        <div className="flex justify-between items-baseline">
          <span className="text-on-surface-variant text-[11px]">Earned Interest (MTD)</span>
          <span className="text-base font-bold text-primary font-mono">+$184.20 USDC</span>
        </div>
        <div className="flex justify-between items-center text-[11px] text-on-surface-variant">
          <span>Strategy</span>
          <span className="text-on-surface font-medium">Aave v3 Prime Liquidity</span>
        </div>
        <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: '82%' }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5">
        <span>Yield Recipient:</span>
        <span className="text-on-surface font-medium">Hirer Treasury Reinvestment</span>
      </div>
    </div>
  );
};
