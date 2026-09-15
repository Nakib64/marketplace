import React from 'react';

export const ClientKpiGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Total In Protection</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">shield</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-on-surface tracking-tight">
            $48,200 <span className="text-on-surface-variant text-sm font-normal">USDC</span>
          </div>
          <div className="text-xs text-on-surface-variant pt-1">
            Across 4 active contracts
          </div>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Pending Review</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-on-surface tracking-tight">
            2 <span className="text-base text-on-surface-variant font-normal">Submissions</span>
          </div>
          <div className="text-xs text-on-surface-variant pt-1">
            Requires your approval
          </div>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Active Freelancers</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">group</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-on-surface tracking-tight">
            5 <span className="text-base text-on-surface-variant font-normal">Hired</span>
          </div>
          <div className="text-xs text-on-surface-variant pt-1">
            Working on deliverables
          </div>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Completion Rate</span>
          <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-on-surface tracking-tight">100%</div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-on-surface-variant">All projects on time</span>
            <span className=" text-xs text-on-surface flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px] text-primary">star</span>4.98
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

