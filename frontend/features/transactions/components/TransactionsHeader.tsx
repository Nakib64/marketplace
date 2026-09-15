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
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-xs text-on-surface-variant">
        <Link href="/client/jobs" className="hover:text-on-surface transition-colors">Workspace</Link>
        <span>/</span>
        <Link href="/wallet" className="hover:text-on-surface transition-colors">Wallet</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">Transactions</span>
      </nav>

      {/* Title & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            Transaction History
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs">
          <button
            type="button"
            onClick={onExportIrs}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold transition-colors border border-outline-variant/30 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">receipt_long</span>
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={onExportQuickbooks}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold transition-colors border border-outline-variant/30 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">download</span>
            <span>Download Receipts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
