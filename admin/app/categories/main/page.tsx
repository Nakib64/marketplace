import type { Metadata } from 'next';
import { MainCategoriesManager } from '@/components/categories/MainCategoriesManager';

export const metadata: Metadata = {
  title: 'Primary Categories | Banglance Admin',
  description: 'Manage main marketplace categories and industry domain architecture.',
};

export default function AdminMainCategoriesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MainCategoriesManager />
    </div>
  );
}
