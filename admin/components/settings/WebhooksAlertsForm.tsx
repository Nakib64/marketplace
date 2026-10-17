'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsApi } from '@/lib/api/adminApi';
import { EnterpriseSettings } from '@/types/adminTypes';
import {
  Bell,
  Webhook,
  Mail,
  MessageSquare,
  Radio,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Copy,
  Check,
} from 'lucide-react';

const AVAILABLE_EVENTS = [
  { id: 'contract.funded', label: 'Contract Escrow Funded', desc: 'Triggered when client funds milestone escrow' },
  { id: 'milestone.released', label: 'Milestone Funds Released', desc: 'Triggered when client approves work completion' },
  { id: 'payout.requested', label: 'Payout Requested', desc: 'Triggered when talent initiates bKash/Nagad withdrawal' },
  { id: 'payout.approved', label: 'Payout Authorized', desc: 'Triggered when admin approves outbound payment' },
  { id: 'dispute.opened', label: 'Dispute Arbitration Opened', desc: 'Triggered when either party escalates contract' },
  { id: 'user.flagged', label: 'Account Flagged / Suspended', desc: 'Triggered upon automated risk or moderation flag' },
];

export function WebhooksAlertsForm() {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const { data: initialData, isLoading } = useQuery<EnterpriseSettings>({
    queryKey: ['admin-enterprise-settings'],
    queryFn: () => adminSettingsApi.getEnterpriseSettings(),
  });

  const [form, setForm] = useState<Partial<EnterpriseSettings>>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpSenderEmail: 'support@banglance.com',
    smsGatewayProvider: 'GREENWEB',
    smsOtpEnabled: true,
    outboundWebhooksEnabled: true,
    webhookEndpointUrl: 'https://enterprise.banglance.com/api/v1/webhooks',
    webhookSecret: 'whsec_enterprise_banglance_live_token_7721',
    webhookEvents: ['contract.funded', 'milestone.released', 'payout.approved', 'dispute.opened'],
    slackAlertWebhook: 'https://hooks.slack.com/services/T00/B00/X00',
    slackAlertCriticalThreshold: 'HIGH_SEVERITY_ONLY',
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
      setSuccessMsg('Webhook endpoints and notification channels updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to save webhook settings.');
      setTimeout(() => setErrorMsg(null), 4000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const handleCopySecret = () => {
    if (form.webhookSecret) {
      navigator.clipboard.writeText(form.webhookSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const toggleEvent = (eventId: string) => {
    const current = form.webhookEvents || [];
    if (current.includes(eventId)) {
      setForm({ ...form, webhookEvents: current.filter((e) => e !== eventId) });
    } else {
      setForm({ ...form, webhookEvents: [...current, eventId] });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
        <span className="text-xs text-outline font-medium">Loading webhook endpoints and integrations...</span>
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

      {/* 1. Outbound Enterprise Webhooks */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <Webhook className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Outbound Enterprise Event Webhooks</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Stream real-time marketplace state changes directly to corporate ERPs, accounting software, and data pipelines.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={form.outboundWebhooksEnabled ?? true}
              onChange={(e) => setForm({ ...form, outboundWebhooksEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {form.outboundWebhooksEnabled && (
          <div className="space-y-4 pt-3 border-t border-outline-variant/60">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Target Endpoint URL (HTTPS)</label>
                <input
                  type="url"
                  value={form.webhookEndpointUrl ?? ''}
                  onChange={(e) => setForm({ ...form, webhookEndpointUrl: e.target.value })}
                  placeholder="https://api.yourdomain.com/webhooks"
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Webhook HMAC Signing Secret</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={form.webhookSecret ?? ''}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="p-2 rounded-xl bg-surface-container hover:bg-slate-200 text-on-surface transition-colors cursor-pointer shrink-0"
                    title="Copy Secret"
                  >
                    {copiedSecret ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Subscribed Events */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Subscribed Event Payload Triggers</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AVAILABLE_EVENTS.map((event) => {
                  const isChecked = form.webhookEvents?.includes(event.id) ?? false;
                  return (
                    <div
                      key={event.id}
                      onClick={() => toggleEvent(event.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'border-primary bg-primary/5 text-on-surface'
                          : 'border-outline-variant bg-surface-container/40 text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold font-mono">{event.id}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-outline-variant text-primary focus:ring-primary pointer-events-none"
                        />
                      </div>
                      <span className="text-[11px] text-outline block leading-tight">{event.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Operational Incident Alerting (Slack / Microsoft Teams / Discord) */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Radio className="h-5 w-5 text-indigo-600" />
          <div>
            <h2 className="text-sm font-bold text-on-surface">Real-Time Incident Alert Channel (Slack / Teams)</h2>
            <p className="text-xs text-on-surface-variant">Post critical platform alerts (payout surges, dispute spikes, high-budget requisitions) into staff channels.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Incoming Webhook URL</label>
            <input
              type="url"
              value={form.slackAlertWebhook ?? ''}
              onChange={(e) => setForm({ ...form, slackAlertWebhook: e.target.value })}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Alert Notification Threshold</label>
            <select
              value={form.slackAlertCriticalThreshold ?? 'HIGH_SEVERITY_ONLY'}
              onChange={(e) => setForm({ ...form, slackAlertCriticalThreshold: e.target.value as any })}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="HIGH_SEVERITY_ONLY">High Severity Only (Disputes, Large Payouts, Circuit Breakers)</option>
              <option value="ALL_EVENTS">All Events (Contracts, Milestones, New Registrations)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Transactional Mail & SMS Gateways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <h2 className="text-sm font-bold text-on-surface">SMTP Transactional Relay</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-outline mb-1">SMTP Host & Port</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={form.smtpHost ?? ''}
                  onChange={(e) => setForm({ ...form, smtpHost: e.target.value })}
                  placeholder="smtp.gmail.com"
                  className="flex-1 bg-surface-container border border-outline-variant rounded-xl px-3 py-1.5 text-xs font-semibold text-on-surface"
                />
                <input
                  type="number"
                  value={form.smtpPort ?? 587}
                  onChange={(e) => setForm({ ...form, smtpPort: Number(e.target.value) })}
                  className="w-20 bg-surface-container border border-outline-variant rounded-xl px-3 py-1.5 text-xs font-semibold text-on-surface"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-outline mb-1">From Sender Address</label>
              <input
                type="email"
                value={form.smtpSenderEmail ?? ''}
                onChange={(e) => setForm({ ...form, smtpSenderEmail: e.target.value })}
                placeholder="support@banglance.com"
                className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-1.5 text-xs font-semibold text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* SMS OTP */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-on-surface">SMS OTP Dispatch Gateway</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.smsOtpEnabled ?? true}
                onChange={(e) => setForm({ ...form, smsOtpEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-outline mb-1">SMS Aggregator Provider</label>
              <select
                value={form.smsGatewayProvider ?? 'GREENWEB'}
                onChange={(e) => setForm({ ...form, smsGatewayProvider: e.target.value as any })}
                className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2 text-xs font-semibold text-on-surface"
              >
                <option value="GREENWEB">Greenweb SMS (Direct Bangladesh Telco Routing)</option>
                <option value="SSL_WIRELESS">SSL Wireless Bulk SMS API</option>
                <option value="TWILIO">Twilio International SMS</option>
              </select>
            </div>
            <span className="text-[11px] text-outline block leading-tight">Used for 2FA verification codes and high-value withdrawal verification.</span>
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
          <span>Save Webhooks & Alert Channels</span>
        </button>
      </div>
    </form>
  );
}
