import type { Metadata } from 'next';
import { CtaCmsEditor } from '@/components/cms/CtaCmsEditor';

export const metadata: Metadata = {
  title: 'Bottom CTAs CMS | Banglance Admin',
  description: 'Manage homepage bottom conversion action cards for clients and talent.',
};

export default function AdminCtaCmsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <CtaCmsEditor />
    </div>
  );
}
