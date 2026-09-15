import React, { useMemo } from 'react';
import { Job } from '@/features/jobs/types/jobsTypes';

interface ClientKpiGridProps {
  jobs?: Job[];
}

export const ClientKpiGrid: React.FC<ClientKpiGridProps> = ({ jobs = [] }) => {
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'OPEN').length;
    const inProgressJobs = jobs.filter((j) => j.status === 'IN_PROGRESS').length;
    const completedJobs = jobs.filter((j) => j.status === 'COMPLETED').length;

    const totalProposals = jobs.reduce((acc, j) => {
      return acc + (j._count?.proposals || 0);
    }, 0);

    const totalBudgetCommitted = jobs
      .filter((j) => j.status === 'OPEN' || j.status === 'IN_PROGRESS')
      .reduce((acc, j) => acc + Number(j.budget || 0), 0);

    return {
      totalJobs,
      activeJobs,
      inProgressJobs,
      completedJobs,
      totalProposals,
      totalBudgetCommitted,
    };
  }, [jobs]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1: Active Budget / Committed Funds */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Active Escrow Budget</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">lock</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-extrabold text-on-surface tracking-tight">
            ৳{stats.totalBudgetCommitted.toLocaleString()} <span className="text-on-surface-variant text-sm font-normal">BDT</span>
          </div>
          <div className="text-xs text-on-surface-variant pt-1">
            Across {stats.activeJobs + stats.inProgressJobs} active listings &amp; contracts
          </div>
        </div>
      </div>

      {/* KPI 2: Active Job Listings */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Active Job Posts</span>
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">work</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-extrabold text-on-surface tracking-tight">
            {stats.activeJobs} <span className="text-sm text-on-surface-variant font-normal">Open Listings</span>
          </div>
          <div className="text-xs text-on-surface-variant pt-1">
            Accepting candidate bids
          </div>
        </div>
      </div>

      {/* KPI 3: Total Candidate Proposals */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Candidate Proposals</span>
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">group</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-extrabold text-on-surface tracking-tight">
            {stats.totalProposals} <span className="text-sm text-on-surface-variant font-normal">Bids Received</span>
          </div>
          <div className="text-xs text-on-surface-variant pt-1">
            Across all job RFPs
          </div>
        </div>
      </div>

      {/* KPI 4: Total Postings & Completed */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">All-Time Postings</span>
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-extrabold text-on-surface tracking-tight">
            {stats.totalJobs} <span className="text-sm text-on-surface-variant font-normal">Created</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-on-surface-variant">{stats.completedJobs} completed contracts</span>
            <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">check_circle</span> 100% Escrow
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
