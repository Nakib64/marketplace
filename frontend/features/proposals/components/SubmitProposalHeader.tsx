'use client';

import React from 'react';
import Link from 'next/link';

interface SubmitProposalHeaderProps {
  jobId: string;
  jobTitle?: string;
  categoryName?: string;
}

export const SubmitProposalHeader: React.FC<SubmitProposalHeaderProps> = ({
  jobId,
  jobTitle = 'Arbitrum AMM Architecture Spec',
  categoryName = 'DeFi Infrastructure',
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-outline-variant/30">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center flex-wrap gap-1.5 text-on-surface-variant text-xs font-medium">
          <Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
          <span className="text-surface-container-highest">/</span>
          <span className="text-on-surface-variant">{categoryName}</span>
          <span className="text-surface-container-highest">/</span>
          <Link href={`/jobs/${jobId}`} className="text-on-surface-variant hover:text-on-surface truncate max-w-xs transition-colors">
            {jobTitle}
          </Link>
          <span className="text-surface-container-highest">/</span>
          <span className="text-on-surface font-semibold">Submit Proposal</span>
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">Contract Proposal</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
          <div className="flex flex-col">
            <span className=" text-[10px] text-on-surface-variant uppercase tracking-wider leading-none">Protection</span>
            <span className="text-xs text-on-surface font-medium leading-tight">Payment Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
