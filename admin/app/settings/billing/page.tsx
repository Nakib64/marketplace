import type { Metadata } from 'next';
import { EnterpriseSettingsSubNav } from '@/components/settings/EnterpriseSettingsSubNav';
import { BillingGatewaysForm } from '@/components/settings/BillingGatewaysForm';
import { WalletCards } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Escrow Engine & Payment Gateways | Banglance Admin',
  description: 'Graduated commission tiers, escrow clearing windows, SSLCommerz, and bKash payout rules.',
};

export default function AdminBillingSettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <WalletCards className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Escrow & Payment Gateway Policies</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Calibrate take-rate tiers, escrow clearing holds, payout thresholds, and settlement gateway credentials.
          </p>
        </div>
      </div>

      <EnterpriseSettingsSubNav />
      <BillingGatewaysForm />
    </div>
  );
}
