import type { Metadata } from 'next';
import { SkillsManager } from '@/components/skills/SkillsManager';

export const metadata: Metadata = {
  title: 'Design & Creative Skills | Banglance Admin',
  description: 'Manage UI/UX, product design, branding, and design systems skill tags.',
};

export default function DesignSkillsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SkillsManager initialDomain="Design" domainTitle="UI/UX &amp; Design" />
    </div>
  );
}
