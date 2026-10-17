'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsApi } from '@/lib/api/adminApi';
import { JobAnalyticsData } from '@/types/adminTypes';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  Loader2,
  TrendingUp,
  FolderTree,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { AnalyticsTimeframeFilter } from './AnalyticsTimeframeFilter';
import { AnalyticsSubNav } from './AnalyticsSubNav';
import { AnalyticsAreaLineChart, AnalyticsBarChart } from './AnalyticsChart';

export function JobAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('30d');

  const { data, isLoading, isError } = useQuery<JobAnalyticsData>({
    queryKey: ['admin-analytics-jobs', timeframe],
    queryFn: () => adminAnalyticsApi.getJobs(timeframe),
  });

  const timelineLabels = data?.timeline.map((t) => t.label) || [];
  const createdData = data?.timeline.map((t) => t.created) || [];
  const completedData = data?.timeline.map((t) => t.completedOrHired) || [];

  const statusLabels = data?.statusBreakdown.map((s) => s.status) || [];
  const statusCounts = data?.statusBreakdown.map((s) => s.count) || [];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto select-none">
      {/* 1. Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white flex items-center justify-center font-bold shadow-[0_3px_12px_-2px_rgba(245,158,11,0.4)]">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#111827] tracking-tight">Job Postings &amp; Requisition Analytics</h1>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Requisition Flow Live
                </span>
              </div>
              <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                Employer hiring demand, project fill velocities, status segmentation, and category capital.
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
          <span className="text-xs text-outline font-medium">Aggregating job posting analytics...</span>
        </div>
      ) : isError || !data ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold">
          Failed to fetch job posting analytics. Check backend connection.
        </div>
      ) : (
        <>
          {/* 3. Top KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Jobs In Window */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Jobs In Window</span>
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] border border-amber-500/20 flex items-center justify-center font-bold">
                  <Briefcase className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#111827] leading-none">
                  {data.kpis.totalJobs.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#14a800] bg-[#eaf8ea] px-2 py-0.5 rounded-full">
                    {data.kpis.openJobs} Open
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    {data.kpis.inProgressJobs} Active
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Avg Job Budget */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Average Job Budget</span>
                <div className="w-9 h-9 rounded-xl bg-[#edfbf2] text-[#14a800] border border-emerald-500/20 flex items-center justify-center font-bold">
                  <DollarSign className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-emerald-600 leading-none">
                  ৳{data.kpis.avgJobBudget.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Across all active categories
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Fill Rate */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Contract Fill Rate</span>
                <div className="w-9 h-9 rounded-xl bg-[#edf2fe] text-[#3b82f6] border border-blue-500/20 flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-blue-600 leading-none">
                  {data.kpis.completionRate}%
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    Successful hire conversion
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Moderation Risk */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-red-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Moderation Risk</span>
                <div className="w-9 h-9 rounded-xl bg-[#fef2f2] text-[#ef4444] border border-red-500/20 flex items-center justify-center font-bold">
                  <AlertTriangle className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-red-600 leading-none">
                  {data.kpis.flaggedCount}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Link
                    href="/jobs/flagged"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full hover:underline"
                  >
                    <span>Inspect flagged queue</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Main Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Job Creation vs Completion */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Job Creation vs Contract Inception
                  </h3>
                  <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                    Requisitions posted compared to funded freelancer hires ({data.timeframe.toUpperCase()}).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#fef3c7] px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    <span className="text-[11px] font-bold text-amber-700">Created</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#edfbf2] px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span className="text-[11px] font-bold text-[#14a800]">Hired</span>
                  </div>
                </div>
              </div>

              <AnalyticsAreaLineChart
                labels={timelineLabels}
                datasets={[
                  { label: 'Jobs Created', data: createdData, color: '#f59e0b' },
                  { label: 'Hired / In Progress', data: completedData, color: '#10b981' },
                ]}
                height={280}
              />
            </div>

            {/* Chart 2: Job Status Segmentation */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Job Lifecycle Status Breakdown</h3>
                <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                  Proportion of requisitions in open bidding, active contract, and completion.
                </p>
              </div>

              <AnalyticsBarChart
                labels={statusLabels}
                datasets={[
                  {
                    label: 'Jobs Count',
                    data: statusCounts,
                    color: '#3b82f6',
                  },
                ]}
                height={280}
              />
            </div>
          </div>

          {/* 5. Category Requisition Breakdown Table */}
          <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#edfbf2] text-[#14a800] border border-emerald-500/20 flex items-center justify-center font-bold">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">Category Demand &amp; Budget Allocation</h3>
                  <p className="text-[11px] text-[#6b7280] font-medium">
                    Total project count and aggregated employer capital deployed by category.
                  </p>
                </div>
              </div>
              <Link
                href="/categories"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#14a800] hover:underline cursor-pointer"
              >
                <span>Taxonomy Tree</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#eaecf0] text-[#6b7280] font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Industry Domain</th>
                    <th className="py-2.5 px-3">Jobs Posted</th>
                    <th className="py-2.5 px-3">Average Job Budget</th>
                    <th className="py-2.5 px-3 text-right">Aggregated Category Capital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5]">
                  {data.categoryBreakdown.map((cat, idx) => {
                    const domainColors = [
                      'bg-emerald-50 text-[#14a800] border-emerald-200',
                      'bg-blue-50 text-blue-700 border-blue-200',
                      'bg-violet-50 text-violet-700 border-violet-200',
                      'bg-amber-50 text-amber-700 border-amber-200',
                      'bg-pink-50 text-pink-700 border-pink-200',
                    ];
                    const colorStyle = domainColors[idx % domainColors.length];

                    return (
                      <tr key={cat.id} className="hover:bg-[#f9fafb] transition-colors">
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${colorStyle}`}>
                            {cat.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-[#111827]">
                          <span className="bg-[#f3f4f6] text-[#374151] px-2 py-0.5 rounded-full text-[11px] font-bold">
                            {cat.count} jobs
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-[#111827]">
                          ৳{cat.avgBudget.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-[#14a800] text-sm">
                          ৳{cat.volume.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
