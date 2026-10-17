'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsApi } from '@/lib/api/adminApi';
import { CashFlowAnalyticsData } from '@/types/adminTypes';
import {
  WalletCards,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle2,
  CreditCard,
  Zap,
  Shield,
  BadgePercent,
  Banknote,
} from 'lucide-react';
import { AnalyticsTimeframeFilter } from './AnalyticsTimeframeFilter';
import { AnalyticsSubNav } from './AnalyticsSubNav';
import { AnalyticsAreaLineChart, AnalyticsDoughnutChart } from './AnalyticsChart';

export function CashFlowAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('30d');

  const { data, isLoading, isError } = useQuery<CashFlowAnalyticsData>({
    queryKey: ['admin-analytics-cashflow', timeframe],
    queryFn: () => adminAnalyticsApi.getCashFlow(timeframe),
  });

  const timelineLabels = data?.timeline.map((t) => t.label) || [];
  const inflowData = data?.timeline.map((t) => t.inflow) || [];
  const outflowData = data?.timeline.map((t) => t.outflow) || [];
  const netFeeData = data?.timeline.map((t) => t.netFee) || [];

  const channelLabels = data?.channelBreakdown.map((c) => c.method) || [];
  const channelVolumes = data?.channelBreakdown.map((c) => c.volume) || [];

  const channelColors = ['#e1147a', '#f97316', '#2563eb', '#8b5cf6', '#10b981'];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto select-none">
      {/* 1. Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center font-bold shadow-[0_3px_12px_-2px_rgba(16,185,129,0.4)]">
              <WalletCards className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#111827] tracking-tight">Cash Flow &amp; Financial Velocity</h1>
                <span className="text-[10px] font-bold text-[#14a800] bg-[#eaf8ea] px-2.5 py-0.5 rounded-full">
                  Escrow Solvency Live
                </span>
              </div>
              <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                Escrow deposits, talent disbursements, platform fee realization, and vault solvency.
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
          <span className="text-xs text-outline font-medium">Reconciling ledger and vault liquidity...</span>
        </div>
      ) : isError || !data ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold">
          Failed to fetch cash flow ledger data. Check backend connection.
        </div>
      ) : (
        <>
          {/* 3. Top KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Gross Inflow */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Gross Escrow Inflow</span>
                <div className="w-9 h-9 rounded-xl bg-[#edfbf2] text-[#14a800] border border-emerald-500/20 flex items-center justify-center font-bold">
                  <ArrowDownLeft className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#111827] leading-none">
                  ৳{data.kpis.grossEscrowInflow.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#16a34a] bg-[#eaf8ea] px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Funded milestones</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Talent Disbursed */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Talent Disbursed</span>
                <div className="w-9 h-9 rounded-xl bg-[#edf2fe] text-[#3b82f6] border border-blue-500/20 flex items-center justify-center font-bold">
                  <ArrowUpRight className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-blue-600 leading-none">
                  ৳{data.kpis.talentDisbursed.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    Approved &amp; released payouts
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Platform Commission */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Platform Fee (10%)</span>
                <div className="w-9 h-9 rounded-xl bg-[#f5f3ff] text-[#8b5cf6] border border-purple-500/20 flex items-center justify-center font-bold">
                  <BadgePercent className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#7c3aed] leading-none">
                  ৳{data.kpis.netPlatformCommission.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                    Realized net commission
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Current Escrow Vault */}
            <div className="bg-white rounded-[20px] p-5 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b5563]">Escrow Vault Held</span>
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] border border-amber-500/20 flex items-center justify-center font-bold">
                  <Lock className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[26px] font-black text-[#d97706] leading-none">
                  ৳{data.kpis.activeVaultHeld.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    100% Solvency guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Main Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Inflow vs Outflow vs Platform Commission */}
            <div className="lg:col-span-2 bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Liquidity Movements: Inflows, Outflows &amp; Commission
                  </h3>
                  <p className="text-xs text-[#6b7280] font-medium mt-0.5">
                    Funded client escrow vs contractor payouts ({data.timeframe.toUpperCase()}).
                  </p>
                </div>

                {/* Inline Stats Ribbon */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-[#edfbf2] px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span className="text-[11px] font-bold text-[#14a800]">Inflow: ৳{data.kpis.grossEscrowInflow.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#edf2fe] px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                    <span className="text-[11px] font-bold text-blue-600">Outflow: ৳{data.kpis.talentDisbursed.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <AnalyticsAreaLineChart
                labels={timelineLabels}
                datasets={[
                  { label: 'Escrow Inflows', data: inflowData, color: '#10b981' },
                  { label: 'Talent Outflows', data: outflowData, color: '#3b82f6' },
                  { label: 'Platform Net Fee', data: netFeeData, color: '#f59e0b', fill: false },
                ]}
                currency={true}
                height={320}
              />
            </div>

            {/* Chart 2: Payment & Payout Channel Distribution */}
            <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-[#fdf2f8] text-[#db2777] border border-pink-500/20 flex items-center justify-center font-bold">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">Payment Channel Volume</h3>
                    <p className="text-[11px] text-[#6b7280] font-medium">Disbursement rail share across MFS &amp; EFTN.</p>
                  </div>
                </div>

                <div className="mt-4">
                  <AnalyticsDoughnutChart
                    labels={channelLabels}
                    data={channelVolumes}
                    colors={channelColors}
                    height={210}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#f0f2f5]">
                {data.channelBreakdown.map((ch, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-[#f9fafb] transition-colors">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: channelColors[idx % channelColors.length] }}
                      />
                      <span className="font-semibold text-[#374151]">{ch.method}</span>
                    </div>
                    <span className="font-bold text-[#111827]">৳{ch.volume.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Solvency and Ledger Health Summary */}
          <div className="bg-white rounded-[20px] p-6 border border-[#eaecf0] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#edfbf2] text-[#14a800] flex items-center justify-center">
                  <Shield className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111827]">
                  Platform Solvency &amp; Risk Health Check
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Audit Status: 100% Reconciled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#edfbf2]/80 to-[#f0fdf4] border border-[#bbf7d0] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#14a800] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#15803d]">Full Escrow Collateralization</h4>
                  <p className="text-[11px] text-[#166534] font-medium mt-1 leading-relaxed">
                    100% of all in-progress contract commitments are held segregated in the Banglance Escrow Trust vault.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[#edf2fe]/80 to-[#eff6ff] border border-[#bfdbfe] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3b82f6] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#1d4ed8]">Instant Talent Settlements</h4>
                  <p className="text-[11px] text-[#1e40af] font-medium mt-1 leading-relaxed">
                    User wallet liabilities: ৳{data.kpis.userWalletLiabilities.toLocaleString()}. All requests processed via automated bKash/Nagad APIs.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[#fef3c7]/60 to-[#fffbeb] border border-[#fde68a] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f59e0b] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Banknote className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#b45309]">Dispute Zero-Loss Guarantee</h4>
                  <p className="text-[11px] text-[#92400e] font-medium mt-1 leading-relaxed">
                    Refunded project capital: ৳{data.kpis.refundedVolume.toLocaleString()} safely reversed to client accounts upon arbitration.
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
