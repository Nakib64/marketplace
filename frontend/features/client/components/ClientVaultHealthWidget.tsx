'use client';

import React from 'react';

export const ClientVaultHealthWidget: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 lg:p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">security</span>
          <h3 className="text-base font-bold text-on-surface">Escrow Vault Health</h3>
        </div>
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      </div>

      <div className="bg-surface-container rounded-lg p-3.5 flex flex-col gap-2.5 border border-outline-variant/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Multi-Sig Vault</span>
          <span className="font-mono text-on-surface">Safe 0x3bF2...320E</span>
        </div>
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Vault Balances</span>
            <span className="text-lg font-bold text-on-surface">
              $48,200 <span className="text-xs font-normal text-on-surface-variant">USDC</span>
            </span>
          </div>
          <div className="flex justify-end font-mono text-xs text-on-surface-variant">
            + 12.5 ETH Reserve
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pt-1 text-xs">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">gavel</span>
          <div>
            <div className="font-semibold text-on-surface">Kleros Decentralized Arbitration</div>
            <div className="text-on-surface-variant text-[11px]">Court ruling clause embedded in contracts</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">lock_clock</span>
          <div>
            <div className="font-semibold text-on-surface">48-Hour Invariant Grace Period</div>
            <div className="text-on-surface-variant text-[11px]">Automated milestone dispute protection</div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => alert('Multisig config modal: 2/3 signatures threshold active on Arbitrum One')}
        className="w-full px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-outline-variant/30 shadow-sm"
      >
        <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
        <span>Configure Multisig Signers (2/3)</span>
      </button>
    </div>
  );
};
