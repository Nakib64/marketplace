'use client';

import React from 'react';
import Link from 'next/link';

interface TransactionsHeaderProps {
  onExportIrs: () => void;
  onExportQuickbooks: () => void;
  onVerifyMerkle: () => void;
}

export const TransactionsHeader: React.FC<TransactionsHeaderProps> = ({
  onExportIrs,
  onExportQuickbooks,
  onVerifyMerkle,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-xs text-on-surface-variant font-mono">
        <Link href="/client/jobs" className="hover:text-on-surface transition-colors">Client Workspace</Link>
        <span>/</span>
        <Link href="/wallet" className="hover:text-on-surface transition-colors">Treasury</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">Settlement Ledger</span>
      </nav>

      {/* Title & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
            Cryptographic Transaction History
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Auditable on-chain ledger with zero-knowledge verification receipts, IPFS audit hashes, and institutional accounting export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs">
          <button
            type="button"
            onClick={onExportIrs}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold transition-colors border border-outline-variant/30 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">receipt_long</span>
            <span>Export IRS 8949 / CSV</span>
          </button>
          <button
            type="button"
            onClick={onExportQuickbooks}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold transition-colors border border-outline-variant/30 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">sync_alt</span>
            <span>QuickBooks Sync</span>
          </button>
          <button
            type="button"
            onClick={onVerifyMerkle}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-semibold transition-all border border-outline-variant/40 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
            <span>Verify Merkle Batch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
