'use client';

import React from 'react';
import { toast } from 'sonner';

interface FreelancerKpiGridProps {
  onWithdrawClick?: () => void;
}

export const FreelancerKpiGrid: React.FC<FreelancerKpiGridProps> = ({ onWithdrawClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">In Progress</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">hourglass_top</span>
        </div>
        <div>
          <div className="text-2xl font-bold text-on-surface tracking-tight ">
            $18,450 <span className="text-xs font-normal text-on-surface-variant">USDC</span>
          </div>
          <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>3 Active Contracts</span>
          </div>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Available Balance</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-2xl font-bold text-on-surface tracking-tight ">
              $6,200 <span className="text-xs font-normal text-on-surface-variant">USDC</span>
            </div>
            <div className="text-xs text-on-surface-variant mt-1">Ready for withdrawal</div>
          </div>
          <button
            type="button"
            onClick={onWithdrawClick || (() => toast.info('Opening withdrawal window...'))}
            className="px-3 py-1.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">south_west</span>
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Completed Contracts</span>
          <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface tracking-tight ">38</span>
            <span className="text-xs text-primary font-semibold">100% Success</span>
          </div>
          <div className="text-xs text-on-surface-variant mt-1">All completed on time</div>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Client Rating</span>
          <div className="flex items-center gap-0.5 text-primary">
            <span className="material-symbols-outlined text-[16px]">star</span>
            <span className=" text-xs font-bold">5.0</span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-on-surface tracking-tight ">
            5.0 <span className="text-xs font-normal text-on-surface-variant">/ 5.0</span>
          </div>
          <div className="text-xs text-on-surface-variant mt-1">Based on 38 reviews</div>
        </div>
      </div>
    </div>
  );
};

