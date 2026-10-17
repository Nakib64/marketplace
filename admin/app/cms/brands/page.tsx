import type { Metadata } from 'next';
import { BrandsCmsEditor } from '@/components/cms/BrandsCmsEditor';

export const metadata: Metadata = {
  title: 'Trusted Brands CMS | Banglance Admin',
  description: 'Manage featured customer brands and partner social proof on the homepage.',
};

export default function AdminBrandsCmsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <BrandsCmsEditor />
    </div>
  );
}
