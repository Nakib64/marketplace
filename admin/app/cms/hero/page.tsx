import type { Metadata } from 'next';
import { HeroCmsEditor } from '@/components/cms/HeroCmsEditor';

export const metadata: Metadata = {
  title: 'Hero & Showcase CMS | Banglance Admin',
  description: 'Manage homepage hero headlines, subtitles, status badge, action CTAs, and showcase card.',
};

export default function AdminHeroCmsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <HeroCmsEditor />
    </div>
  );
}
