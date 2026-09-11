import React from 'react';

export const MilestoneSecurityReportCard: React.FC = () => {
  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
          <h3 className="text-sm font-bold text-on-surface">Automated Static Security &amp; Slither Report</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
          Pre-Release Verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[15px]">check</span>
            <span className="text-xs font-semibold">Reentrancy Shield</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-normal">
            NonReentrant OpenZeppelin v5 verified across pool interactions.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[15px]">check</span>
            <span className="text-xs font-semibold">Arithmetic Security</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-normal">
            Solidity 0.8.24 native checked arithmetic, 0 unchecked blocks.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[15px]">check</span>
            <span className="text-xs font-semibold">Slither CI Clean</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-normal">
            0 High, 0 Medium findings detected across 14 contract files.
          </p>
        </div>
      </div>
    </div>
  );
};
