'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsApi } from '@/lib/api/adminApi';
import { EnterpriseSettings } from '@/types/adminTypes';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Globe,
  Clock,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Users,
} from 'lucide-react';

export function SecuritySettingsForm() {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: initialData, isLoading } = useQuery<EnterpriseSettings>({
    queryKey: ['admin-enterprise-settings'],
    queryFn: () => adminSettingsApi.getEnterpriseSettings(),
  });

  const [form, setForm] = useState<Partial<EnterpriseSettings>>({
    enforce2FA: true,
    enableSSO: true,
    ssoProvider: 'GOOGLE_WORKSPACE',
    ssoDomain: 'banglance.com',
    sessionTimeoutMinutes: 60,
    maxConcurrentSessions: 2,
    ipWhitelistEnabled: false,
    ipWhitelist: '103.204.0.0/16, 127.0.0.1',
    passwordRotationDays: 90,
    failedLoginLockoutThreshold: 5,
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
      setSuccessMsg('Enterprise security governance policies saved successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to save security settings.');
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
        <span className="text-xs text-outline font-medium">Loading enterprise security policies...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notifications */}
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

      {/* 1. Multi-Factor Authentication (MFA/2FA) */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Mandatory Multi-Factor Authentication (MFA)</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Force all staff, administrators, and dispute arbiters to authenticate with TOTP (Google Authenticator / Authy).
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={form.enforce2FA ?? true}
              onChange={(e) => setForm({ ...form, enforce2FA: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="pt-2 border-t border-outline-variant/60 flex items-center gap-2 text-[11px] text-outline font-medium">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Complies with ISO 27001 and SOC 2 Type II administrator access standards.</span>
        </div>
      </div>

      {/* 2. Enterprise Single Sign-On (SSO / SAML 2.0) */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Enterprise Single Sign-On (SSO / SAML 2.0)</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Allow administrators and corporate clients to sign in using centralized identity providers.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={form.enableSSO ?? true}
              onChange={(e) => setForm({ ...form, enableSSO: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {form.enableSSO && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/60">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Identity Provider</label>
              <select
                value={form.ssoProvider ?? 'GOOGLE_WORKSPACE'}
                onChange={(e) => setForm({ ...form, ssoProvider: e.target.value as any })}
                className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="GOOGLE_WORKSPACE">Google Workspace (OAuth & SAML)</option>
                <option value="OKTA">Okta Identity Cloud</option>
                <option value="AZURE_AD">Microsoft Entra ID (Azure AD)</option>
                <option value="CUSTOM_SAML">Custom SAML 2.0 Endpoint</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Corporate Domain Binding</label>
              <input
                type="text"
                value={form.ssoDomain ?? ''}
                onChange={(e) => setForm({ ...form, ssoDomain: e.target.value })}
                placeholder="e.g. banglance.com"
                className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Session Security & Lockout Rules */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-on-surface">Session Management & Inactivity Rules</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Inactivity Timeout</label>
            <select
              value={form.sessionTimeoutMinutes ?? 60}
              onChange={(e) => setForm({ ...form, sessionTimeoutMinutes: Number(e.target.value) })}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value={15}>15 minutes (Strict Banking)</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour (Recommended)</option>
              <option value={240}>4 hours</option>
              <option value={480}>8 hours (Standard shift)</option>
            </select>
            <span className="text-[10px] text-outline mt-1 block">Forces auto-logout when idle.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Max Concurrent Sessions</label>
            <select
              value={form.maxConcurrentSessions ?? 2}
              onChange={(e) => setForm({ ...form, maxConcurrentSessions: Number(e.target.value) })}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value={1}>1 device only (Strict)</option>
              <option value={2}>2 active devices (Default)</option>
              <option value={4}>Up to 4 devices</option>
              <option value={0}>Unlimited concurrent logins</option>
            </select>
            <span className="text-[10px] text-outline mt-1 block">Prevents credential sharing among staff.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Brute-Force Lockout</label>
            <select
              value={form.failedLoginLockoutThreshold ?? 5}
              onChange={(e) => setForm({ ...form, failedLoginLockoutThreshold: Number(e.target.value) })}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value={3}>3 failed attempts</option>
              <option value={5}>5 failed attempts (Recommended)</option>
              <option value={10}>10 failed attempts</option>
            </select>
            <span className="text-[10px] text-outline mt-1 block">Locks account for 30 minutes.</span>
          </div>
        </div>
      </div>

      {/* 4. IP Whitelisting & CIDR Access Protection */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Admin Portal IP Whitelisting (Zero Trust)</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Restrict access to this admin gateway to specific corporate VPNs and static IP ranges.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={form.ipWhitelistEnabled ?? false}
              onChange={(e) => setForm({ ...form, ipWhitelistEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {form.ipWhitelistEnabled && (
          <div className="pt-2 border-t border-outline-variant/60">
            <label className="block text-xs font-bold text-on-surface mb-1">
              Allowed IP Addresses & CIDR Blocks (Comma separated)
            </label>
            <textarea
              rows={3}
              value={form.ipWhitelist ?? ''}
              onChange={(e) => setForm({ ...form, ipWhitelist: e.target.value })}
              placeholder="e.g. 103.204.0.0/16, 192.168.1.1, 127.0.0.1"
              className="w-full bg-surface-container border border-outline-variant rounded-xl p-3 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary font-mono"
            />
            <span className="text-[11px] text-amber-600 font-medium block mt-1">
              Warning: Ensure your current IP is included before activating to avoid administrative lockout.
            </span>
          </div>
        )}
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
          <span>Save Security Policies</span>
        </button>
      </div>
    </form>
  );
}
