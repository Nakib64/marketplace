import type { Metadata } from 'next';
import { CashFlowAnalyticsDashboard } from '@/components/analytics/CashFlowAnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Cash Flow & Vault Analytics | Banglance Admin',
  description: 'Escrow deposits, talent disbursements, platform fee realization, and vault solvency.',
};

export default function AdminCashFlowAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <CashFlowAnalyticsDashboard />
    </div>
  );
}
