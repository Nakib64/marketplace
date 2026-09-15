'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useJobsSearch } from '../hooks/useJobsSearch';
import { JobSearchBar } from './JobSearchBar';
import { JobFilterSidebar } from './JobFilterSidebar';
import { JobFeedList } from './JobFeedList';

export function JobSearchView() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const isClient = isAuthenticated && user?.role === 'CLIENT';

  useEffect(() => {
    if (isClient) {
      router.replace('/client/jobs');
    }
  }, [isClient, router]);

  const {
    jobs,
    total,
    page,
    totalPages,
    isLoading,
    currentParams,
    updateFilters,
    clearFilters,
  } = useJobsSearch(!isClient);

  // If client, render redirection safeguard and prevent any display of open marketplace jobs
  if (isClient) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-on-surface mb-2">Client Workspace Redirection</h2>
        <p className="text-xs text-on-surface-variant max-w-md mb-6 leading-relaxed">
          Job browsing is reserved for freelancers looking for work. Clients manage their posted jobs, review proposals, and hire talent from their dedicated client workspace.
        </p>
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs font-medium text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting to your job posts dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      {/* Top Search & Filter Bar */}
      <JobSearchBar currentParams={currentParams} onSearch={updateFilters} />

      {/* Main Two-Column Workspace Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
        {/* Left Column: Filter Sidebar */}
        <JobFilterSidebar
          currentParams={currentParams}
          onUpdate={updateFilters}
          onClear={clearFilters}
        />

        {/* Right Column: Job Feed List */}
        <JobFeedList
          jobs={jobs}
          total={total}
          page={page}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={(p) => updateFilters({ page: p })}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  );
}
