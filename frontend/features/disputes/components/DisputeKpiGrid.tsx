import React from 'react';
import { DisputeMetrics } from '../types/disputesTypes';

interface DisputeKpiGridProps {
  metrics: DisputeMetrics;
}

export const DisputeKpiGrid: React.FC<DisputeKpiGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Active Disputes</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
        </div>
        <div className="my-2">
          <span className="text-2xl font-bold text-on-surface font-mono">{metrics.activeCount} In Arbitration</span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[16px] text-primary">gavel</span>
          <span>Court #14 Smart Contract Jurors</span>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Resolved Cases</span>
          <span className="material-symbols-outlined text-outline text-[18px]">task_alt</span>
        </div>
        <div className="my-2">
          <span className="text-2xl font-bold text-on-surface font-mono">{metrics.resolvedCount} Settlements</span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
          <span>100% On-Chain Executed</span>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Total Disputed Value</span>
          <span className="material-symbols-outlined text-outline text-[18px]">lock</span>
        </div>
        <div className="my-2">
          <span className="text-2xl font-bold text-on-surface font-mono">
            ${metrics.totalDisputedUsdc.toLocaleString()} <span className="text-xs text-on-surface-variant font-normal font-sans">USDC</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs font-mono">
          <span>Frozen in Vault</span>
          <span className="text-primary">#0x811a...ef34</span>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Average Juror Turnaround</span>
          <span className="material-symbols-outlined text-outline text-[18px]">timer</span>
        </div>
        <div className="my-2">
          <span className="text-2xl font-bold text-on-surface font-mono">{metrics.avgTurnaroundDays} Days</span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[16px] text-primary">hub</span>
          <span>Kleros Staked Juror Consensus</span>
        </div>
      </div>
    </div>
  );
};
