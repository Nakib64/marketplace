import type { Metadata } from 'next';
import { JobsDirectoryTable } from '@/components/jobs/JobsDirectoryTable';
import { Brain } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI & Data Science Job Moderation | Banglance Admin',
  description: 'Moderate AI agents, machine learning, Python models, and data pipeline jobs.',
};

export default function AiJobsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">AI &amp; Machine Learning Jobs</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Audit generative AI, RAG pipelines, LLM integration, and deep learning job requirements.
          </p>
        </div>
      </div>

      <JobsDirectoryTable initialCategory="AI" nicheTitle="AI" />
    </div>
  );
}
