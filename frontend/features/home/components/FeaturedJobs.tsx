'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Lock } from 'lucide-react';

export function FeaturedJobs() {
  const [filter, setFilter] = useState('all');

  const jobs = [
    {
      id: '1',
      title: 'Senior NestJS & Distributed Backend Architect',
      description: 'Implement high-throughput Redis sliding-window rate limiters, BullMQ background moderation workers, and SSLCommerz escrow webhook listeners with Prisma ORM.',
      budget: '$8,500',
      budgetType: 'Fixed Price (Milestones)',
      tags: ['NestJS 12', 'PostgreSQL', 'Redis Queues', 'Docker'],
      proposals: '12 proposals received',
      posted: 'Posted 2 hours ago',
      verified: true,
      category: 'development',
    },
    {
      id: '2',
      title: 'Lead UI/UX Product Designer (Fintech & Escrow)',
      description: 'Revamp mobile and desktop dashboard workflows for dual-actor freelance marketplace. Create double-blind review system flows and bKash/Nagad withdrawal modals.',
      budget: '$4,200',
      budgetType: 'Fixed Price (Milestones)',
      tags: ['Figma Systems', 'Dark Mode UX', 'Prototyping', 'Fintech'],
      proposals: '8 proposals received',
      posted: 'Posted 4 hours ago',
      verified: true,
      category: 'design',
    },
    {
      id: '3',
      title: 'Next.js 16 App Router & Socket.io Real-Time Engineer',
      description: 'Build responsive 2-column live messaging hub with typing indicators, optimistic UI updates, and headless TanStack Query v5 state management.',
      budget: '$65/hr',
      budgetType: '30+ hrs/wk (Long-term)',
      tags: ['Next.js 16', 'React 19', 'Socket.io', 'Tailwind v4'],
      proposals: '5 proposals received',
      posted: 'Posted 6 hours ago',
      verified: true,
      category: 'development',
    },
  ];

  const filteredJobs = filter === 'all' ? jobs : jobs.filter((j) => j.category === filter);

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono text-primary uppercase tracking-widest block mb-1 font-semibold">
            ACTIVE SMART ESCROWS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Featured Projects Ready for Bids
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1 bg-surface-container-low rounded-xl gap-1 border border-outline-variant/30 overflow-x-auto">
          {['all', 'development', 'design'].map((cat) => (
            <button
              key={cat}
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
      </div>

      <div className="flex flex-col gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-6 rounded-2xl bg-surface-container border border-outline-variant/40 hover:bg-surface-container-high hover:border-primary/40 transition-all duration-200 shadow-xs"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-mono">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> KYC Verified
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-secondary">
                    <Lock className="w-3.5 h-3.5" /> Escrow Funded
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

                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  {job.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30">
                      {tag}
                    </span>
                  ))}
                  <span className="text-outline pl-2 text-[11px]">{job.proposals}</span>
                </div>
              </div>

              <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-outline-variant/30">
                <div className="text-left lg:text-right font-mono">
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
    </section>
  );
}
