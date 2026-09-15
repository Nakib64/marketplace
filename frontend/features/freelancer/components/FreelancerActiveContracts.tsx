'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ContractFilterTab, FreelancerContractItem } from '../types/freelancerTypes';
import { contractsApi } from '@/features/contracts/api/contractsApi';

const DEMO_CONTRACTS: FreelancerContractItem[] = [
  {
    id: 'contract-1',
    title: 'Frontend & API Integration',
    clientName: 'Acme Corp',
    amount: 8500,
    currency: 'USDC',
    contractAddress: '',
    milestoneStep: 'Milestone 2 of 3',
    milestoneTitle: 'Unit Testing & CI Pipeline',
    dueDate: 'Due in 3 days',
    progressPct: 75,
    status: 'IN_PROGRESS',
  },
  {
    id: 'contract-2',
    title: 'Performance & Optimization',
    clientName: 'Stader Group',
    amount: 14200,
    currency: 'USDC',
    contractAddress: '',
    milestoneStep: 'Milestone 3 of 4',
    milestoneTitle: 'Performance Benchmarks & Profiling',
    dueDate: 'Review pending client sign-off',
    progressPct: 100,
    status: 'PENDING_REVIEW',
  },
  {
    id: 'contract-3',
    title: 'Authentication Module',
    clientName: 'Nexus Tech',
    amount: 5000,
    currency: 'USDC',
    contractAddress: '',
    milestoneStep: 'Milestone 1 of 2',
    milestoneTitle: 'Architecture Specification',
    dueDate: 'Due in 11 days',
    progressPct: 30,
    status: 'IN_PROGRESS',
  },
];

export const FreelancerActiveContracts: React.FC = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<ContractFilterTab>('ALL');
  const [contracts, setContracts] = useState<FreelancerContractItem[]>(DEMO_CONTRACTS);

  useEffect(() => {
    let isMounted = true;
    contractsApi.getUserContracts()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          const mapped: FreelancerContractItem[] = data.map((c) => {
            const isPending = c.status === 'PENDING_APPROVAL';
            return {
              id: c.id,
              title: c.title || 'Project Milestone',
              clientName: c.clientName || 'Client',
              amount: Number(c.amount || 0),
              currency: c.currency || 'BDT',
              contractAddress: '',
              milestoneStep: 'Milestone 1 of 1',
              milestoneTitle: c.title || 'Deliverable Submission',
              dueDate: isPending ? 'Under Review' : 'In Progress',
              progressPct: c.status === 'COMPLETED' ? 100 : (isPending ? 95 : 60),
              status: isPending ? 'PENDING_REVIEW' : (c.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'),
            };
          });
          setContracts(mapped);
        }
      })
      .catch(() => {
        // Fall back gracefully to demo contracts
      });
    return () => { isMounted = false; };
  }, []);

  const filtered = contracts.filter((c) => {
    if (filter === 'PENDING') return c.status === 'PENDING_REVIEW';
    if (filter === 'IN_PROGRESS') return c.status === 'IN_PROGRESS';
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-on-surface">Active Contracts</h2>
          <span className=" text-xs bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
            {contracts.length}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/20">
          {(['ALL', 'PENDING', 'IN_PROGRESS'] as ContractFilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${filter === tab ? 'bg-surface-container text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >
              {tab === 'ALL' ? 'All' : tab === 'PENDING' ? 'Pending Review' : 'In Progress'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-on-surface">{item.title}</h3>
                <span className="text-xs text-on-surface-variant mt-0.5 block">Client: {item.clientName}</span>
              </div>
              <div className="text-left sm:text-right">
                <div className=" text-base font-bold text-on-surface">
                  ${item.amount.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">{item.currency}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-semibold">{item.milestoneStep}</span>
                  <span className="text-outline-variant">•</span>
                  <span className="font-semibold text-on-surface">{item.milestoneTitle}</span>
                </div>
                <span className="text-on-surface-variant text-[11px]">{item.dueDate}</span>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant ">
                  <span>Milestone Progress</span>
                  <span className="text-on-surface">{item.progressPct}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${item.progressPct}%` }} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">security</span>
                <span>Payment Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/contracts/${item.id}`} className="px-3.5 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg transition-colors border border-outline-variant/30">
                  Contract Details
                </Link>
                <button
                  type="button"
                  onClick={() => router.push(`/contracts/${item.id}`)}
                  className="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  <span>Submit Work</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


