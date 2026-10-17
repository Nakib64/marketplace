import type { Metadata } from 'next';
import { SkillsManager } from '@/components/skills/SkillsManager';

export const metadata: Metadata = {
  title: 'Tech & Engineering Skills | Banglance Admin',
  description: 'Manage development, cloud, frontend, backend, and DevOps skill tags.',
};

export default function TechSkillsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SkillsManager initialDomain="Development" domainTitle="Engineering &amp; Tech" />
    </div>
  );
}
