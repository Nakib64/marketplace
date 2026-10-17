import type { Metadata } from 'next';
import { SkillsManager } from '@/components/skills/SkillsManager';

export const metadata: Metadata = {
  title: 'Business & Content Skills | Banglance Admin',
  description: 'Manage copywriting, documentation, SEO, marketing, and business analysis skill tags.',
};

export default function BusinessSkillsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SkillsManager initialDomain="Business" domainTitle="Business &amp; Content" />
    </div>
  );
}
