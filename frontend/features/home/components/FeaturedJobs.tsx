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
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#001e00] font-normal tracking-tight">
            Recent projects ready for bids
          </h2>
          <p className="text-sm text-[#5e6d55] mt-1">
            Discover verified jobs with escrow milestones and instant local payouts.
          </p>
        </div>

        {/* Upwork Filter Tabs */}
        {liveJobs.length > 0 && (
          <div className="flex items-center gap-1 border-b border-[#e4ebe4] pb-1 overflow-x-auto">
            {['all', 'development', 'design'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm font-semibold capitalize transition-colors cursor-pointer border-b-2 -mb-1.5 ${
                  filter === cat
                    ? 'border-[#14a800] text-[#14a800]'
                    : 'border-transparent text-[#5e6d55] hover:text-[#001e00]'
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
            <div key={i} className="p-7 rounded-2xl bg-[#f9faf9] border border-[#e4ebe4] animate-pulse h-44 shadow-xs" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-[#e4ebe4] flex flex-col items-center justify-center text-center gap-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#f2f7f2] border border-[#e4ebe4] text-[#14a800] flex items-center justify-center">
            <span className="material-symbols-outlined text-[30px]">work_outline</span>
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-lg font-bold text-[#001e00] tracking-tight">No Featured Jobs at This Moment</h3>
            <p className="text-sm text-[#5e6d55] leading-relaxed">
              Explore all available freelance opportunities or post a new job to hire verified talent with milestone protection.
            </p>
          </div>
          <Link
            href="/jobs"
            className="mt-2 px-6 py-2.5 rounded-full bg-[#14a800] hover:bg-[#108a00] text-white font-semibold text-xs transition-colors shadow-xs"
          >
            Explore All Jobs
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 md:p-7 rounded-2xl bg-white border border-[#e4ebe4] hover:border-[#14a800] hover:shadow-xs transition-all duration-150"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-[#5e6d55]">
                    <span className="text-[#5e6d55]">{job.posted}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#001e00]">{job.budgetType}</span>
                    <span>•</span>
                    <span className="text-[#14a800] font-bold">Est. Budget: {job.budget}</span>
                  </div>

                  <Link href={`/jobs/${job.id}`}>
                    <h3 className="text-xl font-bold text-[#001e00] mb-2 hover:text-[#14a800] hover:underline transition-colors cursor-pointer tracking-tight">
                      {job.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-[#5e6d55] line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs mb-4">
                    {job.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-[#f2f7f2] hover:bg-[#e4ebe4] text-[#001e00] font-medium border border-[#e4ebe4]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Client Info Line (Upwork Signature) */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#5e6d55] pt-3 border-t border-[#f2f7f2]">
                    <span className="inline-flex items-center gap-1 text-[#14a800] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-[#14a800] text-white" /> Payment verified
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#001e00] font-medium">
                      <Lock className="w-3.5 h-3.5 text-[#14a800]" /> Escrow Secured
                    </span>
                    <span>{job.proposals}</span>
                  </div>
                </div>

                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#e4ebe4] shrink-0">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-6 py-2.5 rounded-full bg-[#14a800] hover:bg-[#108a00] text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer whitespace-nowrap"
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
