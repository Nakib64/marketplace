import React from 'react';

export const ClientKpiGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Total Escrow Committed</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">lock</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-on-surface tracking-tight">
            $48,200 <span className="text-on-surface-variant text-sm font-normal">USDC</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-on-surface-variant">Across 4 contracts</span>
            <span className="font-mono text-xs text-primary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>+12.4%
            </span>
          </div>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Awaiting Hirer Review</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-on-surface tracking-tight">
            2 <span className="text-base text-on-surface-variant font-normal">Deliverables</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-on-surface-variant">Requires multisig</span>
            <span className="font-mono text-xs text-on-surface px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/30">
              38h grace left
            </span>
          </div>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Active Freelancers Hired</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">group</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-on-surface tracking-tight">
            5 <span className="text-base text-on-surface-variant font-normal">Engineers</span>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-on-surface-variant">
            <span>4 Arbitrum One</span>
            <span>1 Optimism</span>
          </div>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Protocol Settlement Rate</span>
          <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-on-surface tracking-tight">100%</div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-on-surface-variant">14 settled · 0 dispute</span>
            <span className="font-mono text-xs text-on-surface flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px] text-primary">star</span>4.98
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
