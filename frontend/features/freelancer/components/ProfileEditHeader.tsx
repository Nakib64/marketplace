'use client';

import React from 'react';
import Link from 'next/link';

interface ProfileEditHeaderProps {
  onSave: () => void;
  isSaving?: boolean;
}

export const ProfileEditHeader: React.FC<ProfileEditHeaderProps> = ({ onSave, isSaving }) => {
  return (
    <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-outline-variant/30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
          <Link href="/freelancer/dashboard" className="hover:text-on-surface transition-colors">Client &amp; Talent Workspace</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span>Settings</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Profile &amp; On-Chain Identity</span>
        </nav>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-on-surface-variant">Arbitrum Stylus Testnet Sync: OK</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface">
              Identity &amp; Verifiable Credentials
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-xs border border-outline-variant/30">
              v2.4 Attested
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-3xl">
            Manage decentralized identity, ENS resolution, Soulbound Tokens (SBTs), and zero-knowledge reputation attestations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/freelancers/demo-1"
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors border border-outline-variant/30 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">visibility</span>
            <span>Public View Preview</span>
          </Link>
          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
