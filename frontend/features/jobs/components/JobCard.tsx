import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Building2 } from 'lucide-react';
import { Job } from '../types/jobsTypes';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const proposalsCount = job._count?.proposals || 0;
  const companyName = job.client?.clientProfile?.companyName || 'Verified Employer';

  return (
    <article className="bg-surface-container rounded-2xl p-5 md:p-6 border border-outline-variant/40 hover:bg-surface-container-high hover:border-primary/40 transition-all duration-200 shadow-xs flex flex-col gap-4">
      {/* Header Badges & Posted Time */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            100% Escrow Funded
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-secondary">
            <CheckCircle2 className="w-3.5 h-3.5" />
            KYC Verified
          </span>
        </div>
        <span className="text-outline flex items-center gap-1 text-[11px]">
          <Clock className="w-3.5 h-3.5" />
          {formatRelativeTime(job.createdAt)}
        </span>
      </div>

      {/* Title & Client Overview */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <Link href={`/jobs/${job.id}`}>
            <h3 className="text-base md:text-lg font-bold text-on-surface hover:text-primary transition-colors cursor-pointer mb-1.5">
              {job.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-outline text-xs">
            <span className="font-semibold text-on-surface flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              {companyName}
            </span>
            <span>•</span>
            <span className="text-on-surface-variant font-mono">{job.categoryName || job.category?.name || 'General'}</span>
          </div>
        </div>

        {/* Budget Pill */}
        <div className="text-left md:text-right font-mono shrink-0">
          <span className="text-lg md:text-xl font-bold text-primary block">
            {formatCurrency(job.budget)}
          </span>
          <span className="text-[10px] text-on-surface-variant uppercase">Fixed Price (Milestones)</span>
        </div>
      </div>

      {/* Job Description */}
      <p className="text-xs md:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Skills & Apply Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-outline-variant/30">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {job.skills?.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 rounded-lg bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30"
            >
              {skill}
            </span>
          ))}
          <span className="text-outline text-[11px] pl-2">
            {proposalsCount} {proposalsCount === 1 ? 'proposal' : 'proposals'}
          </span>
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="px-5 py-2 rounded-xl bg-primary text-surface font-semibold text-xs hover:bg-tertiary transition-all duration-200 shadow-xs text-center cursor-pointer whitespace-nowrap"
        >
          View &amp; Apply
        </Link>
      </div>
    </article>
  );
}
