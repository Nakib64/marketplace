'use client';

import React from 'react';
import Link from 'next/link';

interface ContractDetailsHeaderProps {
  contractId: string;
  contractAddress?: string;
  title?: string;
}

export const ContractDetailsHeader: React.FC<ContractDetailsHeaderProps> = ({
  contractId,
  contractAddress = '0x71c8...39A1',
  title = 'Arbitrum Orbit AMM Rollup',
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 pb-4 border-b border-outline-variant/30">
      <div className="flex flex-col gap-1.5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-xs text-on-surface-variant font-medium">
          <Link href="/freelancer/dashboard" className="hover:text-on-surface transition-colors">Contracts</Link>
          <span className="text-surface-container-highest">/</span>
          <span>Active</span>
          <span className="text-surface-container-highest">/</span>
          <span className="font-mono text-on-surface truncate max-w-xs">{title} (#{contractId || contractAddress})</span>
        </nav>
        <div className="flex items-center gap-3 flex-wrap pt-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface font-mono">
            Contract #{contractAddress}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            In Progress • Multi-Sig 2/3
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-mono border border-outline-variant/30">
            <span className="material-symbols-outlined text-[14px] text-primary">shield</span>
            Kleros Protected
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-start lg:self-center">
        <button
          type="button"
          onClick={() => alert(`Contract ABI copied for address ${contractAddress} (Ref: ${contractId})`)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold transition-colors border border-outline-variant/30 shadow-sm"
        >
          <span className="material-symbols-outlined text-primary text-[16px]">terminal</span>
          <span>Contract ABI</span>
        </button>
        <a
          href="https://arbiscan.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold transition-colors border border-outline-variant/30 shadow-sm"
        >
          <span className="material-symbols-outlined text-primary text-[16px]">open_in_new</span>
          <span>Arbiscan</span>
        </a>
      </div>
    </div>
  );
};
