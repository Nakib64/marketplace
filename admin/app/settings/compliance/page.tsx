import type { Metadata } from 'next';
import { EnterpriseSettingsSubNav } from '@/components/settings/EnterpriseSettingsSubNav';
import { ComplianceKycForm } from '@/components/settings/ComplianceKycForm';
import { FileCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'KYC, AML & Statutory Compliance | Banglance Admin',
  description: 'Identity verification thresholds, anti-money laundering velocity sentinels, and NBR tax withholding.',
};

export default function AdminComplianceSettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">KYC, AML & Regulatory Compliance</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure talent identity gating, suspicious velocity triggers, NBR tax deduction, and statutory audit retention.
          </p>
        </div>
      </div>

      <EnterpriseSettingsSubNav />
      <ComplianceKycForm />
    </div>
  );
}
