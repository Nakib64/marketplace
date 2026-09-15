'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { jobsApi } from '@/features/jobs/api/jobsApi';

export const ClientVaultHealthWidget: React.FC = () => {
  const { data: myJobs = [] } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => jobsApi.getMyJobs(),
    staleTime: 30_000,
  });

  const activeEscrowBalance = myJobs
    .filter((j) => j.status === 'OPEN' || j.status === 'IN_PROGRESS')
    .reduce((acc, j) => acc + Number(j.budget || 0), 0);

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">security</span>
          <h3 className="text-base font-bold text-on-surface">Payment Protection</h3>
        </div>
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      </div>

      <div className="bg-surface-container rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Protection Status</span>
          <span className="text-primary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            100% Secured
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-on-surface-variant">Active Escrow Value</span>
          <span className="text-lg font-bold text-on-surface">
            ৳{activeEscrowBalance.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">BDT</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
          <span className="font-medium text-on-surface">Funds released only upon your approval</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary shrink-0">lock</span>
          <span className="font-medium text-on-surface">Protected against unauthorized charges</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => toast.info('All payments are covered by 100% Banglance escrow protection guarantee.')}
        className="w-full px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-outline-variant/30 shadow-sm"
      >
        <span className="material-symbols-outlined text-[16px]">info</span>
        <span>How Protection Works</span>
      </button>
    </div>
  );
};
