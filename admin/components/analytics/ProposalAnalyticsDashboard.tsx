'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsApi } from '@/lib/api/adminApi';
import { ProposalAnalyticsData } from '@/types/adminTypes';
import {
  FileText,
  CheckCircle2,
  Percent,
  DollarSign,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Scale,
  Award,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AnalyticsTimeframeFilter } from './AnalyticsTimeframeFilter';
import { AnalyticsSubNav } from './AnalyticsSubNav';
import { AnalyticsAreaLineChart, AnalyticsBarChart, AnalyticsDoughnutChart } from './AnalyticsChart';

export function ProposalAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('30d');

  const { data, isLoading, isError } = useQuery<ProposalAnalyticsData>({
    queryKey: ['admin-analytics-proposals', timeframe],
    queryFn: () => adminAnalyticsApi.getProposals(timeframe),
  });

  const timelineLabels = data?.timeline.map((t) => t.label) || [];
  const submittedData = data?.timeline.map((t) => t.submitted) || [];
  const acceptedData = data?.timeline.map((t) => t.accepted) || [];

  const ratioLabels = data?.bidRatioDistribution.map((r) => r.label) || [];
  const ratioCounts = data?.bidRatioDistribution.map((r) => r.count) || [];

  const statusLabels = data?.statusBreakdown.map((s) => s.label) || [];
  const statusCounts = data?.statusBreakdown.map((s) => s.count) || [];
  const statusColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto select-none">
      {/* 1. Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#be185d] text-white flex items-center justify-center font-bold shadow-[0_3px_12px_-2px_rgba(236,72,153,0.4)]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#111827] tracking-tight">Proposals &amp; Bid Dynamics Intelligence</h1>
                <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full">
                  Bidding Liquidity Live
                </span>
              </div>
              <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                Freelancer pitch volume, hiring conversion rates, bid price distributions, and client selection speed.
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
          <span className="text-xs text-outline font-medium">Aggregating proposal intelligence...</span>
        </div>
      ) : isError || !data ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold">
          Failed to fetch proposal analytics. Check backend connection.
        </div>
      ) : (
        <>
          {/* 3. Top KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Proposals Submitted */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-pink-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Proposals Submitted</span>
                <div className="w-9 h-9 rounded-xl bg-[#fdf2f8] text-[#db2777] border border-pink-500/20 flex items-center justify-center font-bold">
                  <FileText className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#111827] leading-none">
                  {data.kpis.totalProposals.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">
                    <Sparkles className="h-3 w-3" />
                    <span>{data.kpis.acceptedCount} successfully hired</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Acceptance Win Rate */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Acceptance Win Rate</span>
                <div className="w-9 h-9 rounded-xl bg-[#edfbf2] text-[#14a800] border border-emerald-500/20 flex items-center justify-center font-bold">
                  <Percent className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-emerald-600 leading-none">
                  {data.kpis.acceptanceRate}%
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Proposals converted into contracts
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Competition Ratio */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Competition Ratio</span>
                <div className="w-9 h-9 rounded-xl bg-[#edf2fe] text-[#3b82f6] border border-blue-500/20 flex items-center justify-center font-bold">
                  <Scale className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-blue-600 leading-none">
                  {data.kpis.avgProposalsPerJob}
                  <span className="text-xs font-normal text-[#6b7280]"> / job</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    Healthy talent density
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Average Bid Value */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Average Bid Value</span>
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] border border-amber-500/20 flex items-center justify-center font-bold">
                  <DollarSign className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#d97706] leading-none">
                  ৳{data.kpis.avgBidAmount.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Average freelancer offer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Main Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Proposals Submitted vs Accepted */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Proposal Submission &amp; Contract Acceptance
                  </h3>
                  <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                    Bids lodged by freelancers compared to client approvals ({data.timeframe.toUpperCase()}).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#fdf2f8] px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#ec4899]" />
                    <span className="text-[11px] font-bold text-pink-700">Submitted</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#edfbf2] px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span className="text-[11px] font-bold text-[#14a800]">Accepted</span>
                  </div>
                </div>
              </div>

              <AnalyticsAreaLineChart
                labels={timelineLabels}
                datasets={[
                  { label: 'Proposals Submitted', data: submittedData, color: '#ec4899' },
                  { label: 'Proposals Accepted', data: acceptedData, color: '#10b981' },
                ]}
                height={280}
              />
            </div>

            {/* Chart 2: Bid Amount vs Job Budget Ratio */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Bid Price vs Client Budget Index</h3>
                <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                  How freelancer proposed prices align with the posted job budget target.
                </p>
              </div>

              <AnalyticsBarChart
                labels={ratioLabels}
                datasets={[
                  {
                    label: 'Proposals Count',
                    data: ratioCounts,
                    color: '#8b5cf6',
                  },
                ]}
                height={280}
              />
            </div>
          </div>

          {/* 5. Status Breakdown & Bid Intelligence Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Status Breakdown Doughnut */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Proposal Status Distribution</h3>
                <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                  Current review, acceptance, and decline states.
                </p>

                <div className="mt-4">
                  <AnalyticsDoughnutChart
                    labels={statusLabels}
                    data={statusCounts}
                    colors={statusColors}
                    height={210}
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-[#f0f2f5] text-xs">
                {data.statusBreakdown.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f9fafb] transition-colors">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: statusColors[idx % statusColors.length] }}
                      />
                      <span className="font-medium text-[#4b5563]">{s.label}</span>
                    </div>
                    <span className="font-bold text-[#111827]">{s.count} bids</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Marketplace Proposal Health Insights */}
            <div className="lg:col-span-2 bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#f0f2f5] pb-3">
                <div className="w-8 h-8 rounded-xl bg-[#fdf2f8] text-[#db2777] border border-pink-500/20 flex items-center justify-center font-bold">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">
                    Marketplace Bidding Dynamics &amp; Health Insights
                  </h3>
                  <p className="text-[11px] text-[#6b7280] font-medium">
                    Automated telemetry and heuristics on talent competition.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#edfbf2]/80 to-[#f0fdf4] border border-[#bbf7d0] space-y-2">
                  <div className="flex items-center gap-2 text-[#15803d] font-bold text-xs">
                    <Award className="h-4 w-4" />
                    <span>Competitive Talent Equilibrium</span>
                  </div>
                  <p className="text-xs text-[#166534] font-medium leading-relaxed">
                    With an average of <strong className="text-[#14a800]">{data.kpis.avgProposalsPerJob} bids per job</strong>, clients receive high quality choice within hours without overwhelming spam.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-[#edf2fe]/80 to-[#eff6ff] border border-[#bfdbfe] space-y-2">
                  <div className="flex items-center gap-2 text-[#1d4ed8] font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Conversion Velocity</span>
                  </div>
                  <p className="text-xs text-[#1e40af] font-medium leading-relaxed">
                    Over <strong className="text-blue-600">{data.kpis.acceptedCount} proposals</strong> successfully converted into funded contracts in this timeframe, yielding a win rate of <strong className="text-[#111827]">{data.kpis.acceptanceRate}%</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-[#f5f3ff]/80 to-[#faf5ff] border border-[#ddd6fe] space-y-2">
                  <div className="flex items-center gap-2 text-[#7c3aed] font-bold text-xs">
                    <DollarSign className="h-4 w-4" />
                    <span>Price Anchor Alignment</span>
                  </div>
                  <p className="text-xs text-[#6d28d9] font-medium leading-relaxed">
                    Most bids stay within &plusmn;10% of the client&apos;s budget anchor, reflecting realistic client budgeting and professional talent alignment.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-[#fef3c7]/60 to-[#fffbeb] border border-[#fde68a] space-y-2">
                  <div className="flex items-center gap-2 text-[#b45309] font-bold text-xs">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Spam &amp; Risk Guardrails</span>
                  </div>
                  <p className="text-xs text-[#92400e] font-medium leading-relaxed">
                    Only <strong className="text-[#d97706]">{data.kpis.flaggedCount} proposals</strong> were flagged by automated heuristic guards for off-platform payment solicitations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
