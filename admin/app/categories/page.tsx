import type { Metadata } from 'next';
import { CategoriesManager } from '@/components/categories/CategoriesManager';

export const metadata: Metadata = {
  title: 'Categories & Taxonomy | Banglance Admin',
  description: 'Manage marketplace categories, subcategories, slugs, and service hierarchy.',
};

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <CategoriesManager />
    </div>
  );
}
