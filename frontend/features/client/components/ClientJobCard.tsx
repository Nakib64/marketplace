'use client';

import React from 'react';
import Link from 'next/link';
import { ClientDisplayJob } from '../types/clientTypes';

interface ClientJobCardProps {
  job: ClientDisplayJob;
}

export const ClientJobCard: React.FC<ClientJobCardProps> = ({ job }) => {
  const proposalCount = job._count?.proposals ?? job.proposalsCount ?? 0;

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 lg:p-5 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-surface-container text-primary text-xs font-medium">
              {job.category?.name || job.categoryName || 'Web3 Engineering'}
            </span>
            <span className="text-on-surface-variant text-xs font-mono">
              {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h3 className="text-base font-bold text-on-surface">{job.title}</h3>
        </div>
        <div className="flex flex-col sm:items-end">
          <span className="text-base font-bold text-on-surface">
            ${job.budget.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">USDC</span>
          </span>
          <span className="text-xs text-on-surface-variant">Fixed Escrow</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-surface-container rounded-lg">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">assignment_ind</span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-on-surface">{proposalCount} Proposals</span>
            <span className="text-[11px] text-on-surface-variant">Shortlist ready</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">forum</span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-on-surface">1 Active Interview</span>
            <span className="text-[11px] text-on-surface-variant">Arbitrum Vault</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">verified</span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-on-surface">Lead Candidate</span>
            <span className="text-[11px] text-on-surface-variant">{job.leadCandidate || 'Review in progress'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
          <span>Receiving bids · Arbitrum network deposit ready</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/jobs/${job.id}`}
            className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
          >
            Manage Listing
          </Link>
          <Link
            href={`/client/jobs/${job.id}/proposals`}
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
          >
            <span>Review {proposalCount > 0 ? proposalCount : ''} Bids</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
