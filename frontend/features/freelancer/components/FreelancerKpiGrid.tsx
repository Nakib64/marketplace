'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { contractsApi } from '@/features/contracts/api/contractsApi';
import { walletApi } from '@/features/wallet/api/walletApi';
import { RawBackendContract } from '@/features/contracts/types/contractsTypes';

interface FreelancerKpiGridProps {
  onWithdrawClick?: () => void;
}

export const FreelancerKpiGrid: React.FC<FreelancerKpiGridProps> = ({ onWithdrawClick }) => {
  const user = useAuthStore((state) => state.user);

  const { data: rawContracts = [] } = useQuery({
    queryKey: ['user-contracts'],
    queryFn: () => contractsApi.getUserContracts(),
    staleTime: 30_000,
  });

  const { data: walletData } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => walletApi.getWalletBalance().catch(() => ({ walletBalance: 0 })),
    staleTime: 30_000,
  });

  const contracts = rawContracts as unknown as RawBackendContract[];

  const stats = useMemo(() => {
    const inProgressContracts = contracts.filter((c) => c.status === 'FUNDED' || c.status === 'PENDING_APPROVAL');
    const inProgressAmount = inProgressContracts.reduce((acc, c) => acc + Number(c.escrowAmount || c.amount || 0), 0);
    const completedCount = contracts.filter((c) => c.status === 'COMPLETED').length;
    const walletBalance = Number(walletData?.walletBalance || 0);
    const rating = user?.freelancerProfile?.rating ? Number(user.freelancerProfile.rating).toFixed(1) : '5.0';

    return {
      inProgressCount: inProgressContracts.length,
      inProgressAmount,
      completedCount,
      walletBalance,
      rating,
      totalReviews: user?.freelancerProfile?.totalReviews || 0,
    };
  }, [contracts, user, walletData]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1: In Escrow / Progress */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">In Active Escrow</span>
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-on-surface tracking-tight">
            ৳{stats.inProgressAmount.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">BDT</span>
          </div>
          <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>{stats.inProgressCount} Active Contracts</span>
          </div>
        </div>
      </div>

      {/* KPI 2: Available Wallet Balance */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Available Balance</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-2xl font-extrabold text-on-surface tracking-tight">
              ৳{stats.walletBalance.toLocaleString()}
            </div>
            <div className="text-xs text-on-surface-variant mt-1">Ready for withdrawal</div>
          </div>
          <button
            type="button"
            onClick={onWithdrawClick || (() => toast.info('Open withdrawal modal in wallet section.'))}
            className="px-3 py-1.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">south_west</span>
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* KPI 3: Completed Contracts */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Completed Projects</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-on-surface tracking-tight">{stats.completedCount}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">100% Escrow Settled</span>
          </div>
          <div className="text-xs text-on-surface-variant mt-1">Verified work history</div>
        </div>
      </div>

      {/* KPI 4: Reputation & Rating */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Client Rating</span>
          <div className="flex items-center gap-0.5 text-primary">
            <span className="material-symbols-outlined text-[16px]">star</span>
            <span className="text-xs font-bold">{stats.rating}</span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-on-surface tracking-tight">
            {stats.rating} <span className="text-xs font-normal text-on-surface-variant">/ 5.0</span>
          </div>
          <div className="text-xs text-on-surface-variant mt-1">
            {stats.totalReviews > 0 ? `Based on ${stats.totalReviews} reviews` : 'New verified talent'}
          </div>
        </div>
      </div>
    </div>
  );
};
