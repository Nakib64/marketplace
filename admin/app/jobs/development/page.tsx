import type { Metadata } from 'next';
import { JobsDirectoryTable } from '@/components/jobs/JobsDirectoryTable';
import { Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering & Dev Job Moderation | Banglance Admin',
  description: 'Moderate software development, architecture, backend, and fullstack job posts.',
};

export default function DevelopmentJobsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Development &amp; Engineering Jobs</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Audit Next.js, NestJS, TypeScript, Python, and cloud infrastructure listings.
          </p>
        </div>
      </div>

      <JobsDirectoryTable initialCategory="Development" nicheTitle="Development" />
    </div>
  );
}
