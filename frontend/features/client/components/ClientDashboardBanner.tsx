'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';

export const ClientDashboardBanner: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.clientProfile?.companyName || user?.name || user?.email?.split('@')[0] || 'Client';

  return (
    <div className="w-full bg-surface-container-low rounded-xl p-4 lg:p-6 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4 border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/40">
          <span className="material-symbols-outlined text-primary text-[28px]">domain</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl lg:text-2xl text-on-surface font-bold tracking-tight capitalize">{displayName}</h1>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            <span>Client Workspace</span>
            <span className="text-outline-variant">•</span>
            <span className="inline-flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Verified Account
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 xl:pt-0">
        <button
          type="button"
          onClick={() => toast.success('Deposit details copied to clipboard')}
          className="px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold transition-colors flex items-center gap-2 border border-outline-variant/30 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
          <span>Add Funds</span>
        </button>
        <Link
          href="/client/jobs/new"
          className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Post a Job</span>
        </Link>
      </div>
    </div>
  );
};

