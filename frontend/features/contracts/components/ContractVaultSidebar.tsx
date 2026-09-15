'use client';

import React from 'react';
import { toast } from 'sonner';

interface ContractVaultSidebarProps {
  onMessageHirer: () => void;
}

export const ContractVaultSidebar: React.FC<ContractVaultSidebarProps> = ({ onMessageHirer }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* 1. Protected Project Funds Card */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
            <h3 className="text-base font-bold text-on-surface">Protected Project Funds</h3>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
        </div>

        <div className="flex flex-col gap-2.5 bg-surface-container p-3.5 rounded-lg border border-outline-variant/20">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant">Total Project Value</span>
            <span className=" text-sm font-bold text-on-surface">$8,500 USDC</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden flex">
            <div className="h-full bg-primary" style={{ width: '29.4%' }} />
            <div className="h-full bg-surface-bright" style={{ width: '70.6%' }} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]  pt-1">
            <div>
              <span className="text-on-surface-variant flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Released</span>
              <span className="text-on-surface font-semibold block mt-0.5">$2,500 USDC</span>
            </div>
            <div>
              <span className="text-on-surface-variant flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-surface-bright" /> Held Securely</span>
              <span className="text-on-surface font-semibold block mt-0.5">$6,000 USDC</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <span className="text-on-surface-variant">Payment Reference</span>
          <div className="flex items-center justify-between bg-surface-container px-3 py-2 rounded-lg border border-outline-variant/20  text-[11px]">
            <span className="text-on-surface truncate">PRJ-USDC-8500</span>
            <button type="button" onClick={() => toast.success('Copied payment reference to clipboard')} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
            </button>
          </div>
        </div>

        <div className="bg-surface-container/60 p-3 rounded-lg border border-outline-variant/20 flex items-center gap-2 text-xs">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">shield</span>
          <span className="text-on-surface-variant text-[11px] font-medium">
            Funds held securely until milestones are approved.
          </span>
        </div>
      </div>

      {/* 2. Counterparty Hirer Card */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
        <div className="flex items-center gap-2 pb-1">
          <span className="material-symbols-outlined text-primary text-[18px]">corporate_fare</span>
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Client</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm">
            KL
          </div>
          <div>
            <span className="text-sm font-bold text-on-surface block">Kroma Labs</span>
            <span className="text-[11px] text-on-surface-variant">Verified Client</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 bg-surface-container p-2.5 rounded-lg text-center  text-xs border border-outline-variant/20">
          <div><span className="font-bold text-primary block">98%</span><span className="text-[10px] text-on-surface-variant">Trust</span></div>
          <div><span className="font-bold text-on-surface block">14</span><span className="text-[10px] text-on-surface-variant">Completed</span></div>
          <div><span className="font-bold text-secondary block">0</span><span className="text-[10px] text-on-surface-variant">Disputes</span></div>
        </div>
        <button type="button" onClick={onMessageHirer} className="w-full py-2 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30 shadow-sm">
          <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
          <span>Message Client</span>
        </button>
      </div>

      {/* 3. Contract Rules & SLA */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-1">
          <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Project Rules</h3>
        </div>
        <ul className="space-y-2.5 text-xs text-on-surface-variant">
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">hourglass_top</span>
            <div><strong className="text-on-surface">48-Hour Review Window</strong>: Auto-approval occurs if no revision is requested within 48h.</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">verified</span>
            <div><strong className="text-on-surface">Payment Protection</strong>: Client authorizes payment upon milestone approval.</div>
          </li>
        </ul>
      </div>
    </div>
  );
};
