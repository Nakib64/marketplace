import type { Metadata } from 'next';
import { JobAnalyticsDashboard } from '@/components/analytics/JobAnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Job Postings Analytics | Banglance Admin',
  description: 'Employer hiring demand, project fill velocities, status segmentation, and category capital.',
};

export default function AdminJobAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <JobAnalyticsDashboard />
    </div>
  );
}
