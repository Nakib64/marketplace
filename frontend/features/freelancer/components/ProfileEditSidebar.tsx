'use client';

import React from 'react';
import Link from 'next/link';

export const ProfileEditSidebar: React.FC = () => {
  return (
    <aside className="lg:col-span-3 flex flex-col gap-4 sticky top-24">
      {/* Navigation Links */}
      <div className="p-1 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-1 shadow-sm text-xs">
        <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-surface-container-high text-on-surface font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 rounded-full bg-primary" />
            <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
            <span>Profile &amp; Identity</span>
          </div>
          <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
        </div>
        <Link href="/wallet" className="flex items-center justify-between px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium transition-colors">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Security &amp; Multi-Sig</span>
          </div>
          <span className="font-mono text-[11px] text-on-surface-variant">2/3</span>
        </Link>
        <div className="flex items-center justify-between px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-medium transition-colors">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">notifications_active</span>
            <span>Notifications</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-medium transition-colors">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Billing &amp; Invoicing</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-medium transition-colors">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Connected Oracles</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </div>

      {/* Verification Level */}
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant uppercase tracking-wider text-[11px]">Verification</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-[10px]">Tier 3 Master</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-on-surface">Identity Strength</span>
            <span className="font-mono text-sm font-bold text-primary">92%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '92%' }} />
          </div>
          <span className="text-[11px] text-on-surface-variant">Top 4% on Arbitrum Registry</span>
        </div>
        <div className="flex flex-col gap-1 pt-1 text-xs">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
            <span className="text-on-surface flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[14px]">verified</span> alexr.eth</span>
            <span className="font-mono text-primary text-[11px]">+25%</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
            <span className="text-on-surface flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[14px]">verified</span> CertiK Auditor SBT</span>
            <span className="font-mono text-primary text-[11px]">+35%</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
            <span className="text-on-surface flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[14px]">verified</span> Gitcoin Passport (42.8)</span>
            <span className="font-mono text-primary text-[11px]">+20%</span>
          </div>
        </div>
        <button type="button" onClick={() => alert('Opening SBT Credential Minting modal...')} className="w-full py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-outline-variant/30">
          <span className="material-symbols-outlined text-[15px]">security_update_good</span>
          <span>Boost Score</span>
        </button>
      </div>

      {/* ZK Storage Pill */}
      <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[18px]">fingerprint</span>
        </div>
        <div className="flex flex-col min-w-0 text-xs">
          <span className="font-semibold text-on-surface truncate">Zero-Knowledge Storage</span>
          <span className="text-[11px] text-on-surface-variant truncate">Private inputs client-hashed</span>
        </div>
      </div>
    </aside>
  );
};
