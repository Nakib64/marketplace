'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsApi } from '@/lib/api/adminApi';
import { ShieldCheck, AlertTriangle, Layers, Percent } from 'lucide-react';

export function LiquidityHealth() {
  const { data: liquidity, isLoading } = useQuery({
    queryKey: ['admin-liquidity'],
    queryFn: () => adminAnalyticsApi.getLiquidity(),
  });

  const ratio = liquidity?.solvencyRatio || 100;
  const isHealthy = ratio >= 100;

  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-4 mb-5 gap-3">
        <div>
          <h2 className="text-sm font-bold text-on-surface tracking-wide uppercase flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Treasury Solvency & Reserve Buffer
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Real-time MFS reserve vs active user balance liabilities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold block mb-1">
            Total System Balance
          </span>
          <span className="text-xl font-bold text-on-surface">
            {isLoading ? '...' : `৳${Number(liquidity?.totalUserBalance || 0).toLocaleString()}`}
          </span>
          <span className="text-[11px] text-outline block mt-1">Client + Freelancer Wallets</span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold block mb-1">
            Gateway Reserve Pool
          </span>
          <span className="text-xl font-bold text-primary">
            {isLoading ? '...' : `৳${Number(liquidity?.gatewayReserve || 0).toLocaleString()}`}
          </span>
          <span className="text-[11px] text-outline block mt-1">SSLCommerz Settlement Holding</span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold block mb-1">
            Solvency Coverage Ratio
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${isHealthy ? 'text-primary' : 'text-error'}`}>
              {isLoading ? '...' : `${Number(ratio).toFixed(1)}%`}
            </span>
            <Percent className="h-4 w-4 text-outline" />
          </div>
          <span className="text-[11px] text-outline block mt-1">Reserve / Liabilities Ratio</span>
        </div>
      </div>
    </div>
  );
}
