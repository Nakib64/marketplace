import type { Metadata } from 'next';
import { ExecutiveOverviewDashboard } from '@/components/analytics/ExecutiveOverviewDashboard';

export const metadata: Metadata = {
  title: 'Executive Analytics Radar | Banglance Admin',
  description: 'Cross-platform gross liquidity, contract volume, and marketplace transaction velocity.',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ExecutiveOverviewDashboard />
    </div>
  );
}
