import React from 'react';
import { DisputeMetrics } from '../types/disputesTypes';

interface DisputeKpiGridProps {
  metrics: DisputeMetrics;
}

export const DisputeKpiGrid: React.FC<DisputeKpiGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Active Requests</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
        </div>
        <div className="my-2">
          <span className="text-2xl font-bold text-on-surface ">{metrics.activeCount} In Review</span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[16px] text-primary">support_agent</span>
          <span>Support mediation active</span>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Resolved Cases</span>
          <span className="material-symbols-outlined text-outline text-[18px]">task_alt</span>
        </div>
        <div className="my-2">
          <span className="text-2xl font-bold text-on-surface ">{metrics.resolvedCount} Resolved</span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
          <span>100% Successfully Settled</span>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Value in Review</span>
          <span className="material-symbols-outlined text-outline text-[18px]">lock</span>
        </div>
        <div className="my-2">
          <span className="text-2xl font-bold text-on-surface ">
            ${metrics.totalDisputedUsdc.toLocaleString()} <span className="text-xs text-on-surface-variant font-normal font-sans">USDC</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs">
          <span>Protected until resolution</span>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Average Turnaround</span>
          <span className="material-symbols-outlined text-outline text-[18px]">timer</span>
        </div>
        <div className="my-2">
          <span className="text-2xl font-bold text-on-surface ">{metrics.avgTurnaroundDays} Days</span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[16px] text-primary">speed</span>
          <span>Fast resolution timeframe</span>
        </div>
      </div>
    </div>
  );
};
