'use client';

import React from 'react';
import { toast } from 'sonner';
import { ContractDetail } from '../types/contractsTypes';

interface ContractVaultSidebarProps {
  contract?: ContractDetail;
  onMessageHirer: () => void;
}

export const ContractVaultSidebar: React.FC<ContractVaultSidebarProps> = ({ contract, onMessageHirer }) => {
  const amount = contract?.amount ?? 0;
  const released = contract?.releasedAmount ?? 0;
  const inEscrow = contract?.inEscrowAmount ?? amount;
  const currency = contract?.currency ?? 'BDT';
  const clientName = contract?.clientName || 'Client';
  const clientInitial = clientName.charAt(0).toUpperCase();
  const refCode = contract?.id ? `CTR-${contract.id.slice(0, 8).toUpperCase()}` : 'CTR-ESCROW';
  const releasedPct = amount > 0 ? Math.round((released / amount) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Protected Project Funds Card */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
            <h3 className="text-base font-bold text-on-surface">Protected Project Funds</h3>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
        </div>

        <div className="flex flex-col gap-2.5 bg-surface-container p-3.5 rounded-xl border border-outline-variant/20">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant">Total Project Value</span>
            <span className="text-sm font-bold text-on-surface">${amount.toLocaleString()} {currency}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden flex">
            <div className="h-full bg-primary transition-all" style={{ width: `${releasedPct}%` }} />
            <div className="h-full bg-surface-bright transition-all" style={{ width: `${100 - releasedPct}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-on-surface-variant flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Released
              </span>
              <span className="text-on-surface font-semibold block mt-0.5">${released.toLocaleString()} {currency}</span>
            </div>
            <div>
              <span className="text-on-surface-variant flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-surface-bright" /> In Escrow
              </span>
              <span className="text-on-surface font-semibold block mt-0.5">${inEscrow.toLocaleString()} {currency}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <span className="text-on-surface-variant font-medium">Payment Reference</span>
          <div className="flex items-center justify-between bg-surface-container px-3 py-2 rounded-xl border border-outline-variant/20 text-[11px]">
            <span className="text-on-surface font-mono truncate">{refCode}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(refCode);
                toast.success('Payment reference copied to clipboard');
              }}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
            </button>
          </div>
        </div>

        <div className="bg-surface-container/60 p-3 rounded-xl border border-outline-variant/20 flex items-center gap-2 text-xs">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">shield</span>
          <span className="text-on-surface-variant text-[11px] font-medium">
            Funds held securely until milestones are approved.
          </span>
        </div>
      </div>

      {/* 2. Counterparty Client Card */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-3.5">
        <div className="flex items-center gap-2 pb-1">
          <span className="material-symbols-outlined text-primary text-[18px]">corporate_fare</span>
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Client</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm border border-outline-variant/30">
            {clientInitial}
          </div>
          <div>
            <span className="text-sm font-bold text-on-surface block">{clientName}</span>
            <span className="text-[11px] text-on-surface-variant">Verified Client</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onMessageHirer}
          className="w-full py-2 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
          <span>Message Client</span>
        </button>
      </div>

      {/* 3. Contract Rules & SLA */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-1">
          <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Project Rules</h3>
        </div>
        <ul className="space-y-2.5 text-xs text-on-surface-variant">
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">hourglass_top</span>
            <div><strong className="text-on-surface">Review Window</strong>: {contract?.gracePeriodHours || 48}h inspection period upon milestone submission.</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">verified</span>
            <div><strong className="text-on-surface">Payment Protection</strong>: Client authorizes milestone payment upon approval.</div>
          </li>
        </ul>
      </div>
    </div>
  );
};
