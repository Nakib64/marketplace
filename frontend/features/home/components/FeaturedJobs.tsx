'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Lock } from 'lucide-react';
import { jobsApi } from '@/features/jobs/api/jobsApi';

export function FeaturedJobs() {
  const [filter, setFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: () => jobsApi.searchJobs({ limit: 6 }),
  });

  const liveJobs = (data?.data && data.data.length > 0)
    ? data.data.map((j) => ({
        id: j.slug || j.id,
        title: j.title,
        description: j.description,
        budget: `৳${Number(j.budget).toLocaleString()} BDT`,
        budgetType: 'Fixed Price (Milestones)',
        tags: j.skills || [],
        proposals: `${j._count?.proposals || 0} proposals received`,
        posted: 'Recently posted',
        category: (j.categoryName || j.category?.name || 'development').toLowerCase(),
      }))
    : [];

  const filteredJobs = filter === 'all'
    ? liveJobs
    : liveJobs.filter((j) => j.category.includes(filter) || j.tags.some((t) => t.toLowerCase().includes(filter)));

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs text-primary uppercase tracking-widest block mb-1 font-semibold">
            ACTIVE PROJECTS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Featured Projects Ready for Bids
          </h2>
        </div>

        {/* Filter Tabs */}
        {liveJobs.length > 0 && (
          <div className="flex items-center p-1 bg-surface-container-low rounded-xl gap-1 border border-outline-variant/30 overflow-x-auto">
            {['all', 'development', 'design'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-surface-container-highest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-surface-container border border-outline-variant/20 animate-pulse h-40" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-10 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col items-center justify-center text-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">work_outline</span>
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-base font-bold text-on-surface">No Featured Jobs at This Moment</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Explore all available freelance opportunities or post a new job to hire verified talent with milestone protection.
            </p>
          </div>
          <Link
            href="/jobs"
            className="mt-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors shadow-sm"
          >
            Explore All Jobs
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-2xl bg-surface-container border border-outline-variant/40 hover:bg-surface-container-high hover:border-primary/40 transition-all duration-200 shadow-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Client
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-secondary">
                      <Lock className="w-3.5 h-3.5" /> Payment Protected
                    </span>
                    <span className="text-outline pl-1">{job.posted}</span>
                  </div>

                  <Link href={`/jobs/${job.id}`}>
                    <h3 className="text-lg font-bold text-on-surface mb-2 hover:text-primary transition-colors cursor-pointer">
                      {job.title}
                    </h3>
                  </Link>

                  <p className="text-xs md:text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {job.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30">
                        {tag}
                      </span>
                    ))}
                    <span className="text-outline pl-2 text-[11px]">{job.proposals}</span>
                  </div>
                </div>

                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-outline-variant/30">
                  <div className="text-left lg:text-right">
                    <span className="text-xl lg:text-2xl text-primary font-bold block">{job.budget}</span>
                    <span className="text-[10px] text-on-surface-variant uppercase">{job.budgetType}</span>
                  </div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-5 py-2.5 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-tertiary transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
