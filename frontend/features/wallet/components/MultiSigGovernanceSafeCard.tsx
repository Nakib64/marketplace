'use client';

import React from 'react';
import { toast } from 'sonner';

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
          <h3 className="text-sm font-bold text-on-surface">Payment Protection</h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-surface-container text-primary text-xs font-semibold">
          Guaranteed
        </span>
      </div>

      <div className="flex flex-col gap-2.5 text-xs">
        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">lock</span>
          <div>
            <span className="font-semibold text-on-surface block">Safe Storage</span>
            <span className="text-[11px] text-on-surface-variant">Funds are securely reserved until milestone delivery</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
          <div>
            <span className="font-semibold text-on-surface block">Client Approval</span>
            <span className="text-[11px] text-on-surface-variant">Freelancer is paid only after you review and approve the work</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">verified_user</span>
          <div>
            <span className="font-semibold text-on-surface block">Refund Protection</span>
            <span className="text-[11px] text-on-surface-variant">Eligible for a full refund if agreed work is not delivered</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onManagePolicies || (() => toast.info('All contracts are backed by 100% Banglance Protection.'))}
        className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
      >
        <span className="material-symbols-outlined text-[15px]">info</span>
        <span>How Protection Works</span>
      </button>
    </div>
  );
};

