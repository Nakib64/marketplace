'use client';

import React from 'react';
import Link from 'next/link';

interface VaultHeaderTelemetryProps {
  onInitializeVault: () => void;
  onExportCsv: () => void;
}

export const VaultHeaderTelemetry: React.FC<VaultHeaderTelemetryProps> = ({
  onInitializeVault,
  onExportCsv,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-xs text-on-surface-variant font-medium">
        <Link href="/client/jobs" className="hover:text-on-surface transition-colors">Workspace</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">Payments &amp; Balances</span>
      </nav>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
          Project Payments &amp; Balances
        </h1>

        <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs">
          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-semibold transition-colors border border-outline-variant/30 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">file_download</span>
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={onInitializeVault}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Add Project Funds</span>
          </button>
        </div>
      </div>
    </div>
  );
};

