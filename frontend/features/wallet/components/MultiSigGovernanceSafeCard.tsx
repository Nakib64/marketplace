'use client';

import React from 'react';

interface MultiSigGovernanceSafeCardProps {
  onManagePolicies?: () => void;
}

export const MultiSigGovernanceSafeCard: React.FC<MultiSigGovernanceSafeCardProps> = ({
  onManagePolicies,
}) => {
  return (
    <div className="rounded-xl bg-surface-container-low p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
          <h3 className="text-sm font-bold text-on-surface">Multi-Sig Safe</h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-[10px] font-bold">
          2 of 3 Threshold
        </span>
      </div>

      <div className="p-2.5 rounded-lg bg-surface-container font-mono text-xs flex items-center justify-between border border-outline-variant/20">
        <div>
          <span className="text-on-surface-variant text-[10px] block font-sans">SAFE ADDRESS</span>
          <span className="text-on-surface font-semibold">0x3bF2...320E</span>
        </div>
        <button
          type="button"
          onClick={() => alert('Safe address copied')}
          className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">content_copy</span>
        </button>
      </div>

      <div className="flex flex-col gap-2 text-xs">
        <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Active Keyholders</span>

        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <div>
              <span className="text-on-surface font-medium block">Hirer Treasury</span>
              <span className="font-mono text-[10px] text-on-surface-variant">0x3C49...81B7 (You)</span>
            </div>
          </div>
          <span className="text-[11px] text-primary font-medium">Connected</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <div>
              <span className="text-on-surface font-medium block">Banglance DAO Guardian</span>
              <span className="font-mono text-[10px] text-on-surface-variant">0x9188...2A5c</span>
            </div>
          </div>
          <span className="text-[11px] text-on-surface-variant">Standby</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container border border-outline-variant/20 opacity-70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-surface-variant" />
            <div>
              <span className="text-on-surface font-medium block">Chainlink Oracle Failover</span>
              <span className="font-mono text-[10px] text-on-surface-variant">0x110B...7149</span>
            </div>
          </div>
          <span className="text-[11px] text-on-surface-variant">Auto Fallback</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onManagePolicies || (() => alert('Safe settings opening...'))}
        className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
      >
        <span className="material-symbols-outlined text-[15px]">settings</span>
        <span>Manage Multi-Sig Policies</span>
      </button>
    </div>
  );
};
