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

      {/* Top Details & Total Locked */}
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
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[10px]">
                {vault.rfpNumber}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                isActionRequired ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {isActionRequired && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                {vault.statusBadgeText}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
              <span className="text-on-surface font-medium">{vault.contributorName} ({vault.contributorEns})</span>
              <span>•</span>
              <span>{vault.contributorRole}</span>
              <span>•</span>
              <span className="font-mono">{vault.vaultAddress}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container p-2.5 rounded-lg text-left sm:text-right shrink-0 border border-outline-variant/20">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold block">Total Locked</span>
          <span className="text-base font-bold font-mono text-on-surface">${vault.totalLocked.toLocaleString()}</span>
          <span className="text-[10px] font-mono text-on-surface-variant block">{vault.currency} Vault</span>
        </div>
      </div>

      {/* 3-Column Progress Tray */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-xs">
        <div>
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1">
            <span>Milestone Progress</span>
            <span className="font-mono font-semibold text-on-surface">{vault.milestoneCompletedText}</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${vault.milestoneProgressPct}%` }} />
          </div>
          <span className="text-[11px] text-primary mt-1 block truncate font-medium">{vault.milestoneDetailText}</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1">
            <span>Multi-Sig Threshold</span>
            <span className="font-mono font-semibold text-primary">{vault.multisigSignedText}</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${vault.multisigProgressPct}%` }} />
          </div>
          <span className="text-[11px] text-on-surface-variant mt-1 block truncate">{vault.multisigDetailText}</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1">
            <span>{vault.slaGraceRemainingText ? 'Autonomous SLA' : 'Accrued Yield'}</span>
            <span className="font-mono text-on-surface">{vault.slaGraceRemainingText ? '36h Grace' : 'Aave v3'}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px]">
            <span className="material-symbols-outlined text-[13px] text-primary">
              {vault.slaGraceRemainingText ? 'timer' : 'eco'}
            </span>
            <span className="text-on-surface truncate">{vault.slaGraceRemainingText || vault.yieldAccruedText || 'Zero claims'}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-outline-variant/20 text-xs">
        <span className="font-mono text-[11px] text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-primary">verified_user</span>
          Hash: {vault.escrowHash}
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/contracts/${vault.id}`}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-colors flex items-center gap-1 border border-outline-variant/30"
          >
            <span>Inspect Vault</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
          {isActionRequired && (
            <Link
              href={`/contracts/${vault.id}/review`}
              className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-on-primary animate-pulse" />
              <span>Review &amp; Release</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
