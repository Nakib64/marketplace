'use client';

import React from 'react';

export const ProposalMultisigVaultStatus: React.FC = () => {
  return (
    <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl flex flex-col gap-4 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">Multi-Sig Vault Status</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs text-primary font-semibold">Connected</span>
        </div>
      </div>

      <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/20 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Arbitrum Safe Multi-Sig</span>
          <span className="font-mono text-on-surface font-semibold">2 of 3 Required</span>
        </div>
        <div className="font-mono text-xs text-on-surface bg-surface-container-high px-2.5 py-1 rounded flex items-center justify-between">
          <span>0x3C49...81B7</span>
          <button
            type="button"
            onClick={() => alert('Copied Safe address to clipboard')}
            className="text-on-surface-variant hover:text-on-surface"
            title="Copy Address"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
          </button>
        </div>
        <div className="flex flex-col gap-1.5 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-on-surface">Signer 1 (Your Wallet): Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-on-surface">Signer 2 (DAO Escrow Delegate): Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-surface-container-highest" />
            <span className="text-on-surface-variant">Signer 3 (Audit Oracle): Standby</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-on-surface-variant leading-relaxed">
        Selecting an applicant automatically builds the non-custodial milestone contract draft ready for cryptographic co-signing on Arbitrum One.
      </p>

      <button
        type="button"
        onClick={() => alert('Simulating Safe batch transaction: Gas estimate 142,850 units on Arbitrum One')}
        className="w-full py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-outline-variant/30"
      >
        <span className="material-symbols-outlined text-[18px]">verified</span>
        <span>Simulate Safe Execution</span>
      </button>
    </div>
  );
};
