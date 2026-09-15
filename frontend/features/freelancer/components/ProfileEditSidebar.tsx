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
            <span className="material-symbols-outlined text-[16px] text-primary">person</span>
            <span>Profile Information</span>
          </div>
          <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
        </div>
        <Link href="/wallet" className="flex items-center justify-between px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium transition-colors">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            <span>Wallet &amp; Payouts</span>
          </div>
        </Link>
        <div className="flex items-center justify-between px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-medium transition-colors">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">notifications</span>
            <span>Notifications</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-medium transition-colors">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">security</span>
            <span>Account Security</span>
          </div>
        </div>
      </div>

      {/* Verification Level */}
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant font-semibold">Profile Strength</span>
          <span className="text-xs font-bold text-primary">95%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '95%' }} />
        </div>
        <div className="flex flex-col gap-1.5 pt-1 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/20">
            <span className="text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
              Email &amp; Identity
            </span>
            <span className="text-primary text-[11px] font-medium">Verified</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/20">
            <span className="text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
              Portfolio &amp; Skills
            </span>
            <span className="text-primary text-[11px] font-medium">Verified</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/20">
            <span className="text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
              Payout Method
            </span>
            <span className="text-primary text-[11px] font-medium">Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

