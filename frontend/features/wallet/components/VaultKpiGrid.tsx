import React from 'react';
import { VaultKpiMetrics } from '../types/walletTypes';

interface VaultKpiGridProps {
  metrics: VaultKpiMetrics;
}

export const VaultKpiGrid: React.FC<VaultKpiGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* TVL */}
      <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Total Value Locked (TVL)</span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-on-surface">${metrics.tvl.toLocaleString()}</span>
            <span className="text-xs font-mono text-on-surface-variant">USDC</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-0.5 text-primary font-medium">
              <span className="material-symbols-outlined text-[13px]">trending_up</span> +{metrics.tvlGrowthPct}% this mo
            </span>
            <span className="text-on-surface-variant font-mono">Buffer: ${metrics.bufferAmount.toLocaleString()}</span>
          </div>
        </div>
        <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: '78%' }} />
        </div>
      </div>

      {/* Pending Sign-Off */}
      <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Pending Sign-Off</span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">draw</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-on-surface">{metrics.pendingReleaseCount}</span>
            <span className="text-sm font-mono text-on-surface-variant">Releases</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-on-surface-variant">Locked for Approval:</span>
            <span className="font-mono font-semibold text-primary">${metrics.pendingReleaseAmount.toLocaleString()} USDC</span>
          </div>
        </div>
        <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-primary-container h-full rounded-full" style={{ width: '50%' }} />
        </div>
      </div>

      {/* Autonomous SLA */}
      <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Autonomous Settle SLA</span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">speed</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-on-surface">{metrics.avgSettleHours}</span>
            <span className="text-xs font-mono text-on-surface-variant">Hours Avg</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-primary font-medium flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">verified</span> {metrics.onTimeSlaPct}% On-Time
            </span>
            <span className="text-on-surface-variant">{metrics.openDisputesCount} Open Disputes</span>
          </div>
        </div>
        <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: '96%' }} />
        </div>
      </div>

      {/* Collateral Security */}
      <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Collateral Security</span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">shield</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-on-surface">{metrics.collateralSecurityPct}%</span>
            <span className="text-xs font-mono text-primary font-semibold">OPTIMAL</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-on-surface-variant">Non-Custodial</span>
            <span className="font-mono text-on-surface">Zero Admin Keys</span>
          </div>
        </div>
        <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: '99%' }} />
        </div>
      </div>
    </div>
  );
};
