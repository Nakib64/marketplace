import type { Metadata } from 'next';
import { FreelancerAnalyticsDashboard } from '@/components/analytics/FreelancerAnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Freelancer Analytics | Banglance Admin',
  description: 'Talent acquisition trends, rate distribution, earnings velocity, and high-earner cohorts.',
};

export default function AdminFreelancerAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <FreelancerAnalyticsDashboard />
    </div>
  );
}
