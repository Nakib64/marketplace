import type { Metadata } from 'next';
import { SkillsManager } from '@/components/skills/SkillsManager';

export const metadata: Metadata = {
  title: 'Skills Directory & Tags | Banglance Admin',
  description: 'Manage verified skills, tag metadata, and technical domains.',
};

export default function AdminSkillsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SkillsManager />
    </div>
  );
}
