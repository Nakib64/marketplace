'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';

export const ClientDashboardBanner: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.clientProfile?.companyName || user?.email?.split('@')[0] || 'Kroma Labs DAO';

  return (
    <div className="w-full bg-surface-container-low rounded-xl p-4 lg:p-6 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4 border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/40">
          <span className="material-symbols-outlined text-primary text-[32px]">shield_person</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl lg:text-2xl text-on-surface font-bold tracking-tight capitalize">{displayName}</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              Verified Hirer
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary text-xs font-medium">
              Tier-1 Enterprise
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-on-surface-variant font-mono text-xs">
            <span className="flex items-center gap-1 text-on-surface">
              <span className="material-symbols-outlined text-[15px] text-primary">link</span>
              kromalabs.eth
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1">
              <span>Safe: 0x3C49...81B7</span>
              <span className="px-1.5 py-0.5 bg-surface-container text-on-surface-variant rounded">Arbitrum One 2/3</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 xl:pt-0">
        <button
          type="button"
          onClick={() => alert('Escrow Vault deposit address copied to clipboard')}
          className="px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold transition-colors flex items-center gap-2 border border-outline-variant/30 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
          <span>Deposit to Escrow Vault</span>
        </button>
        <Link
          href="/client/jobs/new"
          className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Post New Job RFP</span>
        </Link>
      </div>
    </div>
  );
};
