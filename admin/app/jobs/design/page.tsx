import type { Metadata } from 'next';
import { JobsDirectoryTable } from '@/components/jobs/JobsDirectoryTable';
import { Paintbrush } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Design & Creative Job Moderation | Banglance Admin',
  description: 'Moderate UI/UX design, design systems, Figma, and creative branding job posts.',
};

export default function DesignJobsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Design &amp; Creative Systems Jobs</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Audit user interface, UX prototypes, branding design, and design system contracts.
          </p>
        </div>
      </div>

      <JobsDirectoryTable initialCategory="Design" nicheTitle="Design" />
    </div>
  );
}
