'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsApi } from '@/lib/api/adminApi';
import { EnterpriseSettings } from '@/types/adminTypes';
import {
  WalletCards,
  Percent,
  Clock,
  Coins,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function BillingGatewaysForm() {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: initialData, isLoading } = useQuery<EnterpriseSettings>({
    queryKey: ['admin-enterprise-settings'],
    queryFn: () => adminSettingsApi.getEnterpriseSettings(),
  });

  const [form, setForm] = useState<Partial<EnterpriseSettings>>({
    standardCommissionRate: 10.0,
    highVolumeCommissionRate: 7.0,
    enterpriseCommissionRate: 5.0,
    escrowClearingPeriodDays: 7,
    instantReleaseTopRated: true,
    minWithdrawalAmount: 500,
    maxDailyWithdrawalPerUser: 100000,
    sslCommerzEnabled: true,
    sslCommerzStoreId: 'saasf6a9eadb9dc075',
    sslCommerzSandbox: true,
    bKashMerchantEnabled: true,
    bKashAppKey: 'bKash_prod_sec_9941x',
    nagadMerchantEnabled: true,
    disputeArbitrationFee: 500,
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<EnterpriseSettings>) =>
      adminSettingsApi.updateEnterpriseSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['admin-enterprise-settings'], updated);
      setSuccessMsg('Escrow and payment gateway configurations saved successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to save billing settings.');
      setTimeout(() => setErrorMsg(null), 4000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
        <span className="text-xs text-outline font-medium">Loading billing and gateway configurations...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Feedback Messages */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Multi-Tier Commission Calibrator */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Percent className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-sm font-bold text-on-surface">Platform Commission Tiering (Take-Rate)</h2>
            <p className="text-xs text-on-surface-variant">
              Incentivize high-value client contracts with graduated platform fee discounts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">Standard Tier</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Up to ৳100,000
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={form.standardCommissionRate ?? 10}
                onChange={(e) => setForm({ ...form, standardCommissionRate: Number(e.target.value) })}
                className="w-24 bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-sm font-black text-on-surface focus:outline-none focus:border-primary"
              />
              <span className="text-xs font-bold text-on-surface-variant">% commission</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">High-Volume Tier</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                ৳100k - ৳500k
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={form.highVolumeCommissionRate ?? 7}
                onChange={(e) => setForm({ ...form, highVolumeCommissionRate: Number(e.target.value) })}
                className="w-24 bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-sm font-black text-on-surface focus:outline-none focus:border-primary"
              />
              <span className="text-xs font-bold text-on-surface-variant">% commission</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">Enterprise Tier</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600">
                Above ৳500,000
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={form.enterpriseCommissionRate ?? 5}
                onChange={(e) => setForm({ ...form, enterpriseCommissionRate: Number(e.target.value) })}
                className="w-24 bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-sm font-black text-on-surface focus:outline-none focus:border-primary"
              />
              <span className="text-xs font-bold text-on-surface-variant">% commission</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Escrow Solvency & Clearing Periods */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-on-surface">Escrow Clearing & Release Dynamics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Milestone Clearance Hold Period</label>
            <select
              value={form.escrowClearingPeriodDays ?? 7}
              onChange={(e) => setForm({ ...form, escrowClearingPeriodDays: Number(e.target.value) })}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value={0}>0 Days (Instant milestone release upon approval)</option>
              <option value={3}>3 Days (Fast-track clearing)</option>
              <option value={7}>7 Days (Standard Upwork / Escrow clearance)</option>
              <option value={14}>14 Days (Conservative enterprise holding)</option>
            </select>
            <span className="text-[10px] text-outline mt-1 block">Security window for dispute filings before funds hit talent balance.</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container border border-outline-variant">
            <div className="pr-3">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold text-on-surface">Top-Rated Instant Payouts</span>
              </div>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">
                Bypass the 7-day clearing window for talent with 100% Job Success Score.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={form.instantReleaseTopRated ?? true}
                onChange={(e) => setForm({ ...form, instantReleaseTopRated: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Withdrawal Boundaries & Velocity Limits */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Coins className="h-5 w-5 text-emerald-600" />
          <h2 className="text-sm font-bold text-on-surface">Withdrawal Limits & Velocity Controls</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Minimum Withdrawal Bound (৳)</label>
            <input
              type="number"
              step="50"
              value={form.minWithdrawalAmount ?? 500}
              onChange={(e) => setForm({ ...form, minWithdrawalAmount: Number(e.target.value) })}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            />
            <span className="text-[10px] text-outline mt-1 block">Minimum balance required for a bKash/Nagad payout request.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Max Daily Payout Velocity Cap (৳)</label>
            <input
              type="number"
              step="5000"
              value={form.maxDailyWithdrawalPerUser ?? 100000}
              onChange={(e) => setForm({ ...form, maxDailyWithdrawalPerUser: Number(e.target.value) })}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            />
            <span className="text-[10px] text-outline mt-1 block">Daily limit per talent account. Higher payouts trigger manual review.</span>
          </div>
        </div>
      </div>

      {/* 4. Payment Gateways (SSLCommerz, bKash, Nagad) */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-sm font-bold text-on-surface">Payment Gateways & Local Clearing Rails</h2>
            <p className="text-xs text-on-surface-variant">Configure Bangladesh-tailored settlement gateways.</p>
          </div>
        </div>

        {/* SSLCommerz */}
        <div className="p-4 rounded-xl border border-outline-variant space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
                SSL
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface">SSLCommerz Hosted Gateway</span>
                <span className="text-[11px] text-outline block">Debit/Credit Cards, Mobile Banking, Internet Banking</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${form.sslCommerzSandbox ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {form.sslCommerzSandbox ? 'SANDBOX MODE' : 'PRODUCTION LIVE'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.sslCommerzEnabled ?? true}
                  onChange={(e) => setForm({ ...form, sslCommerzEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-outline-variant/60">
            <div>
              <label className="block text-[11px] font-bold text-outline mb-1">Store ID</label>
              <input
                type="text"
                value={form.sslCommerzStoreId ?? ''}
                onChange={(e) => setForm({ ...form, sslCommerzStoreId: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-semibold text-on-surface"
              />
            </div>

            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-on-surface">
                <input
                  type="checkbox"
                  checked={form.sslCommerzSandbox ?? true}
                  onChange={(e) => setForm({ ...form, sslCommerzSandbox: e.target.checked })}
                  className="rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span>Enable Sandbox (Test Mode)</span>
              </label>
            </div>
          </div>
        </div>

        {/* bKash & Nagad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-outline-variant space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#e2136e] text-white flex items-center justify-center text-[10px] font-bold">bK</span>
                <span className="text-xs font-bold text-on-surface">bKash Direct Merchant Payout</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.bKashMerchantEnabled ?? true}
                  onChange={(e) => setForm({ ...form, bKashMerchantEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <span className="text-[11px] text-outline block">Automated B2C wallet disbursement via bKash PGW API.</span>
          </div>

          <div className="p-4 rounded-xl border border-outline-variant space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#f7941d] text-white flex items-center justify-center text-[10px] font-bold">NG</span>
                <span className="text-xs font-bold text-on-surface">Nagad Merchant Gateway</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.nagadMerchantEnabled ?? true}
                  onChange={(e) => setForm({ ...form, nagadMerchantEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <span className="text-[11px] text-outline block">Direct settlement for Nagad mobile wallets.</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-xs cursor-pointer transition-all disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Billing Configurations</span>
        </button>
      </div>
    </form>
  );
}
