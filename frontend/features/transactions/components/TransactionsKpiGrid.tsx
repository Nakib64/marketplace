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
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Total Completed Volume</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">account_balance</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold  text-on-surface">
            ${metrics.totalSettledUsdc.toLocaleString()}.00 <span className="text-xs text-on-surface-variant">USDC</span>
          </span>
          <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Lifetime {metrics.settledCount} Payments • {metrics.disputesCount} disputes</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Fee Savings</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">savings</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold  text-on-surface">
            ${metrics.gasSavedUsd.toLocaleString()} <span className="text-xs text-on-surface-variant">Saved</span>
          </span>
          <div className="flex items-center gap-1 text-on-surface-variant text-[11px]">
            <span className=" text-primary font-bold">{metrics.gaslessRelayCount}</span>
            <span>Fee-free transactions</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Pending Approvals</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">hourglass_top</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold  text-on-surface">{metrics.pendingMempoolCount} In Progress</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant text-[11px]">
            <span>Payment Protected</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Invoices &amp; Receipts</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">receipt_long</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold  text-on-surface">100% Documented</span>
          <div className="flex items-center gap-1 text-on-surface-variant text-[11px]">
            <span>Verified payment history</span>
          </div>
        </div>
      </div>
    </div>
  );
};
