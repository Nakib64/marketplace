'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsApi } from '@/lib/api/adminApi';
import { EnterpriseSettings } from '@/types/adminTypes';
import {
  FileCheck,
  ShieldAlert,
  Scale,
  Building2,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  HelpCircle,
} from 'lucide-react';

export function ComplianceKycForm() {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: initialData, isLoading } = useQuery<EnterpriseSettings>({
    queryKey: ['admin-enterprise-settings'],
    queryFn: () => adminSettingsApi.getEnterpriseSettings(),
  });

  const [form, setForm] = useState<Partial<EnterpriseSettings>>({
    requireKycBeforePayout: true,
    kycVerificationLevel: 'ENHANCED',
    amlSinglePayoutThreshold: 50000,
    amlDailyVelocityThreshold: 100000,
    automatedVatWithholding: true,
    vatRatePercentage: 5.0,
    disputeWindowDays: 14,
    dataRetentionYears: 7,
    privacyRightToErasure: true,
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
      setSuccessMsg('Compliance and KYC policies updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to save compliance settings.');
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
        <span className="text-xs text-outline font-medium">Loading compliance and AML policies...</span>
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

      {/* 1. Identity Verification (KYC) Governance */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Mandatory Talent KYC / NID Verification</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Block wallet withdrawals until the freelancer has submitted government-issued ID (National ID, Smart Card, or Passport).
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={form.requireKycBeforePayout ?? true}
              onChange={(e) => setForm({ ...form, requireKycBeforePayout: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/60">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">KYC Strictness Tier</label>
            <select
              value={form.kycVerificationLevel ?? 'ENHANCED'}
              onChange={(e) => setForm({ ...form, kycVerificationLevel: e.target.value as any })}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="STANDARD">Standard (Government ID Photo Only)</option>
              <option value="ENHANCED">Enhanced (ID Photo + Live Selfie Facial Match)</option>
              <option value="MANUAL_STRICT">Manual Strict (Admin Staff Video Verification)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Contract Dispute Window</label>
            <select
              value={form.disputeWindowDays ?? 14}
              onChange={(e) => setForm({ ...form, disputeWindowDays: Number(e.target.value) })}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value={7}>7 Days after milestone completion</option>
              <option value={14}>14 Days (Standard Arbitration Period)</option>
              <option value={30}>30 Days (Extended Enterprise Review)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Anti-Money Laundering (AML) Velocity Thresholds */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <div>
            <h2 className="text-sm font-bold text-on-surface">Anti-Money Laundering (AML) Sentinel Triggers</h2>
            <p className="text-xs text-on-surface-variant">Automatically pause payouts and alert compliance officers when suspicious financial velocity occurs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-2">
            <span className="text-xs font-bold text-on-surface block">Single Payout Audit Threshold</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-on-surface">৳</span>
              <input
                type="number"
                step="5000"
                value={form.amlSinglePayoutThreshold ?? 50000}
                onChange={(e) => setForm({ ...form, amlSinglePayoutThreshold: Number(e.target.value) })}
                className="w-36 bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold text-on-surface"
              />
            </div>
            <span className="text-[10px] text-outline block">Any single withdrawal request exceeding this amount requires dual-admin signoff.</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-2">
            <span className="text-xs font-bold text-on-surface block">24h Account Velocity Threshold</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-on-surface">৳</span>
              <input
                type="number"
                step="10000"
                value={form.amlDailyVelocityThreshold ?? 100000}
                onChange={(e) => setForm({ ...form, amlDailyVelocityThreshold: Number(e.target.value) })}
                className="w-36 bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold text-on-surface"
              />
            </div>
            <span className="text-[10px] text-outline block">Flags accounts that drain more than this amount within a rolling 24-hour window.</span>
          </div>
        </div>
      </div>

      {/* 3. Tax / VAT Withholding Configuration (Bangladesh NBR Compliance) */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Automated Advance Income Tax (AIT / VAT) Deduction</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Automatically withhold government source tax on local payout disbursements to comply with National Board of Revenue (NBR) Bangladesh regulations.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={form.automatedVatWithholding ?? true}
              onChange={(e) => setForm({ ...form, automatedVatWithholding: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {form.automatedVatWithholding && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/60">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Withholding Tax Rate (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                value={form.vatRatePercentage ?? 5.0}
                onChange={(e) => setForm({ ...form, vatRatePercentage: Number(e.target.value) })}
                className="w-32 bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface"
              />
              <span className="text-[10px] text-outline mt-1 block">Standard 5.0% AIT deducted from gross talent earnings upon withdrawal.</span>
            </div>

            <div className="flex items-center p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-800">
              <span>Automatic tax challan certificate generation is enabled on every approved payout record.</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Statutory Data Retention & Erasure Policy */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Scale className="h-5 w-5 text-purple-600" />
          <h2 className="text-sm font-bold text-on-surface">Data Retention & Privacy Erasure Rules</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Statutory Financial Ledger Retention</label>
            <select
              value={form.dataRetentionYears ?? 7}
              onChange={(e) => setForm({ ...form, dataRetentionYears: Number(e.target.value) })}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value={3}>3 Years</option>
              <option value={5}>5 Years</option>
              <option value={7}>7 Years (Bangladesh Companies Act Statutory Mandate)</option>
              <option value={10}>10 Years</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container border border-outline-variant">
            <div className="pr-3">
              <span className="text-xs font-bold text-on-surface block">Right-to-be-Forgotten (Erasure)</span>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">
                Permit user account anonymization while preserving immutable financial audit ledgers.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={form.privacyRightToErasure ?? true}
                onChange={(e) => setForm({ ...form, privacyRightToErasure: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
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
          <span>Save Compliance Policies</span>
        </button>
      </div>
    </form>
  );
}
