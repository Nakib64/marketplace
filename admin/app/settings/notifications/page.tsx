import type { Metadata } from 'next';
import { EnterpriseSettingsSubNav } from '@/components/settings/EnterpriseSettingsSubNav';
import { WebhooksAlertsForm } from '@/components/settings/WebhooksAlertsForm';
import { Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Webhooks, Relays & Incident Alerting | Banglance Admin',
  description: 'Outbound webhook events, HMAC signatures, SMTP relays, SMS OTP providers, and Slack alert channels.',
};

export default function AdminNotificationsSettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Webhooks, Relays & Incident Channels</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Dispatch real-time platform events to corporate ERPs, configure transactional email relays, and route operational alerts.
          </p>
        </div>
      </div>

      <EnterpriseSettingsSubNav />
      <WebhooksAlertsForm />
    </div>
  );
}
