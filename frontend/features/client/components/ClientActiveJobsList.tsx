'use client';

import React, { useState } from 'react';
import { Job } from '@/features/jobs/types/jobsTypes';
import { ClientDisplayJob, JobFilterTab } from '../types/clientTypes';
import { ClientJobCard } from './ClientJobCard';

interface ClientActiveJobsListProps {
  jobs: Job[];
  isLoading?: boolean;
}

const DEMO_JOBS: ClientDisplayJob[] = [
  {
    id: 'demo-job-1',
    title: 'ERC-4337 Account Abstraction Paymaster Security Audit',
    categoryName: 'Smart Contract Audit',
    budget: 12000,
    status: 'OPEN',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    proposalsCount: 14,
    leadCandidate: 'Dev Audit Team (5.0★)',
  },
  {
    id: 'demo-job-2',
    title: 'Optimism Superchain Cross-L2 Liquidity Rebalancing Bot',
    categoryName: 'Bot & Infrastructure',
    budget: 9500,
    status: 'OPEN',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    proposalsCount: 8,
  },
];

export const ClientActiveJobsList: React.FC<ClientActiveJobsListProps> = ({ jobs }) => {
  const [activeTab, setActiveTab] = useState<JobFilterTab>('ALL');

  const combinedJobs: ClientDisplayJob[] = jobs.length > 0 ? (jobs as ClientDisplayJob[]) : DEMO_JOBS;
  const displayJobs = combinedJobs.filter((job) => {
    if (activeTab === 'ACTIVE') return job.status === 'OPEN' || job.status === 'IN_PROGRESS';
    if (activeTab === 'DRAFTS') return job.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-on-surface">Active Jobs &amp; Open Proposals</h2>
        <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/30 rounded-lg">
          {(['ALL', 'ACTIVE', 'DRAFTS'] as JobFilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === tab ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab === 'ALL' ? `All Postings (${combinedJobs.length})` : tab === 'ACTIVE' ? 'Active Hiring' : 'Drafts'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {displayJobs.map((job) => (
          <ClientJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};
