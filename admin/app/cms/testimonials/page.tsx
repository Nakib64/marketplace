import type { Metadata } from 'next';
import { TestimonialsCmsEditor } from '@/components/cms/TestimonialsCmsEditor';

export const metadata: Metadata = {
  title: 'Customer Stories CMS | Banglance Admin',
  description: 'Manage verified client and freelancer testimonials, ratings, and stats.',
};

export default function AdminTestimonialsCmsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <TestimonialsCmsEditor />
    </div>
  );
}
