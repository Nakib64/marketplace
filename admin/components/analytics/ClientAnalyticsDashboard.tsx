'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsApi } from '@/lib/api/adminApi';
import { ClientAnalyticsData } from '@/types/adminTypes';
import {
  Building,
  DollarSign,
  Briefcase,
  Repeat,
  Loader2,
  TrendingUp,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { AnalyticsTimeframeFilter } from './AnalyticsTimeframeFilter';
import { AnalyticsSubNav } from './AnalyticsSubNav';
import { AnalyticsAreaLineChart, AnalyticsBarChart, AnalyticsDoughnutChart } from './AnalyticsChart';

export function ClientAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('30d');

  const { data, isLoading, isError } = useQuery<ClientAnalyticsData>({
    queryKey: ['admin-analytics-clients', timeframe],
    queryFn: () => adminAnalyticsApi.getClients(timeframe),
  });

  const timelineLabels = data?.timeline.map((t) => t.label) || [];
  const clientSignups = data?.timeline.map((t) => t.clientSignups) || [];
  const jobsPosted = data?.timeline.map((t) => t.jobsPosted) || [];

  const spendLabels = data?.spendTiers.map((s) => s.label) || [];
  const spendCounts = data?.spendTiers.map((s) => s.count) || [];

  const spendColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto select-none">
      {/* 1. Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white flex items-center justify-center font-bold shadow-[0_3px_12px_-2px_rgba(59,130,246,0.4)]">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#111827] tracking-tight">Client &amp; Employer Spend Intelligence</h1>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Enterprise Hirers Live
                </span>
              </div>
              <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                Client acquisition velocity, hiring repetition rates, spend tiers, and corporate accounts.
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
          <span className="text-xs text-outline font-medium">Loading client analytics models...</span>
        </div>
      ) : isError || !data ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold">
          Failed to fetch client metrics. Check backend connection.
        </div>
      ) : (
        <>
          {/* 3. Top KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Hirers */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Total Hirer Accounts</span>
                <div className="w-9 h-9 rounded-xl bg-[#edf2fe] text-[#3b82f6] border border-blue-500/20 flex items-center justify-center font-bold">
                  <Building className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#111827] leading-none">
                  {data.kpis.totalClients.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>+{data.kpis.newClientsInPeriod} new in this window</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Gross Client Spend */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Gross Client Spend</span>
                <div className="w-9 h-9 rounded-xl bg-[#edfbf2] text-[#14a800] border border-emerald-500/20 flex items-center justify-center font-bold">
                  <DollarSign className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-emerald-600 leading-none">
                  ৳{data.kpis.totalClientSpent.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Escrow &amp; funded milestones
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Avg Spend Per Client */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Average Client Value</span>
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] border border-amber-500/20 flex items-center justify-center font-bold">
                  <TrendingUp className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#111827] leading-none">
                  ৳{data.kpis.avgSpendPerClient.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Per registered employer account
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Repeat Hiring Rate */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Repeat Hiring Rate</span>
                <div className="w-9 h-9 rounded-xl bg-[#f5f3ff] text-[#8b5cf6] border border-purple-500/20 flex items-center justify-center font-bold">
                  <Repeat className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#7c3aed] leading-none">
                  {data.kpis.repeatHiringRate}%
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                    Clients posting 2+ job requisitions
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Main Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Client Signups vs Jobs Posted */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Client Onboarding &amp; Requisition Trajectory
                  </h3>
                  <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                    Employer account creation alongside posted project openings ({data.timeframe.toUpperCase()}).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#edf2fe] px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                    <span className="text-[11px] font-bold text-blue-700">Hirers</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#edfbf2] px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span className="text-[11px] font-bold text-[#14a800]">Job Posts</span>
                  </div>
                </div>
              </div>

              <AnalyticsAreaLineChart
                labels={timelineLabels}
                datasets={[
                  { label: 'Client Signups', data: clientSignups, color: '#3b82f6' },
                  { label: 'Job Postings', data: jobsPosted, color: '#10b981' },
                ]}
                height={280}
              />
            </div>

            {/* Chart 2: Client Spend Tiers Bar Chart */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Employer Spend Segmentation</h3>
                <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                  Categorization of client accounts by cumulative project capital spent.
                </p>
              </div>

              <AnalyticsBarChart
                labels={spendLabels}
                datasets={[
                  {
                    label: 'Client Accounts',
                    data: spendCounts,
                    color: '#3b82f6',
                  },
                ]}
                height={280}
              />
            </div>
          </div>

          {/* 5. Spend Segmentation Doughnut & Top Spenders Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Tier Share Distribution</h3>
                <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                  Proportion of Enterprise vs Growth accounts.
                </p>

                <div className="mt-4">
                  <AnalyticsDoughnutChart
                    labels={spendLabels}
                    data={spendCounts}
                    colors={spendColors}
                    height={210}
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-[#f0f2f5] text-xs">
                {data.spendTiers.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f9fafb] transition-colors">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: spendColors[idx % spendColors.length] }}
                      />
                      <span className="font-medium text-[#4b5563]">{t.label}</span>
                    </div>
                    <span className="font-bold text-[#111827]">{t.count} clients</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Spenders Table */}
            <div className="lg:col-span-2 bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#edf2fe] text-[#3b82f6] border border-blue-500/20 flex items-center justify-center font-bold">
                    <Building className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">Top Spending Employers &amp; Brands</h3>
                    <p className="text-[11px] text-[#6b7280] font-medium">
                      Highest capital deployment and enterprise clients.
                    </p>
                  </div>
                </div>
                <Link
                  href="/users/clients"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#14a800] hover:underline cursor-pointer"
                >
                  <span>Full Directory</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#eaecf0] text-[#6b7280] font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Company / Client</th>
                      <th className="py-2.5 px-3">Rating</th>
                      <th className="py-2.5 px-3">Jobs Posted</th>
                      <th className="py-2.5 px-3 text-right">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f5]">
                    {data.topSpenders.map((cl, index) => {
                      const avatarColors = [
                        'bg-blue-100 text-blue-700',
                        'bg-emerald-100 text-emerald-700',
                        'bg-violet-100 text-violet-700',
                        'bg-amber-100 text-amber-700',
                        'bg-pink-100 text-pink-700',
                      ];
                      const avatarColor = avatarColors[index % avatarColors.length];
                      const initials = (cl.companyName || cl.email || 'CL').substring(0, 2).toUpperCase();

                      return (
                        <tr key={cl.id} className="hover:bg-[#f9fafb] transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${avatarColor}`}>
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-[#111827] block truncate max-w-[200px]">
                                  {cl.companyName || 'Corporate Client'}
                                </span>
                                <span className="text-[11px] text-[#6b7280] truncate block max-w-[200px]">
                                  {cl.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="inline-flex items-center gap-1 bg-[#fffbeb] px-2 py-0.5 rounded-full text-amber-600 font-bold border border-amber-200">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{cl.rating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#111827]">
                            <span className="bg-[#edfbf2] text-[#14a800] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                              {cl.totalJobPosts} requisitions
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-[#14a800] text-sm">
                            ৳{cl.totalSpent.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
