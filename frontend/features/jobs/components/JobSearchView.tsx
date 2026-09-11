'use client';

import React from 'react';
import { useJobsSearch } from '../hooks/useJobsSearch';
import { JobSearchBar } from './JobSearchBar';
import { JobFilterSidebar } from './JobFilterSidebar';
import { JobFeedList } from './JobFeedList';

export function JobSearchView() {
  const {
    jobs,
    total,
    page,
    totalPages,
    isLoading,
    currentParams,
    updateFilters,
    clearFilters,
  } = useJobsSearch();

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
