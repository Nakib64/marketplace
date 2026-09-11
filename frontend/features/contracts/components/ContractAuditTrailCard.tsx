import React from 'react';

export const ContractAuditTrailCard: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
          <h2 className="text-base font-bold text-on-surface">Submission History &amp; Immutable Audit Trail</h2>
        </div>
        <span className="font-mono text-xs text-on-surface-variant">1 Release Event</span>
      </div>

      <div className="bg-surface-container rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
            <span className="text-xs font-bold text-on-surface">Milestone 1 Deliverable: Approved</span>
            <span className="text-on-surface-variant text-[11px] font-mono">• Oct 04, 2024</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[10px] self-start sm:self-auto">
            2/3 Signatures Verified
          </span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Kroma Labs multisig signer quorum reached. Architecture specification approved and $2,500 USDC smart release transaction executed autonomously.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-on-surface-variant">
          <span className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[13px]">link</span>
            Tx: 0x4f81...fb12
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">description</span>
            IPFS: bafybeih4j...399z
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">timer</span>
            Turnaround: 18h 40m
          </span>
        </div>
      </div>
    </div>
  );
};
