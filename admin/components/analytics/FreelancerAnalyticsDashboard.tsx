'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsApi } from '@/lib/api/adminApi';
import { FreelancerAnalyticsData } from '@/types/adminTypes';
import {
  Users,
  UserCheck,
  DollarSign,
  Award,
  Loader2,
  TrendingUp,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { AnalyticsTimeframeFilter } from './AnalyticsTimeframeFilter';
import { AnalyticsSubNav } from './AnalyticsSubNav';
import { AnalyticsAreaLineChart, AnalyticsBarChart, AnalyticsDoughnutChart } from './AnalyticsChart';

export function FreelancerAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('30d');

  const { data, isLoading, isError } = useQuery<FreelancerAnalyticsData>({
    queryKey: ['admin-analytics-freelancers', timeframe],
    queryFn: () => adminAnalyticsApi.getFreelancers(timeframe),
  });

  const timelineLabels = data?.timeline.map((t) => t.label) || [];
  const signupsData = data?.timeline.map((t) => t.signups) || [];
  const verifiedData = data?.timeline.map((t) => t.verified) || [];

  const rateLabels = data?.rateTiers.map((r) => r.label) || [];
  const rateCounts = data?.rateTiers.map((r) => r.count) || [];

  const earningsLabels = data?.earningsTiers.map((e) => e.label) || [];
  const earningsCounts = data?.earningsTiers.map((e) => e.count) || [];

  const earningsColors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto select-none">
      {/* 1. Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white flex items-center justify-center font-bold shadow-[0_3px_12px_-2px_rgba(139,92,246,0.4)]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#111827] tracking-tight">Freelancer Intelligence &amp; Performance</h1>
                <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full">
                  Talent Intelligence Live
                </span>
              </div>
              <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                Talent acquisition trends, rate distribution, earnings velocity, and high-earner cohorts.
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
          <span className="text-xs text-outline font-medium">Loading freelancer analytical models...</span>
        </div>
      ) : isError || !data ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold">
          Failed to load freelancer metrics. Please check network.
        </div>
      ) : (
        <>
          {/* 3. Top KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Registered Talent */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Registered Talent Pool</span>
                <div className="w-9 h-9 rounded-xl bg-[#f5f3ff] text-[#8b5cf6] border border-purple-500/20 flex items-center justify-center font-bold">
                  <Users className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#111827] leading-none">
                  {data.kpis.totalFreelancers.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                    <Sparkles className="h-3 w-3" />
                    <span>+{data.kpis.newFreelancersInPeriod} joined in this window</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Earnings */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Total Talent Earnings</span>
                <div className="w-9 h-9 rounded-xl bg-[#edfbf2] text-[#14a800] border border-emerald-500/20 flex items-center justify-center font-bold">
                  <DollarSign className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-emerald-600 leading-none">
                  ৳{data.kpis.totalEarningsPaid.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Cumulative lifetime payouts
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Hourly Rate */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Average Hourly Rate</span>
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] border border-amber-500/20 flex items-center justify-center font-bold">
                  <TrendingUp className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#111827] leading-none">
                  ৳{data.kpis.avgHourlyRate.toLocaleString()}
                  <span className="text-xs font-normal text-[#6b7280]">/hr</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Market competitive baseline
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Profile Completion */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Profile Completion</span>
                <div className="w-9 h-9 rounded-xl bg-[#edf2fe] text-[#3b82f6] border border-blue-500/20 flex items-center justify-center font-bold">
                  <Award className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-blue-600 leading-none">
                  {data.kpis.profileCompletionRate}%
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    Bio &amp; verified skills tagged
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Main Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Talent Registrations Timeline */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Freelancer Registrations &amp; Verifications
                  </h3>
                  <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                    Growth rate across the selected timeframe ({data.timeframe.toUpperCase()}).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#f5f3ff] px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                    <span className="text-[11px] font-bold text-violet-700">Signups</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#edfbf2] px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span className="text-[11px] font-bold text-[#14a800]">Verified</span>
                  </div>
                </div>
              </div>

              <AnalyticsAreaLineChart
                labels={timelineLabels}
                datasets={[
                  { label: 'New Signups', data: signupsData, color: '#8b5cf6' },
                  { label: 'Verified Accounts', data: verifiedData, color: '#10b981' },
                ]}
                height={280}
              />
            </div>

            {/* Chart 2: Hourly Rate Tiers */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Hourly Rate Distribution</h3>
                <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                  Freelancer supply count grouped by hourly billing rates.
                </p>
              </div>

              <AnalyticsBarChart
                labels={rateLabels}
                datasets={[
                  {
                    label: 'Freelancers Count',
                    data: rateCounts,
                    color: '#8b5cf6',
                  },
                ]}
                height={280}
              />
            </div>
          </div>

          {/* 5. Earnings Cohort & Top Earners Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Earnings Distribution */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Earnings Cohort Breakdown</h3>
                <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                  Proportion of freelancers achieving payout milestones.
                </p>

                <div className="mt-4">
                  <AnalyticsDoughnutChart
                    labels={earningsLabels}
                    data={earningsCounts}
                    colors={earningsColors}
                    height={210}
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-[#f0f2f5] text-xs">
                {data.earningsTiers.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f9fafb] transition-colors">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: earningsColors[idx % earningsColors.length] }}
                      />
                      <span className="font-medium text-[#4b5563]">{t.label}</span>
                    </div>
                    <span className="font-bold text-[#111827]">{t.count} talent</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Top Earners Leaderboard */}
            <div className="lg:col-span-2 bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#fef3c7] text-[#d97706] border border-amber-500/20 flex items-center justify-center font-bold">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">Top Earning Freelancers Leaderboard</h3>
                    <p className="text-[11px] text-[#6b7280] font-medium">
                      Highest platform revenue contributors and project champions.
                    </p>
                  </div>
                </div>
                <Link
                  href="/users/freelancers"
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
                      <th className="py-2.5 px-3">Freelancer</th>
                      <th className="py-2.5 px-3">Rating</th>
                      <th className="py-2.5 px-3">Hourly Rate</th>
                      <th className="py-2.5 px-3">Projects</th>
                      <th className="py-2.5 px-3 text-right">Total Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f5]">
                    {data.topEarners.map((fe, index) => {
                      const avatarColors = [
                        'bg-violet-100 text-violet-700',
                        'bg-emerald-100 text-emerald-700',
                        'bg-blue-100 text-blue-700',
                        'bg-amber-100 text-amber-700',
                        'bg-pink-100 text-pink-700',
                      ];
                      const avatarColor = avatarColors[index % avatarColors.length];
                      const initials = (fe.email || 'FL').substring(0, 2).toUpperCase();

                      return (
                        <tr key={fe.id} className="hover:bg-[#f9fafb] transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${avatarColor}`}>
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-[#111827] block truncate max-w-[180px]">
                                  {fe.email}
                                </span>
                                <span className="text-[11px] text-[#6b7280] truncate block max-w-[180px]">
                                  {fe.title || 'Freelancer'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="inline-flex items-center gap-1 bg-[#fffbeb] px-2 py-0.5 rounded-full text-amber-600 font-bold border border-amber-200">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{fe.rating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#111827]">
                            {fe.hourlyRate ? `৳${fe.hourlyRate}/hr` : '—'}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#111827]">
                            <span className="bg-[#edf2fe] text-blue-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
                              {fe.totalProjects} completed
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-[#14a800] text-sm">
                            ৳{fe.earnings.toLocaleString()}
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
