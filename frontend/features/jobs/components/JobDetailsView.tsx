'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import { Job } from '../types/jobsTypes';
import { JobDetailsBreadcrumb } from './JobDetailsBreadcrumb';
import { JobDetailsHeader } from './JobDetailsHeader';
import { JobScopeCard } from './JobScopeCard';
import { JobMilestonesCard } from './JobMilestonesCard';
import { JobMetaActions } from './JobMetaActions';
import { JobBudgetActionCard } from './JobBudgetActionCard';
import { JobClientCard } from './JobClientCard';
import { JobSecurityCard } from './JobSecurityCard';
import { JobDetailsBottomBar } from './JobDetailsBottomBar';
import { ReportJobModal } from './ReportJobModal';

interface JobDetailsViewProps {
  job: Job;
}

export function JobDetailsView({ job }: JobDetailsViewProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);

  const isBookmarked = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange);
      return () => window.removeEventListener('storage', onStoreChange);
    },
    () => {
      try {
        return localStorage.getItem(`saved_job_${job.id}`) === 'true';
      } catch {
        return false;
      }
    },
    () => false
  );

  const handleToggleBookmark = () => {
    try {
      const nextState = !isBookmarked;
      if (nextState) {
        localStorage.setItem(`saved_job_${job.id}`, 'true');
        toast.success('Job saved to your bookmarks.');
      } else {
        localStorage.removeItem(`saved_job_${job.id}`);
        toast.info('Job removed from bookmarks.');
      }
      window.dispatchEvent(new Event('storage'));
    } catch {
      // Ignore localStorage errors
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <JobDetailsBreadcrumb
        categoryName={job.category?.name || job.categoryName}
        categorySlug={job.category?.slug}
        jobTitle={job.title}
      />

      {/* Two-Column Responsive Workspace Grid (70% main, 30% sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Primary Details Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <JobDetailsHeader job={job} />
          <JobScopeCard job={job} />
          <JobMilestonesCard job={job} />
          <JobMetaActions
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
            onOpenReport={() => setIsReportOpen(true)}
          />
        </div>

        {/* Right Sticky Sidebar Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          <JobBudgetActionCard
            job={job}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
          />
          <JobClientCard client={job.client} />
          <JobSecurityCard />
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <JobDetailsBottomBar job={job} />

      {/* Abuse Report Modal */}
      <ReportJobModal
        jobId={job.id}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
