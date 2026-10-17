import type { Metadata } from 'next';
import { JobsDirectoryTable } from '@/components/jobs/JobsDirectoryTable';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Flagged Jobs Moderation Queue | Banglance Admin',
  description: 'Inspect jobs flagged by community reports or automated risk moderation rules.',
};

export default function FlaggedJobsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Flagged Jobs &amp; Moderation Queue</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Prioritized queue of job postings flagged for inappropriate content, policy violations, or suspicious escrow terms.
          </p>
        </div>
      </div>

      <JobsDirectoryTable onlyFlagged={true} nicheTitle="Flagged Jobs" />
    </div>
  );
}
