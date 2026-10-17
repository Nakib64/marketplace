import type { Metadata } from 'next';
import { EnterpriseSettingsSubNav } from '@/components/settings/EnterpriseSettingsSubNav';
import { SecuritySettingsForm } from '@/components/settings/SecuritySettingsForm';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Enterprise Security & Access Governance | Banglance Admin',
  description: 'MFA enforcement, SAML 2.0 Single Sign-On, IP whitelisting, and session timeout policies.',
};

export default function AdminSecuritySettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Security & Access Governance</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Enforce zero-trust administrative boundaries, enterprise SSO, IP restrictions, and session controls.
          </p>
        </div>
      </div>

      <EnterpriseSettingsSubNav />
      <SecuritySettingsForm />
    </div>
  );
}
