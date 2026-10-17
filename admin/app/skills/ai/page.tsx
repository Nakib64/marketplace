import type { Metadata } from 'next';
import { SkillsManager } from '@/components/skills/SkillsManager';

export const metadata: Metadata = {
  title: 'AI & Machine Learning Skills | Banglance Admin',
  description: 'Manage AI agents, LLMs, data science, and machine learning skill tags.',
};

export default function AiSkillsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SkillsManager initialDomain="AI" domainTitle="AI &amp; Data Science" />
    </div>
  );
}
