'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsApi } from '@/lib/api/adminApi';
import { OverviewAnalyticsData } from '@/types/adminTypes';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Loader2,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Wallet,
  Receipt,
} from 'lucide-react';
import { AnalyticsTimeframeFilter } from './AnalyticsTimeframeFilter';
import { AnalyticsSubNav } from './AnalyticsSubNav';
import { AnalyticsAreaLineChart, AnalyticsDoughnutChart } from './AnalyticsChart';

export function ExecutiveOverviewDashboard() {
  const [timeframe, setTimeframe] = useState('30d');

  const { data, isLoading, isError } = useQuery<OverviewAnalyticsData>({
    queryKey: ['admin-analytics-overview', timeframe],
    queryFn: () => adminAnalyticsApi.getOverview(timeframe),
  });

  const timelineLabels = data?.timeline.map((t) => t.label) || [];
  const gmvData = data?.timeline.map((t) => t.gmv) || [];
  const revenueData = data?.timeline.map((t) => t.netRevenue) || [];

  const categoryLabels = data?.categoryDistribution.map((c) => c.name) || [];
  const categoryCounts = data?.categoryDistribution.map((c) => c.jobsCount) || [];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto select-none">
      {/* 1. Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#14a800] to-[#00b377] text-white flex items-center justify-center font-bold shadow-[0_3px_12px_-2px_rgba(20,168,0,0.4)]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#111827] tracking-tight">Executive Market Radar</h1>
                <span className="text-[10px] font-bold text-[#14a800] bg-[#eaf8ea] px-2.5 py-0.5 rounded-full">
                  Real-time Telemetry
                </span>
              </div>
              <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                Cross-platform gross liquidity, contract volume, and marketplace transaction velocity.
              </p>
            </div>
          </div>
        </div>

        <AnalyticsTimeframeFilter value={timeframe} onChange={setTimeframe} />
      </div>

      {/* 2. Sub Nav */}
      <AnalyticsSubNav />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border border-[#eaecf0]">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-outline font-medium">Aggregating marketplace intelligence...</span>
        </div>
      ) : isError || !data ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold">
          Failed to fetch executive analytics. Please check backend connection.
        </div>
      ) : (
        <>
          {/* 3. Colorful KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: GMV */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-[#14a800]/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Gross Marketplace Volume</span>
                <div className="w-9 h-9 rounded-xl bg-[#edfbf2] text-[#14a800] border border-emerald-500/20 flex items-center justify-center font-bold">
                  <DollarSign className="h-4.5 w-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#111827] leading-none">
                  ৳{data.kpis.grossVolume.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#16a34a] bg-[#eaf8ea] px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>100% Escrow Funded</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Net Commission */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Net Platform Commission</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-4.5 w-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-emerald-600 leading-none">
                  ৳{data.kpis.netRevenue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Standard 10% take-rate
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Active Jobs */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Total Active Jobs</span>
                <div className="w-9 h-9 rounded-xl bg-[#edf2fe] text-[#3b82f6] border border-blue-500/20 flex items-center justify-center font-bold">
                  <Briefcase className="h-4.5 w-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#111827] leading-none">
                  {data.kpis.totalJobs.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-[#3b82f6] bg-[#edf2fe] px-2 py-0.5 rounded-full">
                    {data.kpis.activeContractsCount} Funded Contracts
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Marketplace Pool */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Marketplace Pool</span>
                <div className="w-9 h-9 rounded-xl bg-[#f5f3ff] text-[#8b5cf6] border border-purple-500/20 flex items-center justify-center font-bold">
                  <Users className="h-4.5 w-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#111827] leading-none">
                  {data.kpis.totalUsers.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                    {data.kpis.totalFreelancers} Talent
                  </span>
                  <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    {data.kpis.totalClients} Hirers
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Colorful Main Chart + Category Share */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Gross Marketplace Volume (GMV) vs Net Revenue
                  </h3>
                  <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                    Continuous transaction trajectory across the selected timeframe ({data.timeframe.toUpperCase()}).
                  </p>
                </div>

                {/* Inline Stats Ribbon */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#edf2fe] text-[#3b82f6] flex items-center justify-center font-bold">
                      <Wallet className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-bold text-[#111827]">
                      ৳{data.kpis.grossVolume.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#edfbf2] text-[#14a800] flex items-center justify-center font-bold">
                      <Receipt className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600">
                      ৳{data.kpis.netRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <AnalyticsAreaLineChart
                labels={timelineLabels}
                datasets={[
                  {
                    label: 'Gross Volume (৳)',
                    data: gmvData,
                    color: '#14a800',
                  },
                  {
                    label: 'Net Platform Fee (৳)',
                    data: revenueData,
                    color: '#3b82f6',
                  },
                ]}
                currency={true}
                height={320}
              />
            </div>

            {/* Category Share */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">Industry Domain Share</h3>
                    <p className="text-[11px] text-[#6b7280] font-medium">Job concentration across sectors.</p>
                  </div>
                </div>

                <div className="mt-4">
                  {categoryCounts.length > 0 ? (
                    <AnalyticsDoughnutChart
                      labels={categoryLabels}
                      data={categoryCounts}
                      colors={[
                        '#14a800',
                        '#3b82f6',
                        '#8b5cf6',
                        '#f59e0b',
                        '#ec4899',
                        '#06b6d4',
                      ]}
                      height={240}
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center text-xs text-outline font-medium">
                      No category distribution data for this window.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#f1f3f5] space-y-1.5">
                {data.categoryDistribution.slice(0, 4).map((c, idx) => {
                  const colors = ['bg-[#14a800]', 'bg-[#3b82f6]', 'bg-[#8b5cf6]', 'bg-[#f59e0b]'];
                  return (
                    <div key={c.id} className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
                        <span className="text-[#374151] truncate max-w-[130px]">{c.name}</span>
                      </div>
                      <span className="text-[#111827] font-bold">{c.jobsCount} jobs</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
