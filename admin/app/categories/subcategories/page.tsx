import type { Metadata } from 'next';
import { SubCategoriesManager } from '@/components/categories/SubCategoriesManager';

export const metadata: Metadata = {
  title: 'Subcategories Directory | Banglance Admin',
  description: 'Manage specialized subcategories, slugs, and domain parents.',
};

export default function AdminSubCategoriesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SubCategoriesManager />
    </div>
  );
}
