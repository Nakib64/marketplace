import type { Metadata } from 'next';
import { ProposalAnalyticsDashboard } from '@/components/analytics/ProposalAnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Proposals & Bids Analytics | Banglance Admin',
  description: 'Freelancer pitch volume, hiring conversion rates, bid price distributions, and client selection speed.',
};

export default function AdminProposalAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ProposalAnalyticsDashboard />
    </div>
  );
}
