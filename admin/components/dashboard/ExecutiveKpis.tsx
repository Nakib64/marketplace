'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsApi } from '@/lib/api/adminApi';
import { TrendingUp, DollarSign, ShieldAlert, Wallet } from 'lucide-react';

export function ExecutiveKpis() {
  const { data: treasury, isLoading } = useQuery({
    queryKey: ['admin-treasury'],
    queryFn: () => adminAnalyticsApi.getTreasury('30d'),
  });

  const kpis = [
    {
      label: 'Gross Escrow Volume (GMV)',
      value: treasury ? `৳${Number(treasury.grossVolume || 0).toLocaleString()}` : '৳0',
      change: '+14.2% this month',
      subtext: 'Cumulative contracts',
      icon: TrendingUp,
      progress: '78%',
    },
    {
      label: 'Platform Net Revenue (10%)',
      value: treasury ? `৳${Number(treasury.netRevenue || 0).toLocaleString()}` : '৳0',
      change: 'Captured upon settlement',
      subtext: 'Auto commission',
      icon: DollarSign,
      progress: '62%',
    },
    {
      label: 'Active Escrow (TVL)',
      value: treasury ? `৳${Number(treasury.activeEscrowTvl || 0).toLocaleString()}` : '৳0',
      change: 'Protected in locked vaults',
      subtext: 'Active milestones',
      icon: Wallet,
      progress: '85%',
    },
    {
      label: 'Pending Payout Liability',
      value: treasury ? `৳${Number(treasury.pendingWithdrawalLiability || 0).toLocaleString()}` : '৳0',
      change: 'Awaiting MFS dispatch',
      subtext: 'bKash & Nagad queue',
      icon: ShieldAlert,
      progress: '40%',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="rounded-xl bg-white p-5 border border-outline-variant flex flex-col justify-between shadow-2xs hover:border-primary transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                {kpi.label}
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                {isLoading ? (
                  <div className="h-8 w-28 animate-pulse rounded bg-surface-container" />
                ) : (
                  <>
                    <span className="text-2xl font-bold text-on-surface">{kpi.value}</span>
                    <span className="text-xs text-on-surface-variant font-medium">BDT</span>
                  </>
                )}
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-primary font-semibold">{kpi.change}</span>
                <span className="text-on-surface-variant">{kpi.subtext}</span>
              </div>
            </div>

            <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: kpi.progress }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
