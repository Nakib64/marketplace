import type { Metadata } from 'next';
import { CmsOverviewHub } from '@/components/cms/CmsOverviewHub';

export const metadata: Metadata = {
  title: 'Homepage CMS & Content | Banglance Admin',
  description: 'Manage homepage hero headlines, metrics, testimonials, and marketing call-to-actions.',
};

export default function AdminCmsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <CmsOverviewHub />
    </div>
  );
}

