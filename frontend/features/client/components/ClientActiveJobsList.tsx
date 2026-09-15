'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Job } from '@/features/jobs/types/jobsTypes';
import { ClientDisplayJob, JobFilterTab } from '../types/clientTypes';
import { ClientJobCard } from './ClientJobCard';

interface ClientActiveJobsListProps {
  jobs: Job[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

type SortOption = 'newest' | 'oldest' | 'budget-high' | 'budget-low' | 'proposals';

export const ClientActiveJobsList: React.FC<ClientActiveJobsListProps> = ({
  jobs,
  isLoading = false,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<JobFilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Compute status counts
  const counts = useMemo(() => {
    return {
      all: jobs.length,
      open: jobs.filter((j) => j.status === 'OPEN').length,
      inProgress: jobs.filter((j) => j.status === 'IN_PROGRESS').length,
      completed: jobs.filter((j) => j.status === 'COMPLETED').length,
      canceled: jobs.filter((j) => j.status === 'CANCELED' || j.status === 'CANCELLED').length,
    };
  }, [jobs]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = (jobs as ClientDisplayJob[]).filter((job) => {
      // Tab filter
      if (activeTab === 'OPEN' && job.status !== 'OPEN') return false;
      if (activeTab === 'IN_PROGRESS' && job.status !== 'IN_PROGRESS') return false;
      if (activeTab === 'COMPLETED' && job.status !== 'COMPLETED') return false;
      if (activeTab === 'CANCELED' && job.status !== 'CANCELED' && job.status !== 'CANCELLED') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesDesc = job.description?.toLowerCase().includes(query) ?? false;
        const matchesCategory =
          job.category?.name.toLowerCase().includes(query) ||
          job.categoryName?.toLowerCase().includes(query) ||
          false;
        const matchesSubCategory =
          job.subCategory?.name.toLowerCase().includes(query) ||
          job.subCategoryName?.toLowerCase().includes(query) ||
          false;
        const matchesSkills = job.skills?.some((s) => s.toLowerCase().includes(query)) ?? false;

        return matchesTitle || matchesDesc || matchesCategory || matchesSubCategory || matchesSkills;
      }

      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'budget-high') return Number(b.budget) - Number(a.budget);
      if (sortBy === 'budget-low') return Number(a.budget) - Number(b.budget);
      if (sortBy === 'proposals') {
        const countA = a._count?.proposals ?? a.proposalsCount ?? 0;
        const countB = b._count?.proposals ?? b.proposalsCount ?? 0;
        return countB - countA;
      }
      return 0;
    });

    return result;
  }, [jobs, activeTab, searchQuery, sortBy]);

  const tabs: { key: JobFilterTab; label: string; count: number }[] = [
    { key: 'ALL', label: 'All Postings', count: counts.all },
    { key: 'OPEN', label: 'Open · Hiring', count: counts.open },
    { key: 'IN_PROGRESS', label: 'In Progress', count: counts.inProgress },
    { key: 'COMPLETED', label: 'Completed', count: counts.completed },
    { key: 'CANCELED', label: 'Canceled', count: counts.canceled },
  ];

  return (
    <div className="flex flex-col gap-5 pt-2">
      {/* Title & Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[24px] text-primary">work</span>
          <h2 className="text-xl font-bold text-on-surface">My Job Postings &amp; Management</h2>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-xs text-on-surface-variant font-semibold">
            {jobs.length} Total
          </span>
        </div>
        <Link
          href="/client/jobs/new"
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Filter Tabs & Search / Sort Controls */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-outline-variant/20">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, skills, or category..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-on-surface-variant whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer w-full sm:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget-high">Highest Budget</option>
              <option value="budget-low">Lowest Budget</option>
              <option value="proposals">Most Proposals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 flex flex-col gap-4 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="w-1/3 h-5 bg-surface-container rounded"></div>
                <div className="w-20 h-5 bg-surface-container rounded"></div>
              </div>
              <div className="w-2/3 h-4 bg-surface-container rounded"></div>
              <div className="w-full h-12 bg-surface-container rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Zero Jobs Empty State */}
      {!isLoading && jobs.length === 0 && (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">post_add</span>
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-lg font-bold text-on-surface">You haven&apos;t posted any jobs yet</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Create your first project RFP to receive proposals, interview verified Web3 developers, and secure milestone escrows.
            </p>
          </div>
          <Link
            href="/client/jobs/new"
            className="mt-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Post Your First Job</span>
          </Link>
        </div>
      )}

      {/* Filter Yields Zero Results */}
      {!isLoading && jobs.length > 0 && filteredJobs.length === 0 && (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">search_off</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-bold text-on-surface">No jobs matching your filter</h4>
            <p className="text-xs text-on-surface-variant">
              {searchQuery ? `No listings matching "${searchQuery}".` : 'No listings in this status tab.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('ALL');
              setSearchQuery('');
            }}
            className="mt-1 px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Jobs Listing */}
      {!isLoading && filteredJobs.length > 0 && (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <ClientJobCard key={job.id} job={job} onRefresh={onRefresh} />
          ))}
        </div>
      )}
    </div>
  );
};
