'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { Job } from '../types/jobsTypes';
import { JobCard } from './JobCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

interface JobFeedListProps {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function JobFeedList({
  jobs,
  total,
  page,
  totalPages,
  isLoading,
  onPageChange,
  onClearFilters,
}: JobFeedListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-surface-container animate-pulse border border-outline-variant/30" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex-1">
        <EmptyState
          icon={Briefcase}
          title="No Open Jobs Found"
          description="We couldn't find any job postings matching your current search criteria. Try adjusting your filters or search keywords."
          actionLabel="Clear All Filters"
          onAction={onClearFilters}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Feed Control Header */}
      <div className="flex items-center justify-between bg-surface-container rounded-xl px-5 py-3 border border-outline-variant/40 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-on-surface text-sm">{total} Projects Found</span>
          <span className="text-outline">•</span>
          <span className="text-primary font-semibold">Page {page} of {totalPages}</span>
        </div>
      </div>

      {/* Jobs Cards Feed */}
      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <span className="px-4 text-xs font-mono text-on-surface-variant">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
