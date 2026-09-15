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
      {/* Case Summary */}
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col gap-3 shadow-sm text-xs">
        <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">gavel</span>
            <h3 className="text-sm font-bold text-on-surface">Case Summary</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary text-[10px] font-medium">
            In Mediation
          </span>
        </div>

        <div className="flex flex-col gap-2 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Disputed Amount:</span>
            <span className="text-on-surface font-semibold ">${caseDetail.surchargeUsdc ? (caseDetail.surchargeUsdc * 25).toLocaleString() : '3,500'}.00 USDC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Resolution Fee:</span>
            <span className="text-primary font-semibold">$0.00 (Covered)</span>
          </div>
          <div className="pt-1.5 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-on-surface-variant">Review Status:</span>
              <span className="text-primary font-bold">Evidence Under Review</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full w-2/3" />
            </div>
          </div>
        </div>
      </div>

      {/* Potential Outcomes */}
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col gap-3 shadow-sm text-xs">
        <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">balance</span>
            <h3 className="text-sm font-bold text-on-surface">Potential Outcomes</h3>
          </div>
          <span className="text-on-surface-variant text-[11px]">3 Outcomes</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 flex flex-col gap-0.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between font-semibold text-on-surface">
              <span>Outcome 1: Refund Client</span>
              <span className="text-primary  text-[11px]">Full Refund</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight">Disburse full funds back to the client account.</p>
          </div>

          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 flex flex-col gap-0.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between font-semibold text-on-surface">
              <span>Outcome 2: Release to Freelancer</span>
              <span className="text-primary  text-[11px]">Full Release</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight">Disburse milestone funds to freelancer if work is conforming.</p>
          </div>

          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 flex flex-col gap-0.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between font-semibold text-on-surface">
              <span>Outcome 3: Split 50/50</span>
              <span className="text-primary  text-[11px]">Equal Split</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight">Disburse 50% to client and 50% to freelancer.</p>
          </div>
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col gap-2.5 shadow-sm text-xs">
        <button
          type="button"
          onClick={onProposeSettlement}
          className="w-full py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-semibold flex items-center justify-center gap-1.5 border border-outline-variant/30 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">handshake</span>
          <span>Propose Mutual Settlement</span>
        </button>

        <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center gap-2 text-[11px] text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-[16px] shrink-0">shield</span>
          <span>Funds remain protected until resolution review completes.</span>
        </div>
      </div>
    </aside>
  );
};
