import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Star, Heart } from 'lucide-react';
import { Job } from '../types/jobsTypes';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const proposalsCount = job._count?.proposals || 0;
  const companyName = job.client?.clientProfile?.companyName || 'Verified Client';

  return (
    <article className="group p-6 rounded-2xl bg-white border border-[#e4ebe4] hover:border-[#14a800] hover:bg-[#fcfdfc] transition-all duration-150 flex flex-col gap-3.5 shadow-xs">
      {/* Top Meta & Heart */}
      <div className="flex items-center justify-between text-xs text-[#5e6d55]">
        <span>Posted {formatRelativeTime(job.createdAt)}</span>
        <button
          type="button"
          aria-label="Save job"
          className="w-8 h-8 rounded-full border border-[#e4ebe4] hover:border-[#14a800] hover:text-[#14a800] flex items-center justify-center transition-colors text-[#5e6d55]"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Job Title */}
      <Link href={`/jobs/${job.slug || job.id}`}>
        <h3 className="text-lg md:text-xl font-medium text-[#001e00] group-hover:text-[#14a800] group-hover:underline transition-colors leading-snug cursor-pointer">
          {job.title}
        </h3>
      </Link>

      {/* Budget & Type Info */}
      <div className="text-xs text-[#5e6d55] flex flex-wrap items-center gap-2">
        <span className="font-semibold text-[#001e00]">Fixed-price</span>
        <span>-</span>
        <span>Est. budget: <strong className="text-[#001e00] font-semibold">{formatCurrency(job.budget)}</strong></span>
        <span>-</span>
        <span>{job.categoryName || job.category?.name || 'Development'}</span>
      </div>

      {/* Description Snippet */}
      <p className="text-sm text-[#001e00]/90 leading-relaxed line-clamp-2 font-normal">
        {job.description}
      </p>

      {/* Skills Pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {job.skills?.slice(0, 5).map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-full bg-[#f2f7f2] hover:bg-[#e4ebe4] text-xs font-medium text-[#001e00] transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Client Stats & Apply Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#e4ebe4] text-xs text-[#5e6d55]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[#14a800] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 fill-[#14a800] text-white" />
            Payment verified
          </span>
          <span className="flex items-center gap-1 font-semibold text-[#001e00]">
            <Star className="w-3.5 h-3.5 fill-[#14a800] text-[#14a800]" />
            5.0
          </span>
          <span>•</span>
          <span>{companyName}</span>
          <span>•</span>
          <span>Proposals: <strong>{proposalsCount}</strong></span>
        </div>

        <Link
          href={`/jobs/${job.slug || job.id}`}
          className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#14a800] hover:bg-[#108a00] text-white font-medium text-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          Apply Now
        </Link>
      </div>
    </article>
  );
}
