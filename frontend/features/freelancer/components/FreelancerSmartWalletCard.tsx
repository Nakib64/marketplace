'use client';

import React from 'react';

export const FreelancerSmartWalletCard: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
          <span className="text-base font-bold text-on-surface">Smart Wallet</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[11px] text-primary bg-surface-container px-2 py-0.5 rounded border border-outline-variant/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Arbitrum One
        </div>
      </div>

      <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20 flex items-center justify-between">
        <span className="font-mono text-xs text-on-surface">0x8F92...0XA</span>
        <button
          type="button"
          onClick={() => alert('Copied smart wallet address to clipboard')}
          className="text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">content_copy</span>
        </button>
      </div>

      {/* Token Breakdown */}
      <div className="flex flex-col divide-y divide-outline-variant/10 text-xs">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-mono text-[11px] font-bold text-primary">
              $
            </div>
            <span className="font-semibold text-on-surface">USDC</span>
          </div>
          <div className="text-right font-mono">
            <div className="font-bold text-on-surface">6,200.00</div>
            <div className="text-[10px] text-on-surface-variant">$6,200.00</div>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-mono text-[11px] font-bold text-secondary">
              Ξ
            </div>
            <span className="font-semibold text-on-surface">ETH</span>
          </div>
          <div className="text-right font-mono">
            <div className="font-bold text-on-surface">2.45</div>
            <div className="text-[10px] text-on-surface-variant">$6,420.00</div>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-mono text-[11px] font-bold text-primary">
              ⬡
            </div>
            <span className="font-semibold text-on-surface">$BANGLANCE</span>
          </div>
          <div className="text-right font-mono">
            <div className="font-bold text-on-surface">14,500</div>
            <div className="text-[10px] text-primary">Staked Tier 2</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => alert('Displaying deposit QR code & Arbitrum One address...')}
          className="py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">north_east</span>
          <span>Deposit</span>
        </button>
        <button
          type="button"
          onClick={() => alert('Initiating gasless withdrawal to your connected external wallet...')}
          className="py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">south_west</span>
          <span>Withdraw</span>
        </button>
      </div>
    </div>
  );
};
