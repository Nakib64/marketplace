import type { Metadata } from 'next';
import { JobsDirectoryTable } from '@/components/jobs/JobsDirectoryTable';
import { Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Job Moderation & Proposals | Banglance Admin',
  description: 'Moderate job postings, review proposals, adjust budgets, and handle job reports.',
};

export default function AdminJobsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Job Moderation &amp; Proposals</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Audit public job postings, inspect submitted proposals, enforce content guidelines, and adjust escrow requirements.
          </p>
        </div>
      </div>

      <JobsDirectoryTable />
    </div>
  );
}
