import React from 'react';
import { ShieldCheck, Clock, Globe, Briefcase } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { Job } from '../types/jobsTypes';

interface JobDetailsHeaderProps {
  job: Job;
}

export function JobDetailsHeader({ job }: JobDetailsHeaderProps) {
  const proposalCount = job._count?.proposals ?? 0;
  const categoryLabel = job.category?.name || job.categoryName || 'Web & Software';

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm">
      {/* Verification & Category Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-xs font-semibold text-on-surface">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          100% Escrow Funded
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-xs font-semibold text-on-surface-variant">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          KYC Verified Client
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-xs font-semibold text-secondary">
          {categoryLabel}
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight leading-snug mb-3">
        {job.title}
      </h1>

      {/* Metadata Bar */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-on-surface-variant text-sm pb-6 border-b border-outline-variant/20">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary" />
          Posted {formatRelativeTime(job.createdAt)}
        </span>
        <span className="text-outline-variant">•</span>
        <span className="flex items-center gap-1.5">
          <Globe className="w-4 h-4" />
          Remote / Worldwide
        </span>
        <span className="text-outline-variant">•</span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="w-4 h-4" />
          Fixed Price Contract
        </span>
      </div>

      {/* Live Activity Snapshot Bar */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 bg-surface-container rounded-xl p-4 border border-outline-variant/20">
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant font-medium">Proposals</span>
          <span className="text-lg font-bold text-on-surface">
            {proposalCount} {proposalCount === 1 ? 'submitted' : 'submitted'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant font-medium">Status</span>
          <span className="text-lg font-bold text-primary capitalize">
            {job.status.toLowerCase().replace('_', ' ')}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant font-medium">Client Activity</span>
          <span className="text-xs font-mono text-primary flex items-center gap-1 mt-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Active Recently
          </span>
        </div>
      </div>
    </section>
  );
}
