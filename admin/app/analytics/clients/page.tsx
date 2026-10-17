import type { Metadata } from 'next';
import { ClientAnalyticsDashboard } from '@/components/analytics/ClientAnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Client Analytics | Banglance Admin',
  description: 'Client acquisition velocity, hiring repetition rates, spend tiers, and corporate accounts.',
};

export default function AdminClientAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ClientAnalyticsDashboard />
    </div>
  );
}
