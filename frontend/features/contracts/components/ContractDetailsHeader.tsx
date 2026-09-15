'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

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
          <span className="text-on-surface truncate max-w-xs">{title}</span>
        </nav>
        <div className="flex items-center gap-3 flex-wrap pt-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface">
            {title}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            In Progress
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-surface-container-low text-primary text-xs font-medium border border-outline-variant/30">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            Payment Protected
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-start lg:self-center">
        <button
          type="button"
          onClick={() => toast.success(`Contract reference copied: ${contractId}`)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold transition-colors border border-outline-variant/30 shadow-sm"
        >
          <span className="material-symbols-outlined text-primary text-[16px]">content_copy</span>
          <span>Copy Contract ID</span>
        </button>
      </div>
    </div>
  );
};
