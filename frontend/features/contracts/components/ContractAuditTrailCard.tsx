import React from 'react';

export const ContractAuditTrailCard: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">history</span>
          <h2 className="text-base font-bold text-on-surface">Milestone History</h2>
        </div>
        <span className="text-xs text-on-surface-variant">1 Completed</span>
      </div>

      <div className="bg-surface-container rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
            <span className="text-xs font-bold text-on-surface">Milestone 1: Approved</span>
            <span className="text-on-surface-variant text-[11px]">• Oct 04, 2024</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary text-[10px] font-medium self-start sm:self-auto">
            Payment Released
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-on-surface-variant">
          <span className="font-semibold text-on-surface">$2,500 USDC</span>
          <span>•</span>
          <span>Turnaround: 18h 40m</span>
        </div>
      </div>
    </div>
  );
};
