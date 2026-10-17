import type { Metadata } from 'next';
import { PayoutQueueTable } from '@/components/payouts/PayoutQueueTable';
import { WalletCards } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Payouts & Escrow Ledger | Banglance Admin',
  description: 'Process bKash and Nagad withdrawals with transaction verification and automated balance reconciliation.',
};

export default function AdminPayoutsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <WalletCards className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Escrow Vault & Payouts Queue</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Authorize freelancer bKash & Nagad withdrawal requests or reject with instant wallet balance refund.
          </p>
        </div>
      </div>

      <PayoutQueueTable />
    </div>
  );
}
