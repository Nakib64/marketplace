'use client';

import React from 'react';
import Link from 'next/link';
import { EscrowVaultItem } from '../types/walletTypes';

interface VaultCardProps {
  vault: EscrowVaultItem;
}

export const VaultCard: React.FC<VaultCardProps> = ({ vault }) => {
  const isActionRequired = vault.status === 'ACTION_REQUIRED';

  return (
    <div className="rounded-xl bg-surface-container-low p-5 border border-outline-variant/30 relative overflow-hidden shadow-sm hover:border-outline-variant/60 transition-all flex flex-col gap-4">
      {isActionRequired && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-container to-transparent" />
      )}

      {/* Top Details & Total Budget */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center font-bold text-sm text-primary shrink-0 border border-outline-variant/30">
            {vault.contributorAvatarText}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-on-surface hover:text-primary transition-colors">
                {vault.title}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${isActionRequired ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                {isActionRequired && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                {isActionRequired ? 'Action Required' : (vault.status === 'SETTLED' ? 'Completed' : 'In Progress')}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
              <span className="text-on-surface font-medium">{vault.contributorName}</span>
              <span>•</span>
              <span>{vault.contributorRole}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container p-2.5 rounded-lg text-left sm:text-right shrink-0 border border-outline-variant/20">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold block">Total Budget</span>
          <span className="text-base font-bold  text-on-surface">৳{vault.totalLocked.toLocaleString()}</span>
          <span className="text-[10px] text-primary font-medium block">Protected Payment</span>
        </div>
      </div>

      {/* Progress Tray */}
      <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-xs flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>Milestone Progress</span>
          <span className="font-semibold text-on-surface">{vault.milestoneCompletedText}</span>
        </div>
        <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${vault.milestoneProgressPct}%` }} />
        </div>
        <span className="text-[11px] text-primary font-medium">{vault.milestoneDetailText}</span>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-outline-variant/20 text-xs">
        <span className="text-xs text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
          Payment Protected
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/contracts/${vault.id}`}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-colors flex items-center gap-1 border border-outline-variant/30"
          >
            <span>View Details</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
          {isActionRequired && (
            <Link
              href={`/contracts/${vault.id}/review`}
              className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>Review &amp; Pay</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

