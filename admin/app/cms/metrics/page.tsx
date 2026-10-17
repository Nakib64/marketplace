import type { Metadata } from 'next';
import { MetricsCmsEditor } from '@/components/cms/MetricsCmsEditor';

export const metadata: Metadata = {
  title: 'Platform Metrics CMS | Banglance Admin',
  description: 'Manage homepage metrics ribbon, trust numbers, and platform statistics.',
};

export default function AdminMetricsCmsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MetricsCmsEditor />
    </div>
  );
}
