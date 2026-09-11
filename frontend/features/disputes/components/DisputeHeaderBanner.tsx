'use client';

import React from 'react';
import Link from 'next/link';

interface DisputeHeaderBannerProps {
  onInitiateDispute: () => void;
}

export const DisputeHeaderBanner: React.FC<DisputeHeaderBannerProps> = ({ onInitiateDispute }) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-xs text-on-surface-variant font-medium">
        <Link href="/client/jobs" className="hover:text-on-surface transition-colors">Client Workspace</Link>
        <span>/</span>
        <span>Governance &amp; Treasury</span>
        <span>/</span>
        <span className="text-on-surface font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Kleros Dispute Resolution Center
        </span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 bg-surface-container rounded-xl p-5 border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-medium border border-outline-variant/20">
              ERC-792 Standard
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
              Kleros V2 Subcourt #14
            </span>
            <span className="flex items-center gap-1 text-primary font-sans font-medium">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              Decentralized Arbitration
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight font-mono mt-1">
            Decentralized Dispute Resolution &amp; Arbitration Center
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Non-custodial court powered by Kleros ERC-792 decentralized jurors, cryptographic evidence vaults, and game-theoretic ruling consensus.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
          <button
            type="button"
            onClick={onInitiateDispute}
            className="px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">shield</span>
            <span>Initiate Formal Arbitration Case</span>
          </button>
        </div>
      </div>
    </div>
  );
};
