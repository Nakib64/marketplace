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
        <Link href="/client/jobs" className="hover:text-on-surface transition-colors">Client Workspace</Link>
        <span>/</span>
        <span>Escrow Vaults &amp; Treasury</span>
        <span>/</span>
        <span className="text-on-surface font-semibold">Global Vault Matrix</span>
      </nav>

      {/* Main Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-mono">
            Escrow Smart Vault Balances &amp; Allocations
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Monitor autonomous non-custodial multi-sig smart vaults, locked milestone capital, and real-time yield accrual across Arbitrum and Ethereum L2s.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs">
          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-semibold transition-colors border border-outline-variant/30 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">file_download</span>
            <span>Export Settlement CSV</span>
          </button>
          <button
            type="button"
            onClick={onInitializeVault}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Initialize New Vault</span>
          </button>
        </div>
      </div>

      {/* Telemetry Capsule */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-2 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface-variant text-xs font-mono border border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-on-surface font-medium">Arbitrum Safe Connected:</span>
          <span className="text-on-surface">0x3C49...81B7</span>
          <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px] font-bold text-primary">2/3 SAFE</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-[11px]">
          <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
          <span>CertiK Audited v2.4 (99.8%)</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px]">
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">local_gas_station</span>
          <span>L2 Gas: <strong className="text-on-surface">0.12 Gwei</strong></span>
        </div>
        <div className="ml-auto hidden xl:flex items-center gap-1 text-[11px]">
          <span className="material-symbols-outlined text-[13px] text-primary">lock_clock</span>
          <span>Latency: 1.4s (Zero Admin Keys)</span>
        </div>
      </div>
    </div>
  );
};
