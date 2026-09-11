'use client';

import React from 'react';
import { DisputeCaseDetail } from '../types/disputesTypes';

interface DisputeEconomicsSidebarProps {
  caseDetail: DisputeCaseDetail;
  onProposeSettlement: () => void;
}

export const DisputeEconomicsSidebar: React.FC<DisputeEconomicsSidebarProps> = ({
  caseDetail,
  onProposeSettlement,
}) => {
  return (
    <aside className="flex flex-col gap-4">
      {/* Juror Economics */}
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col gap-3 shadow-sm text-xs">
        <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">account_balance</span>
            <h3 className="text-sm font-bold text-on-surface">Juror Economics</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[10px]">
            PNK Staking
          </span>
        </div>

        <div className="flex flex-col gap-2 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-sans">Token Stake:</span>
            <span className="text-on-surface font-semibold">{caseDetail.pnkPerJuror} PNK / Juror</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-sans">Reward Pool:</span>
            <span className="text-on-surface font-semibold">{caseDetail.jurorRewardEth} ETH (~${caseDetail.jurorRewardUsd})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-sans">Surcharge:</span>
            <span className="text-on-surface font-semibold">${caseDetail.surchargeUsdc}.00 USDC</span>
          </div>
          <div className="pt-1.5 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-on-surface-variant font-sans">Consensus Progress:</span>
              <span className="text-primary font-bold">2 / 3 Committed</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full w-2/3" />
            </div>
          </div>
        </div>
      </div>

      {/* Potential Rulings */}
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col gap-3 shadow-sm text-xs">
        <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">flaky</span>
            <h3 className="text-sm font-bold text-on-surface">Potential Rulings</h3>
          </div>
          <span className="text-on-surface-variant text-[11px]">3 Options</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 flex flex-col gap-0.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between font-semibold text-on-surface">
              <span>Ruling 1: Reimburse Hirer</span>
              <span className="text-primary font-mono text-[11px]">100% Return</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight">Disburse full $3,500.00 USDC to Kroma Labs DAO treasury.</p>
          </div>

          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 flex flex-col gap-0.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between font-semibold text-on-surface">
              <span>Ruling 2: Pay Contractor</span>
              <span className="text-primary font-mono text-[11px]">100% Release</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight">Disburse $3,500.00 USDC to alexr.eth. Deliverable ruled conforming.</p>
          </div>

          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 flex flex-col gap-0.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between font-semibold text-on-surface">
              <span>Ruling 3: Split 50/50</span>
              <span className="text-primary font-mono text-[11px]">Equal Split</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight">Disburse $1,750.00 USDC each to Hirer and Contractor.</p>
          </div>
        </div>
      </div>

      {/* Emergency Actions & Invariant */}
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col gap-2.5 shadow-sm text-xs">
        <button
          type="button"
          onClick={onProposeSettlement}
          className="w-full py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-semibold flex items-center justify-center gap-1.5 border border-outline-variant/30 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">handshake</span>
          <span>Propose Mutual Settlement</span>
        </button>

        <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-start gap-2 text-[11px] text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">lock</span>
          <p className="leading-tight">
            Funds remain locked in ERC-792 vault until Kleros Merkle root executes on Arbitrum One.
          </p>
        </div>
      </div>
    </aside>
  );
};
