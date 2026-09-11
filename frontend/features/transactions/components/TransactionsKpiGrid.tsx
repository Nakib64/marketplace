import React from 'react';
import { TransactionsMetrics } from '../types/transactionTypes';

interface TransactionsKpiGridProps {
  metrics: TransactionsMetrics;
}

export const TransactionsKpiGrid: React.FC<TransactionsKpiGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Total Settled Volume</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">account_balance</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold font-mono text-on-surface">
            ${metrics.totalSettledUsdc.toLocaleString()}.00 <span className="text-xs text-on-surface-variant">USDC</span>
          </span>
          <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Lifetime {metrics.settledCount} Escrows • {metrics.disputesCount} disputes</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Gas Saved (Paymaster)</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">local_gas_station</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold font-mono text-on-surface">
            ${metrics.gasSavedUsd.toLocaleString()} <span className="text-xs text-on-surface-variant">USD</span>
          </span>
          <div className="flex items-center gap-1 text-on-surface-variant text-[11px]">
            <span className="font-mono text-primary font-bold">{metrics.gaslessRelayCount}</span>
            <span>Gasless relay transactions</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Pending Confirmations</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">hourglass_top</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold font-mono text-on-surface">{metrics.pendingMempoolCount} In Mempool</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant text-[11px] font-mono">
            <span>Block #{metrics.pendingBlockNumber}</span>
            <span>• L2 settlement</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Auditable Receipts</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">fingerprint</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold font-mono text-on-surface">{metrics.ipfsPinnedPct}% IPFS Pinned</span>
          <div className="flex items-center gap-1 text-on-surface-variant text-[11px] font-mono">
            <span className="text-on-surface font-semibold">{metrics.totalPinnedCount}/{metrics.totalPinnedCount}</span>
            <span>Timestamped &amp; zk-anchored</span>
          </div>
        </div>
      </div>
    </div>
  );
};
