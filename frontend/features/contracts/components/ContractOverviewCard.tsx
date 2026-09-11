import React from 'react';
import { ContractDetail } from '../types/contractsTypes';

interface ContractOverviewCardProps {
  contract: ContractDetail;
}

export const ContractOverviewCard: React.FC<ContractOverviewCardProps> = ({ contract }) => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[26px]">hub</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-base font-bold text-on-surface truncate">{contract.clientName}</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-container text-primary font-mono text-[10px]">
                <span className="material-symbols-outlined text-[12px]">verified</span> DAO
              </span>
            </div>
            <span className="text-xs text-on-surface-variant block mt-0.5">{contract.title}</span>
          </div>
        </div>

        <div className="flex items-baseline sm:flex-col sm:items-end gap-1 bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/20">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Total Contract Value</span>
          <div className="flex items-center gap-1 font-mono">
            <span className="text-xl font-bold text-on-surface">${contract.amount.toLocaleString()}</span>
            <span className="text-xs text-primary font-bold">{contract.currency}</span>
          </div>
        </div>
      </div>

      {/* Metadata Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20 flex flex-col">
          <span className="text-[11px] text-on-surface-variant">Network</span>
          <span className="font-mono text-xs text-on-surface font-semibold flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            {contract.network}
          </span>
        </div>
        <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20 flex flex-col">
          <span className="text-[11px] text-on-surface-variant">Start Date</span>
          <span className="font-mono text-xs text-on-surface font-semibold mt-1">{contract.startDate}</span>
        </div>
        <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20 flex flex-col">
          <span className="text-[11px] text-on-surface-variant">Vault Security</span>
          <span className="font-mono text-xs text-on-surface font-semibold mt-1">{contract.multisigThreshold}</span>
        </div>
        <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20 flex flex-col">
          <span className="text-[11px] text-on-surface-variant">Automated Grace</span>
          <span className="font-mono text-xs text-on-surface font-semibold mt-1">{contract.gracePeriodHours} Hours</span>
        </div>
      </div>

      {/* Scope of Work */}
      <div className="bg-surface-container/60 p-3.5 rounded-xl border border-outline-variant/20 flex flex-col gap-1">
        <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Scope of Work</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">{contract.scopeOfWork}</p>
      </div>
    </div>
  );
};
