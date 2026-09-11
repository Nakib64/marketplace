'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ContractFilterTab, FreelancerContractItem } from '../types/freelancerTypes';

const DEMO_CONTRACTS: FreelancerContractItem[] = [
  {
    id: 'contract-1',
    title: 'Arbitrum Orbit AMM Rollup',
    clientName: 'Kroma Labs',
    amount: 8500,
    currency: 'USDC',
    contractAddress: '0x71c8...39A1',
    milestoneStep: 'Milestone 2 of 3',
    milestoneTitle: 'Foundry Fuzz Testing & Slither CI Pipeline',
    dueDate: 'Due in 3 days (Oct 24)',
    progressPct: 75,
    status: 'IN_PROGRESS',
  },
  {
    id: 'contract-2',
    title: 'ERC-4626 Yield Strategy Vault',
    clientName: 'Stader Labs',
    amount: 14200,
    currency: 'USDC',
    contractAddress: '0x49da...22A8',
    milestoneStep: 'Milestone 3 of 4',
    milestoneTitle: 'Yul Gas Assembly Optimization',
    dueDate: 'Review grace ends in 48 hours',
    progressPct: 100,
    status: 'PENDING_REVIEW',
  },
  {
    id: 'contract-3',
    title: 'zk-SNARK Identity Verifier',
    clientName: 'Nexus DAO',
    amount: 5000,
    currency: 'USDC',
    contractAddress: '0x32ba...119F',
    milestoneStep: 'Milestone 1 of 2',
    milestoneTitle: 'Circuit Architecture Specification',
    dueDate: 'Due in 11 days (Nov 01)',
    progressPct: 30,
    status: 'IN_PROGRESS',
  },
];

export const FreelancerActiveContracts: React.FC = () => {
  const [filter, setFilter] = useState<ContractFilterTab>('ALL');

  const filtered = DEMO_CONTRACTS.filter((c) => {
    if (filter === 'PENDING') return c.status === 'PENDING_REVIEW';
    if (filter === 'IN_PROGRESS') return c.status === 'IN_PROGRESS';
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-on-surface">Active Contracts</h2>
          <span className="font-mono text-xs bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
            {DEMO_CONTRACTS.length}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/20">
          {(['ALL', 'PENDING', 'IN_PROGRESS'] as ContractFilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filter === tab ? 'bg-surface-container text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
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
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-on-surface">{item.title}</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] text-primary bg-surface-container px-2 py-0.5 rounded font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Live Multi-Sig
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant mt-0.5 block">Client: {item.clientName}</span>
              </div>
              <div className="text-left sm:text-right">
                <div className="font-mono text-base font-bold text-on-surface">
                  ${item.amount.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">{item.currency}</span>
                </div>
                <span className="font-mono text-[11px] text-on-surface-variant">Contract {item.contractAddress}</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-mono font-semibold">{item.milestoneStep}</span>
                  <span className="text-outline-variant">•</span>
                  <span className="font-semibold text-on-surface">{item.milestoneTitle}</span>
                </div>
                <span className="text-on-surface-variant text-[11px]">{item.dueDate}</span>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                  <span>Milestone Progress</span>
                  <span className="text-on-surface">{item.progressPct}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${item.progressPct}%` }} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[15px] text-primary">lock_clock</span>
                <span>Time-lock active • Auto-release configured</span>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/contracts/${item.id}`} className="px-3.5 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg transition-colors border border-outline-variant/30">
                  Contract Details
                </Link>
                <button type="button" onClick={() => alert(`Submitting deliverable for ${item.title}...`)} className="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  <span>Submit Deliverable</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
